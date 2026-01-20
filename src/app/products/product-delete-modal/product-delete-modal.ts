import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-delete-modal',
  imports: [],
  templateUrl: './product-delete-modal.html',
  styleUrl: './product-delete-modal.css',
  standalone: true,
})
export class ProductDeleteModal {
  @Input() productName = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
