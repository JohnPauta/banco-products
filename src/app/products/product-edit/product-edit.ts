import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product.model';
import { releaseDateValidator, revisionDateValidator } from '../validators/date-validators';
import { ProductService } from '../product-services/product-service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.html',
  styleUrls: ['./product-edit.css'],
})
export class ProductEdit implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, releaseDateValidator]],
      date_revision: ['', [Validators.required, revisionDateValidator]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          const formattedProduct = {
            ...product,
            date_release: this.formatDate(product.date_release),
            date_revision: this.formatDate(product.date_revision),
          };
          this.form.patchValue(formattedProduct);
        },
        error: () => alert('Producto no encontrado'),
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const id = this.form.get('id')?.value || '';
      const releaseValue = this.form.get('date_release')?.value;
      const revisionValue = this.form.get('date_revision')?.value;

      const product: Product = {
        id,
        name: this.form.get('name')?.value || '',
        description: this.form.get('description')?.value || '',
        logo: this.form.get('logo')?.value || '',
        // 👇 Convertimos a ISO respetando la fecha local
        date_release: releaseValue ? this.toLocalISO(releaseValue) : '',
        date_revision: revisionValue ? this.toLocalISO(revisionValue) : '',
      };

      this.productService.updateProduct(id, product).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.router.navigate(['/products']);
        },
        error: (err) => alert('Error al actualizar: ' + err.message),
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

  // Helper para mostrar fechas en yyyy-MM-dd
  private formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper para convertir yyyy-MM-dd a ISO sin desfase
  private toLocalISO(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const d = new Date(year, month - 1, day); // fecha en zona local
    return d.toISOString();
  }
}
