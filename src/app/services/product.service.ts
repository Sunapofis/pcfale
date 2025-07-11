import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) { }

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>('produtos').pipe(
      map(produtos => produtos.map(produto => this.mapProductFromBackend(produto)))
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.apiService.get<Product>(`produtos/${id}`).pipe(
      map(produto => this.mapProductFromBackend(produto))
    );
  }

  createProduct(product: Product): Observable<Product> {
    const backendProduct = this.mapProductToBackend(product);
    return this.apiService.post<Product>('produtos', backendProduct).pipe(
      map(produto => this.mapProductFromBackend(produto))
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    const backendProduct = this.mapProductToBackend(product);
    return this.apiService.put<Product>(`produtos/${id}`, backendProduct).pipe(
      map(produto => this.mapProductFromBackend(produto))
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.apiService.delete(`produtos/${id}`);
  }

  // Map backend data to frontend format
  private mapProductFromBackend(produto: any): Product {
    return {
      id: produto.id,
      nome: produto.nome,
      categoriaId: produto.categoriaId,
      stock: produto.stock,
      codigoProduto: produto.codigoProduto,

      // Frontend compatibility properties
      name: produto.nome,
      categoryId: produto.categoriaId,
      stockQuantity: produto.stock,
      productCode: produto.codigoProduto,
      price: produto.price || 0, // Default if not in backend
      minimumStock: produto.minimumStock || 5, // Default if not in backend
      description: produto.description || '' // Default if not in backend
    };
  }

  // Map frontend data to backend format
  private mapProductToBackend(product: Product): any {
    return {
      id: product.id,
      nome: product.name || product.nome,
      categoriaId: product.categoryId || product.categoriaId,
      stock: product.stockQuantity || product.stock,
      codigoProduto: product.productCode || product.codigoProduto
    };
  }
}
