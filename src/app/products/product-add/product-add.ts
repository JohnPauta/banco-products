import { Component } from '@angular/core';
import { releaseDateValidator, revisionDateValidator } from '../validators/date-validators';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../product-services/product-service';

@Component({
  selector: 'app-product-add',
  imports: [],
  templateUrl: './product-add.html',
  styleUrl: './product-add.css',
  standalone: true,
})
export class ProductAdd {
  form!: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, releaseDateValidator]],
      date_revision: ['', [Validators.required, revisionDateValidator]],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.productService.addProduct(this.form.value).subscribe({
        next: () => alert('Producto agregado correctamente'),
        error: () => alert('Error al agregar producto'),
      });
    }
  }

  reset(): void {
    this.form.reset();
  }
}
