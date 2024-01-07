import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurrencyComponent } from './add-currency.component';

describe('AddCurrencyComponent', () => {
  let component: AddCurrencyComponent;
  let fixture: ComponentFixture<AddCurrencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCurrencyComponent]
    });
    fixture = TestBed.createComponent(AddCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
