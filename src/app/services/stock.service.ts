import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Stock } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private apiService: ApiService) { }

  getStock(): Observable<Stock[]> {
    return this.apiService.get<Stock[]>('stock').pipe(
      map(stockItems => stockItems.map(item => this.mapStockFromBackend(item)))
    );
  }

  getStockByProduct(productId: string): Observable<Stock> {
    return this.apiService.get<Stock>(`stock/produto/${productId}`).pipe(
      map(item => this.mapStockFromBackend(item))
    );
  }

  updateStock(productId: string, quantity: number, reason?: string): Observable<any> {
    return this.apiService.put(`stock/${productId}`, {
      quantidade: quantity,
      motivo: reason
    });
  }

  // Map backend data to frontend format
  private mapStockFromBackend(stockItem: any): Stock {
    return {
      id: stockItem.id,
      produtoId: stockItem.produtoId,
      quantidade: stockItem.quantidade,
      localizacao: stockItem.localizacao,

      // Frontend compatibility properties
      productId: stockItem.produtoId,
      quantity: stockItem.quantidade,
      location: stockItem.localizacao,
      minimumLevel: 5 // Default since not in backend model
    };
  }
}
