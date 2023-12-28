import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  customer = new Customer();

  isInvalid(model: NgModel) {
    return (model.touched || model.dirty) && !model.valid;
  }

  save(customerForm: NgForm): void {
    console.log(customerForm.form);
    console.log('Saved: ' + JSON.stringify(customerForm.value));
  }
}
