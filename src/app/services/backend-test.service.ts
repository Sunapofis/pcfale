import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BackendTestService {
  constructor(private apiService: ApiService) { }

  testPortugueseEndpoints(): void {
    console.log('🧪 Testing Portuguese backend endpoints...');

    // Test produtos
    this.apiService.get('produtos').subscribe({
      next: (data) => console.log('✅ /api/produtos working:', data),
      error: (err) => console.log('❌ /api/produtos failed:', err)
    });

    // Test categorias
    this.apiService.get('categorias').subscribe({
      next: (data) => console.log('✅ /api/categorias working:', data),
      error: (err) => console.log('❌ /api/categorias failed:', err)
    });

    // Test stock
    this.apiService.get('stock').subscribe({
      next: (data) => console.log('✅ /api/stock working:', data),
      error: (err) => console.log('❌ /api/stock failed:', err)
    });

    // Test transacoes
    this.apiService.get('transacoes').subscribe({
      next: (data) => console.log('✅ /api/transacoes working:', data),
      error: (err) => console.log('❌ /api/transacoes failed:', err)
    });
  }

  discoverSubEndpoints(): void {
    console.log('🔍 Discovering sub-endpoints...');

    const subEndpoints = [
      'produtos/1',
      'categorias/1',
      'stock/baixo',
      'transacoes/recentes',
      'produtos/categoria/1',
      'produtos/pesquisar?q=samsung'
    ];

    subEndpoints.forEach(endpoint => {
      this.apiService.get(endpoint).subscribe({
        next: (data) => console.log(`✅ Found: /api/${endpoint}`, data),
        error: (err) => console.log(`❌ Not found: /api/${endpoint}`)
      });
    });
  }
}
