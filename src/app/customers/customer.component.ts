import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  customer = new Customer();

  save(customerForm: NgForm): void {
    console.log(customerForm.form);
    console.log('Saved: ' + JSON.stringify(customerForm.value));
  }
}
