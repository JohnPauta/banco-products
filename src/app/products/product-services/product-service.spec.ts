import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product-service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch products', () => {
    const mockProducts = {
      items: [
        {
          id: '1',
          name: 'Test',
          description: 'Desc',
          logo: 'logo.png',
          date_release: '2025-01-01',
          date_revision: '2026-01-01',
        },
      ],
      total: 1,
    };
    service.getProducts(1, 10).subscribe((res) => {
      expect(res.items.length).toBe(1);
    });
    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    req.flush(mockProducts);
  });
});
