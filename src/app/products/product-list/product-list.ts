import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../product-services/product-service';
import { Router } from '@angular/router';
import { ProductDeleteModal } from "../product-delete-modal/product-delete-modal";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [ProductDeleteModal, FormsModule, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  standalone: true,
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  pageSize = 5;
  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe((res) => {
      this.products = res.data;
      this.filteredProducts = this.products;
    });
  }
  search(): void {
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }
  changePageSize(size: number): void {
    this.pageSize = size;
  }

  edit(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }

  selectedProductId: string | null = null;
  showModal = false;

  confirmDelete(id: string): void {
    this.selectedProductId = id;
    this.showModal = true;
  }

  onDeleteConfirmed(): void {
    if (this.selectedProductId) {
      this.productService.deleteProduct(this.selectedProductId).subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.loadProducts();
        },
        error: () => alert('Error al eliminar producto'),
      });
    }
    this.showModal = false;
  }
}
