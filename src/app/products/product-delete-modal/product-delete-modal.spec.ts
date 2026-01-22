import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect, vi } from 'vitest';
import { ProductDeleteModal } from './product-delete-modal';
import { ProductService } from '../product-services/product-service';

const mockProductService = {
  deleteProduct: vi.fn().mockReturnValue({
    subscribe: ({ next }: any) => next(),
  }),
};

describe('ProductDeleteModal Component', () => {
  it('should render modal with product info', async () => {
    await render(ProductDeleteModal, {
      componentInputs: {
        productId: '1',
        productName: 'Producto Demo',
        show: true,
      },
      providers: [{ provide: ProductService, useValue: mockProductService }],
    });

    // Verifica que el nombre del producto aparece en el modal
    expect(screen.getByText(/Producto Demo/i)).toBeTruthy();
    expect(screen.getByText(/¿Está seguro que desea eliminar/i)).toBeTruthy();
  });

  it('should call deleteProduct when confirm button is clicked', async () => {
    await render(ProductDeleteModal, {
      componentInputs: {
        productId: '1',
        productName: 'Producto Demo',
        show: true,
      },
      providers: [{ provide: ProductService, useValue: mockProductService }],
    });

    const confirmButton = screen.getByRole('button', { name: /Confirmar/i });
    fireEvent.click(confirmButton);

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('should close modal when cancel button is clicked', async () => {
    const { fixture } = await render(ProductDeleteModal, {
      componentInputs: {
        productId: '1',
        productName: 'Producto Demo',
        show: true,
      },
      providers: [{ provide: ProductService, useValue: mockProductService }],
    });

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
  });
});
