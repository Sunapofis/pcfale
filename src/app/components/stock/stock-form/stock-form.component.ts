import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.css']
})
export class StockFormComponent implements OnInit {
  stockForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.stockForm = this.fb.group({
      quantity: [0, [Validators.required, Validators.min(0)]],
      reason: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.stockForm.valid) {
      console.log('Stock update:', this.stockForm.value);
    }
  }
}
