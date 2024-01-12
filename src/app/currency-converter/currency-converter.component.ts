import {ChangeDetectorRef, Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css'],
  animations: [
    trigger('fromCurrencyMenuAnimation', [
      state('visible', style({ opacity: 1, height: '*' })),
      state('hidden', style({ opacity: 0, height: '0' })),
      transition('visible <=> hidden', animate('150ms ease-in-out')),
    ]),
    trigger('toCurrenciesMenuAnimation', [
      state('visible', style({ opacity: 1, height: '*' })),
      state('hidden', style({ opacity: 0, height: '0' })),
      transition('visible <=> hidden', animate('150ms ease-in-out')),
    ]),
  ],
  // imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, NgForOf]
})
export class CurrencyConverterComponent {
  form!: FormGroup;

  fromCurrencyMenuOpen: boolean = false;
  toCurrenciesMenuAnimation: boolean = false;

  currencies: string[] = [];

  private apiUrl = 'https://v6.exchangerate-api.com/v6/c9aa3cd40d80206acefc63ed/latest/USD';
  conversionRates: { [key: string]: number } = {};

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private cdr: ChangeDetectorRef) {
    this.fetchConversionRates();

    this.form = this.fb.group({
      amount: [0],
      fromCurrency: [''],
      toCurrencies: [[]],
      convertedAmounts: [''],
    });
  }

  toggleFromCurrencyMenu(): void {
    this.fromCurrencyMenuOpen = !this.fromCurrencyMenuOpen;

    if(this.toCurrenciesMenuAnimation) {
      this.toCurrenciesMenuAnimation = !this.toCurrenciesMenuAnimation;
    }
  }

  toggleToCurrenciesMenu(): void {
    this.toCurrenciesMenuAnimation = !this.toCurrenciesMenuAnimation;

    if(this.fromCurrencyMenuOpen) {
      this.fromCurrencyMenuOpen = !this.fromCurrencyMenuOpen;
    }
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
    );
  }

  convert() {
    const values = this.form.value;

    if (!values.fromCurrency || !values.toCurrencies) {
      console.error('Please select both "From" and "To" currencies.');
      return;
    }

    const baseCurrency = values.fromCurrency.toUpperCase();
    this.fetchConversionRatesForBaseCurrency(baseCurrency).subscribe(
      (response) => {
        this.conversionRates = response.conversion_rates;
        this.currencies = Object.keys(this.conversionRates);

        values.convertedAmounts = '';

        for (const toCurrency of values.toCurrencies) {
          const conversionKey = toCurrency.toUpperCase();

          if (this.conversionRates && this.conversionRates.hasOwnProperty(conversionKey)) {
            const conversionRate = this.conversionRates[conversionKey];

            if (isNaN(values.amount)) {
              console.error('Please enter a valid number in the "Amount" field.');
              values.convertedAmounts = 'Invalid amount';
              return;
            }

            const convertedAmount = values.amount * conversionRate;
            const convertedAmountString = `${values.amount} ${baseCurrency} = ${convertedAmount} ${toCurrency}`;
            console.log(convertedAmountString);
            values.convertedAmounts += convertedAmountString + "\n";
            this.updateConvertedAmounts(values.convertedAmounts);
          } else {
            console.error(`Conversion rate not available for ${conversionKey}`);
            values.convertedAmounts += `Conversion rate not available for ${conversionKey}\n`;
          }
        }
      },
      (error) => {
        console.error('Error fetching conversion rates:', error);
        values.convertedAmounts = 'Error fetching conversion rates'; // Set a default value for the error case
      }
    );
  }

  updateConvertedAmounts(newValue: string): void {
    this.form.get('convertedAmounts')?.setValue(newValue);
    this.cdr.detectChanges();
  }

  clear() {
    this.form.reset({
      amount: 0,
      fromCurrency: '',
      toCurrencies: [],
      convertedAmounts: 0
    });
  }
}
