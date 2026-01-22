import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-delete-modal.html',
  styleUrls: ['./product-delete-modal.css']
})
export class ProductDeleteModal {
  @Input() productName = '';
  @Input() visible = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
