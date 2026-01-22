import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product-service';
import { firstValueFrom } from 'rxjs';

globalThis.fetch = vi.fn();

describe('ProductService (Vitest)', () => {
  let service: ProductService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new ProductService(new HttpClient({} as any));
  });

  it('should fetch products', async () => {
    const mockResponse = {
      items: [
        { id: '1', name: 'Banco Pichincha', logo: '', date_release: new Date(), date_revision: new Date() },
        { id: '2', name: 'Banco Guayaquil', logo: '', date_release: new Date(), date_revision: new Date() },
      ],
      total: 2,
    };

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const res = await firstValueFrom(service.getProducts(1, 5));
    expect(res.items.length).toBe(2);
    expect(res.total).toBe(2);
  });

  it('should delete product', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const res = await firstValueFrom(service.deleteProduct('1'));
    expect(res).toBeTruthy();
  });

  it('should search products', async () => {
    const mockResponse = {
      items: [{ id: '3', name: 'Banco Internacional', logo: '', date_release: new Date(), date_revision: new Date() }],
      total: 1,
    };

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const res = await firstValueFrom(service.searchProducts('Internacional', 1, 5));
    expect(res.items[0].name).toBe('Banco Internacional');
    expect(res.total).toBe(1);
  });
});
