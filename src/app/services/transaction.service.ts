import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private apiService: ApiService) { }

  getTransactions(): Observable<Transaction[]> {
    return this.apiService.get<Transaction[]>('transacoes').pipe(
      map(transacoes => transacoes.map(transacao => this.mapTransactionFromBackend(transacao)))
    );
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    const backendTransaction = this.mapTransactionToBackend(transaction);
    return this.apiService.post<Transaction>('transacoes', backendTransaction).pipe(
      map(transacao => this.mapTransactionFromBackend(transacao))
    );
  }

  // Map backend data to frontend format
  private mapTransactionFromBackend(transacao: any): Transaction {
    return {
      id: transacao.id,
      produtoId: transacao.produtoId,
      tipo: transacao.tipo,
      quantidade: transacao.quantidade,
      data: transacao.data,
      descricao: transacao.descricao,

      // Frontend compatibility properties
      productId: transacao.produtoId,
      transactionType: transacao.tipo,
      quantity: transacao.quantidade,
      timestamp: transacao.data,
      reason: transacao.descricao
    };
  }

  // Map frontend data to backend format
  private mapTransactionToBackend(transaction: Transaction): any {
    return {
      id: transaction.id,
      produtoId: transaction.productId || transaction.produtoId,
      tipo: transaction.transactionType || transaction.tipo,
      quantidade: transaction.quantity || transaction.quantidade,
      data: transaction.timestamp || transaction.data,
      descricao: transaction.reason || transaction.descricao
    };
  }
}
