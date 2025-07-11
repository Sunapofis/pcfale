import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { CategoryService } from './category.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private apiService: ApiService,
    private categoryService: CategoryService
  ) { }

  // Enhanced getProducts that joins with categories and provides defaults
  getProducts(): Observable<Product[]> {
    return forkJoin({
      produtos: this.apiService.get<any[]>('produtos'),
      categorias: this.categoryService.getCategories()
    }).pipe(
      map(({ produtos, categorias }) => {
        return produtos.map(produto => this.mapProductFromBackend(produto, categorias));
      })
    );
  }

  getProduct(id: string): Observable<Product> {
    return forkJoin({
      produto: this.apiService.get<any>(`produtos/${id}`),
      categorias: this.categoryService.getCategories()
    }).pipe(
      map(({ produto, categorias }) => this.mapProductFromBackend(produto, categorias))
    );
  }

  createProduct(product: Product): Observable<Product> {
    const backendProduct = this.mapProductToBackend(product);
    return this.apiService.post<any>('produtos', backendProduct).pipe(
      switchMap(produto => {
        return this.categoryService.getCategories().pipe(
          map(categorias => this.mapProductFromBackend(produto, categorias))
        );
      })
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    const backendProduct = this.mapProductToBackend(product);
    return this.apiService.put<any>(`produtos/${id}`, backendProduct).pipe(
      switchMap(produto => {
        return this.categoryService.getCategories().pipe(
          map(categorias => this.mapProductFromBackend(produto, categorias))
        );
      })
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.apiService.delete(`produtos/${id}`);
  }

  // Map backend data to frontend format with defaults for missing fields
  private mapProductFromBackend(produto: any, categorias: any[] = []): Product {
    console.log('🔄 Mapping product from backend:', produto);

    // Find the category name
    const categoria = categorias.find(c => c.id === produto.categoriaId);
    const categoryName = categoria ? (categoria.name || categoria.nome || 'Categoria não encontrada') : 'Categoria não encontrada';

    const mappedProduct: Product = {
      // Backend fields (exactly as they come from your Java model)
      id: produto.id,
      nome: produto.nome,
      categoriaId: produto.categoriaId,
      stock: produto.stock,
      codigoProduto: produto.codigoProduto,

      // Frontend compatibility fields
      name: produto.nome,
      categoryId: produto.categoriaId,
      stockQuantity: produto.stock,
      productCode: produto.codigoProduto,

      // Default values for fields that don't exist in backend
      price: 0,                                    // Default since backend doesn't have preco
      description: '',                             // Default since backend doesn't have descricao
      minimumStock: 5,                            // Default since backend doesn't have stockMinimo
      categoryName: categoryName                   // Joined from categories
    };

    console.log('✅ Mapped product:', mappedProduct);
    return mappedProduct;
  }

  // Map frontend data to backend format (only send fields that exist in backend)
  private mapProductToBackend(product: Product): any {
    const backendProduct = {
      id: product.id,
      nome: product.name || product.nome,
      categoriaId: product.categoryId || product.categoriaId,
      stock: product.stockQuantity || product.stock,
      codigoProduto: product.productCode || product.codigoProduto
      // NOTE: Not sending price, description, minimumStock since backend doesn't have them
    };

    console.log('🔄 Mapping product to backend:', backendProduct);
    return backendProduct;
  }
}
