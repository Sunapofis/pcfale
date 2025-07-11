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
    return this.apiService.get<any[]>('categorias').pipe(
      map(categorias => categorias.map(categoria => this.mapCategoryFromBackend(categoria)))
    );
  }

  getCategory(id: string): Observable<Category> {
    return this.apiService.get<any>(`categorias/${id}`).pipe(
      map(categoria => this.mapCategoryFromBackend(categoria))
    );
  }

  createCategory(category: Category): Observable<Category> {
    const backendCategory = this.mapCategoryToBackend(category);
    return this.apiService.post<any>('categorias', backendCategory).pipe(
      map(categoria => this.mapCategoryFromBackend(categoria))
    );
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    const backendCategory = this.mapCategoryToBackend(category);
    return this.apiService.put<any>(`categorias/${id}`, backendCategory).pipe(
      map(categoria => this.mapCategoryFromBackend(categoria))
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.apiService.delete(`categorias/${id}`);
  }

  // Map backend data to frontend format
  private mapCategoryFromBackend(categoria: any): Category {
    return {
      // Backend fields
      id: categoria.id,
      nome: categoria.nome,

      // Frontend compatibility fields
      name: categoria.nome,
      description: '',                             // Default since backend doesn't have description
      isActive: true                              // Default since backend doesn't have isActive
    };
  }

  // Map frontend data to backend format (only send fields that exist in backend)
  private mapCategoryToBackend(category: Category): any {
    return {
      id: category.id,
      nome: category.name || category.nome
      // NOTE: Not sending description, isActive since backend doesn't have them
    };
  }
}
