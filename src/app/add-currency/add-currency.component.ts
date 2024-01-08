import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.css']
})
export class AddCurrencyComponent {

  @Output() currencyAdded: EventEmitter<string> = new EventEmitter<string>();
  newCurrency: string = '';
  currenciesFromAPI: string[] = [];

  private apiUrl = 'https://v6.exchangerate-api.com/v6/c9aa3cd40d80206acefc63ed/latest/USD';

  constructor(private http: HttpClient) {
    this.fetchCurrenciesFromAPI();
  }

  fetchCurrenciesFromAPI() {
    this.http.get<any>(this.apiUrl).subscribe(
      (response) => {
        this.currenciesFromAPI = Object.keys(response.conversion_rates);
      },
      (error) => {
        console.error('Error fetching currencies from API:', error);
      }
    );
  }

  addCurrency() {
    if (this.newCurrency.trim() !== '') {
      if (this.currenciesFromAPI.includes(this.newCurrency.toUpperCase())) {
        this.currencyAdded.emit(this.newCurrency.trim());
        this.newCurrency = ''; 
        console.error('Currency not available from API.');
      }
    } else {
      console.error('Please enter a valid currency.');
    }
  }
}
