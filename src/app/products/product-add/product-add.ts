import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductService } from '../product-services/product-service';
import { Product } from '../models/product.model';
import { releaseDateValidator, revisionDateValidator } from '../validators/date-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-add.html',
  styleUrls: ['./product-add.css'],
})
export class ProductAdd {
  form!: FormGroup;
  serverErrors: { [key: string]: string[] } = {};
  showErrorModal = false;
  objectKeys = Object.keys;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, releaseDateValidator]],
      date_revision: ['', [Validators.required, revisionDateValidator]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const product: Product = {
        id: this.form.get('id')?.value || '',
        name: this.form.get('name')?.value || '',
        description: this.form.get('description')?.value || '',
        logo: this.form.get('logo')?.value || '',
        // Convertir fechas a string ISO (yyyy-MM-dd)
        date_release: new Date(this.form.get('date_release')?.value),
        date_revision: new Date(this.form.get('date_revision')?.value),
      };

      this.productService.addProduct(product).subscribe({
        next: () => {
          alert('Producto agregado correctamente');
          this.form.reset();
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error al agregar producto:', err);
          this.serverErrors = err.error?.errors || {};
          this.showErrorModal = true;
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.form.reset();
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }
}
