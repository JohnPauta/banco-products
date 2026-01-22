import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect, vi } from 'vitest';
import { FormsModule } from '@angular/forms';
import { ProductEdit } from './product-edit';
import { ProductService } from '../product-services/product-service';
import { Router } from '@angular/router';

// 👉 Mock del servicio
const mockProductService = {
  updateProduct: vi.fn().mockReturnValue({
    subscribe: ({ next }: any) => next(),
  }),
  getProductById: vi.fn().mockReturnValue({
    subscribe: ({ next }: any) => {
      next({
        id: '1',
        name: 'Producto Existente',
        logo: 'logo.png',
        date_release: new Date(),
        date_revision: new Date(),
      });
    },
  }),
};

const mockRouter = {
  navigate: vi.fn(),
};

describe('ProductEdit Component', () => {
  it('should render form with existing product data', async () => {
    await render(ProductEdit, {
      imports: [FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    // Verifica que el nombre del producto existente aparece en el input
    expect(screen.getByDisplayValue(/Producto Existente/i)).toBeTruthy();
  });

  it('should call updateProduct when form is submitted', async () => {
    await render(ProductEdit, {
      imports: [FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    // Cambiar el nombre del producto
    fireEvent.input(screen.getByLabelText(/Nombre/i), { target: { value: 'Producto Editado' } });

    // Enviar formulario
    fireEvent.submit(screen.getByRole('form'));

    expect(mockProductService.updateProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  });
});
