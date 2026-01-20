import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../product-services/product-service';
import { FormBuilder, Validators } from '@angular/forms';
import { releaseDateValidator, revisionDateValidator } from '../validators/date-validators';

@Component({
  selector: 'app-product-edit',
  imports: [],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
  standalone: true,
})
export class ProductEdit implements OnInit {
  form!: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, releaseDateValidator]],
      date_revision: ['', [Validators.required, revisionDateValidator]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProducts().subscribe((res) => {
      const product = res.data.find((p) => p.id === id);
      if (product) {
        this.form.patchValue(product);
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      const id = this.route.snapshot.paramMap.get('id')!;
      const product = { ...this.form.getRawValue() } as Product;
      this.productService.updateProduct(id, product).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.router.navigate(['/products']);
        },
        error: () => alert('Error al actualizar producto'),
      });
    }
  }
}
