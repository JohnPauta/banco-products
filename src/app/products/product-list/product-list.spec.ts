import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect, vi } from 'vitest';
import { ProductList } from './product-list';
import { ProductService } from '../product-services/product-service';
import { Router } from '@angular/router';

// 👉 Mock del servicio
const mockProductService = {
  getProducts: vi.fn().mockReturnValue({
    pipe: () => ({
      subscribe: ({ next }: any) => {
        next({
          items: [
            { id: '1', name: 'Banco Pichincha', logo: '', date_release: new Date(), date_revision: new Date() },
            { id: '2', name: 'Banco Guayaquil', logo: '', date_release: new Date(), date_revision: new Date() },
          ],
          total: 2,
        });
      },
    }),
  }),
  deleteProduct: vi.fn().mockReturnValue({
    subscribe: ({ next }: any) => next(),
  }),
  searchProducts: vi.fn().mockReturnValue({
    subscribe: ({ next }: any) => {
      next({
        items: [
          { id: '3', name: 'Banco Internacional', logo: '', date_release: new Date(), date_revision: new Date() },
        ],
        total: 1,
      });
    },
  }),
};

const mockRouter = {
  navigate: vi.fn(),
};

describe('ProductList Component', () => {
  it('should render product list', async () => {
    await render(ProductList, {
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    // Verifica que los productos se renderizan
    expect(screen.getByText(/Banco Pichincha/i)).toBeTruthy();
    expect(screen.getByText(/Banco Guayaquil/i)).toBeTruthy();
  });

  it('should filter products when searching', async () => {
    const { fixture } = await render(ProductList, {
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    component.searchTerm = 'pichincha';
    component.search();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Banco Pichincha');
  });

  it('should navigate when editing a product', async () => {
    const { fixture } = await render(ProductList, {
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    component.edit('123');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/edit', '123']);
  });
});
