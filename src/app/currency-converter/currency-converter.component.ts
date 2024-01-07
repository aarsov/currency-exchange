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

  // Define your list of currencies
  currencies: string[] = [];

  // Update the API endpoint
  private apiUrl = 'https://v6.exchangerate-api.com/v6/c9aa3cd40d80206acefc63ed/latest/USD';

  // Conversion rates will be fetched from the API
  conversionRates: { [key: string]: number } = {};

  constructor(private http: HttpClient) {
    // Fetch conversion rates and currencies when the component is initialized
    this.fetchConversionRates();
  }

  // Method to fetch conversion rates and currencies from the API
  fetchConversionRates() {
    this.http.get<any>(this.apiUrl).subscribe(
      (response) => {
        // Extract conversion rates and currencies from the API response
        this.conversionRates = response.conversion_rates;
        this.currencies = Object.keys(this.conversionRates);
      },
      (error) => {
        console.error('Error fetching conversion rates:', error);
      }
    );
  }

  convert() {
    
    const conversionKey = `${this.from}-${this.to}`;

    // Check if 'from' and 'to' currencies are selected
    if (!this.from || !this.to) {
      console.error('Please select both "From" and "To" currencies.');
      return; // Stop execution if currencies are not selected
    }
  
    if (this.conversionRates.hasOwnProperty(conversionKey)) {
      const conversionRate = this.conversionRates[conversionKey];
      
      // Check if the 'amount' is a valid number
      if (isNaN(this.amount)) {
        console.error('Please enter a valid number in the "Amount" field.');
        return; // Stop execution if 'amount' is not a valid number
      }
  
      this.convertedAmount = this.amount * conversionRate;
    } else {
      console.error(`Conversion rate not available for ${conversionKey}`);
    }
  }

  clear() {
    // Reset all input fields and convertedAmount
    this.amount = 0;
    this.from = '';
    this.to = '';
    this.convertedAmount = 0;
  }
  }


