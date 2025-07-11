import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) { }

  getCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>('categorias').pipe(
      map(categorias => categorias.map(categoria => this.mapCategoryFromBackend(categoria)))
    );
  }

  getCategory(id: string): Observable<Category> {
    return this.apiService.get<Category>(`categorias/${id}`).pipe(
      map(categoria => this.mapCategoryFromBackend(categoria))
    );
  }

  createCategory(category: Category): Observable<Category> {
    const backendCategory = this.mapCategoryToBackend(category);
    return this.apiService.post<Category>('categorias', backendCategory).pipe(
      map(categoria => this.mapCategoryFromBackend(categoria))
    );
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    const backendCategory = this.mapCategoryToBackend(category);
    return this.apiService.put<Category>(`categorias/${id}`, backendCategory).pipe(
      map(categoria => this.mapCategoryFromBackend(categoria))
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.apiService.delete(`categorias/${id}`);
  }

  // Map backend data to frontend format
  private mapCategoryFromBackend(categoria: any): Category {
    return {
      id: categoria.id,
      nome: categoria.nome,

      // Frontend compatibility properties
      name: categoria.nome,
      description: categoria.description || '', // Default if not in backend
      isActive: categoria.isActive !== false    // Default to true if not in backend
    };
  }

  // Map frontend data to backend format
  private mapCategoryToBackend(category: Category): any {
    return {
      id: category.id,
      nome: category.name || category.nome
    };
  }
}
