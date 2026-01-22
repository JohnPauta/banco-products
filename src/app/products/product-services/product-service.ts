import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number, size: number): Observable<{ items: Product[]; total: number }> {
    return this.http.get<{ items: Product[]; total: number }>(
      `${this.apiUrl}?page=${page}&size=${size}`,
    );
  }

  searchProducts(
    term: string,
    page: number,
    size: number,
  ): Observable<{ items: Product[]; total: number }> {
    return this.http.get<{ items: Product[]; total: number }>(
      `${this.apiUrl}/search?term=${term}&page=${page}&size=${size}`,
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }

  addProduct(product: Product): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
