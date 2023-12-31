import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, AbstractControlOptions } from '@angular/forms';
import { Customer } from './customer';
import { debounceTime } from 'rxjs';

function emailMatcher(c: AbstractControl):  { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if(emailControl?.pristine || confirmControl?.pristine) {
    return null;
  }

  if (emailControl?.value === confirmControl?.value) {
    return null;
  }
  
  return { 'match': true};
} 

const ratingRange = (min: number, max: number): ValidatorFn => {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value)) || c.value < min || c.value > max) {
      return { range: true };
    } 
    return null;
  }
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage: string;
  
  private validationMessages: any = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  }

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required]],
      }, {validator: emailMatcher} as AbstractControlOptions),
      phone: '', 
      notification: 'email',
      rating: [null, ratingRange(1, 5)],
      sendCatalog: true
    })

    this.customerForm.get('notification')?.valueChanges.subscribe(notification => this.setNotification(notification));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(_ => this.setMessage(emailControl));
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]
      ).join(' ');
    }
  }

  populateTestData() {
    this.customerForm.patchValue({
      firstName: 'Eddy',
      lastName: 'Jo',
      emailGroup: {
        email: 'eddy@jo.com',
      },
      sendCatalog: false,
    })
  }

  save(): void {
    console.log(this.customerForm);
  }

  private setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl?.setValidators(Validators.required);
    } else {
      phoneControl?.clearValidators();
    }
    phoneControl?.updateValueAndValidity();
  }
}
