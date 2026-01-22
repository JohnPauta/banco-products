import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { ProductService } from '../product-services/product-service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

// 👉 Mock de productos
const mockProducts = [
  {
    id: '1',
    name: 'Cuenta Ahorros',
    description: 'Cuenta básica',
    logo: 'logo1.png',
    date_release: '2025-01-01',
    date_revision: '2025-12-31',
  },
  {
    id: '2',
    name: 'Tarjeta Crédito',
    description: 'Visa Gold',
    logo: 'logo2.png',
    date_release: '2025-02-01',
    date_revision: '2025-12-31',
  },
];

// 👉 Mock del servicio
class MockProductService {
  getProducts = jest.fn().mockReturnValue(of({ items: mockProducts, total: 2 }));
  deleteProduct = jest.fn().mockReturnValue(of(true));
  searchProducts = jest.fn().mockReturnValue(of({ items: [mockProducts[1]], total: 1 }));
}

describe('ProductList Component', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let service: MockProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList, RouterTestingModule],
      providers: [{ provide: ProductService, useClass: MockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    service = TestBed.inject(ProductService) as unknown as MockProductService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(service.getProducts).toHaveBeenCalledWith(1, component.pageSize);
    expect(component.products.length).toBe(2);
    expect(component.totalProducts).toBe(2);
  });

  it('should render product rows in template', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].nativeElement.textContent).toContain('Cuenta Ahorros');
    expect(rows[1].nativeElement.textContent).toContain('Tarjeta Crédito');
  });

  it('should show no-data row when products empty', () => {
    service.getProducts.mockReturnValue(of({ items: [], total: 0 }));
    component.loadProducts();
    fixture.detectChanges();
    const noDataRow = fixture.debugElement.query(By.css('.no-data-row'));
    expect(noDataRow).toBeTruthy();
  });

  it('should trigger search and update products', () => {
    component.searchTerm = 'tarjeta';
    component.onSearch();
    expect(service.searchProducts).toHaveBeenCalledWith('tarjeta', component.currentPage, component.pageSize);
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Tarjeta Crédito');
  });

  it('should toggle dropdown correctly', () => {
    const id = '1';
    component.toggleDropdown(id);
    expect(component.activeDropdownId).toBe(id);
    component.toggleDropdown(id);
    expect(component.activeDropdownId).toBeNull();
  });

  it('should navigate to add product', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.onAddProduct();
    expect(spy).toHaveBeenCalledWith(['/products/add']);
  });

  it('should navigate to edit product', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.onEdit('1');
    expect(spy).toHaveBeenCalledWith(['/products/edit', '1']);
  });

  it('should open delete modal when onDelete called', () => {
    component.onDelete(mockProducts[0] as any);
    expect(component.showDeleteModal).toBe(true);
    expect(component.selectedProductId).toBe('1');
  });

  it('should confirm delete and reload products', () => {
    const spy = jest.spyOn(component, 'loadProducts');
    component.selectedProductId = '1';
    component.confirmDelete();
    expect(service.deleteProduct).toHaveBeenCalledWith('1');
    expect(spy).toHaveBeenCalled();
  });

  it('should handle error on loadProducts', () => {
    service.getProducts.mockReturnValue(throwError(() => new Error('Network error')));
    const spy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    component.loadProducts();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Error al cargar productos'));
  });
});
