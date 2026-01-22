import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect, vi } from 'vitest';
import { ProductAdd } from './product-add';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product-services/product-service';
import { Router } from '@angular/router';

// 👉 Mock del servicio
const mockProductService = {
  addProduct: vi.fn().mockReturnValue({
    subscribe: ({ next }: any) => next(),
  }),
};

const mockRouter = {
  navigate: vi.fn(),
};

describe('ProductAdd Component', () => {
  it('should render form fields', async () => {
    await render(ProductAdd, {
      imports: [FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    // Verifica que los inputs existen
    expect(screen.getByLabelText(/Nombre/i)).toBeTruthy();
    expect(screen.getByLabelText(/Logo/i)).toBeTruthy();
    expect(screen.getByLabelText(/Fecha de lanzamiento/i)).toBeTruthy();
  });

  it('should call addProduct when form is submitted', async () => {
    await render(ProductAdd, {
      imports: [FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    // Rellenar campos
    fireEvent.input(screen.getByLabelText(/Nombre/i), { target: { value: 'Nuevo Producto' } });
    fireEvent.input(screen.getByLabelText(/Logo/i), { target: { value: 'logo.png' } });
    fireEvent.input(screen.getByLabelText(/Fecha de lanzamiento/i), { target: { value: '2026-01-22' } });

    // Enviar formulario
    fireEvent.submit(screen.getByRole('form'));

    expect(mockProductService.addProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  });
});
