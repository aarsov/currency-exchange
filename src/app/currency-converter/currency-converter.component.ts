import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent {

  amount: number = 0;
  from: string = '';
  to: string = '';
  convertedAmount: number = 0;

  currencies: string[] = [];

  private apiUrl = 'https://v6.exchangerate-api.com/v6/c9aa3cd40d80206acefc63ed/latest/USD';
  conversionRates: { [key: string]: number } = {};

  constructor(private http: HttpClient) {
    this.fetchConversionRates();
  }

  fetchConversionRates() {
    this.http.get<any>(this.apiUrl).subscribe(
      (response) => {
        this.conversionRates = response.conversion_rates;
        this.currencies = Object.keys(this.conversionRates);
      },
      (error) => {
        console.error('Error fetching conversion rates:', error);
      }
    );
  }

  convert() {
    const conversionKey = `${this.from.toUpperCase()}-${this.to.toUpperCase()}`;

    if (!this.from || !this.to) {
      console.error('Please select both "From" and "To" currencies.');
      return;
    }

    if (this.conversionRates && this.conversionRates.hasOwnProperty(conversionKey)) {
      const conversionRate = this.conversionRates[conversionKey];

      if (isNaN(this.amount)) {
        console.error('Please enter a valid number in the "Amount" field.');
        return;
      }

      this.convertedAmount = this.amount * conversionRate;
    } else {
      console.error(`Conversion rate not available for ${conversionKey}`);
    }
  }

  clear() {
    this.amount = 0;
    this.from = '';
    this.to = '';
    this.convertedAmount = 0;
  }
}
