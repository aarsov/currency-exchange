import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from "rxjs";

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

  fetchConversionRatesForBaseCurrency(baseCurrency: string): Observable<any> {
    this.apiUrl = `https://v6.exchangerate-api.com/v6/c9aa3cd40d80206acefc63ed/latest/${baseCurrency}`;

    return this.http.get<any>(this.apiUrl).pipe(
      catchError((error) => {
        console.error(`Error fetching conversion rates for ${baseCurrency}:`, error);
        return throwError(error);
      })
    );
  }

  fetchConversionRates() {
    this.fetchConversionRatesForBaseCurrency('USD').subscribe(
      (response) => {
        this.conversionRates = response.conversion_rates;
        this.currencies = Object.keys(this.conversionRates);
      },
      (error) => {
        console.error(`Error fetching conversion rates for USD:`, error);
      }
    );;
  }

  convert() {
    if (!this.from || !this.to) {
      console.error('Please select both "From" and "To" currencies.');
      return;
    }

    const baseCurrency = this.from.toUpperCase();
    this.fetchConversionRatesForBaseCurrency(baseCurrency).subscribe(
      (response) => {
        this.conversionRates = response.conversion_rates;
        this.currencies = Object.keys(this.conversionRates);

        const conversionKey = `${this.to.toUpperCase()}`;

        if (this.conversionRates && this.conversionRates.hasOwnProperty(conversionKey)) {
          const conversionRate = this.conversionRates[conversionKey];

          if (isNaN(this.amount)) {
            alert('Please enter a valid number in the "Amount" field.');
            return;
          }

          this.convertedAmount = this.amount * conversionRate;
        } else {
          console.error(`Conversion rate not available for ${conversionKey}`);
        }
      }
    );
  }

  clear() {
    this.amount = 0;
    this.from = '';
    this.to = '';
    this.convertedAmount = 0;
  }
}