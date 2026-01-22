import { Component, Inject, NgZone, OnInit, PLATFORM_ID, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductDeleteModal } from '../product-delete-modal/product-delete-modal';
import { ProductService } from '../product-services/product-service';
import { Product } from '../models/product.model';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-list',
  imports: [ProductDeleteModal, FormsModule, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  standalone: true,
})
export class ProductList implements OnInit {
  products: Product[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 5;
  totalProducts = 0;
  filteredProducts: Product[] = [];

  searchTerm = '';

  selectedProductId = '';
  selectedProductName = '';
  showDeleteModal = false;
  activeDropdownId: string | null = null;

  totalPages = 1;

  constructor(
    private productService: ProductService,
    private router: Router,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
      console.log('Entro a init en cliente');
    }
  }

  loadProducts(page: number = 1): void {
    this.isLoading = true;
    this.productService
      .getProducts(page, this.pageSize)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          this.products = res.items.map((p) => ({
            ...p,
            id: p.id.trim(),
            logo: p.logo?.trim() || 'assets/default-logo.png',
            date_release: new Date(p.date_release),
            date_revision: new Date(p.date_revision),
          }));
          this.totalProducts = res.total;
          this.currentPage = page;
          this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.pageSize));
          this.cdRef.detectChanges();
        },
        error: (err) => {
          alert('Error al cargar productos: ' + err.message);
          this.cdRef.detectChanges();
        },
      });
  }

  onPageChange(page: number) {
    this.loadProducts(page);
  }

  changePageSize(size: number): void {
    this.pageSize = size;
  }

  search(): void {
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  edit(id: string): void {
    this.activeDropdownId = null; // 👈 cerrar menú al editar
    this.router.navigate(['/products/edit', id]);
  }

  onDeleteClick(product: Product) {
    this.selectedProductId = product.id;
    this.selectedProductName = product.name;
    this.activeDropdownId = null; // 👈 cerrar menú al abrir modal
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.productService.deleteProduct(this.selectedProductId).subscribe({
      next: () => {
        alert('Producto eliminado');
        this.showDeleteModal = false;
        this.loadProducts();
      },
      error: (err) => alert('Error al eliminar: ' + err.message),
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  toggleDropdown(id: string) {
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  onEdit(productId: string) {
    this.activeDropdownId = null; // 👈 cerrar menú al editar
    this.router.navigate(['/products/edit', productId]);
  }

  onDelete(product: Product) {
    this.selectedProductId = product.id;
    this.selectedProductName = product.name;
    this.activeDropdownId = null; // 👈 cerrar menú al abrir modal
    this.showDeleteModal = true;
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.loadProducts(1);
      return;
    }

    this.productService.searchProducts(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.products = res.items.map((p) => ({
          ...p,
          id: p.id.trim(),
          logo: p.logo?.trim().replace(/\s+/g, ''),
          date_release: new Date(p.date_release),
          date_revision: new Date(p.date_revision),
        }));
        this.totalProducts = res.total;
        this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.pageSize));
      },
      error: (err) => alert('Error en búsqueda: ' + err.message),
    });
  }

  onAddProduct(): void {
    this.router.navigate(['/products/add']);
  }

  // 👇 Listener global para cerrar el menú al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions')) {
      this.activeDropdownId = null;
    }
  }
}
