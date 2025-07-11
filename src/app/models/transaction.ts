export interface Transaction {
  id?: string;
  produtoId: string;               // matches backend "produtoId"
  tipo: string;                    // matches backend "tipo"
  quantidade: number;              // matches backend "quantidade"
  data: string;                    // matches backend "data"
  descricao?: string;              // matches backend "descricao"

  // Frontend-only properties for compatibility
  productId?: string;              // computed from produtoId
  transactionType?: string;        // computed from tipo
  quantity?: number;               // computed from quantidade
  timestamp?: string;              // computed from data
  reason?: string;                 // computed from descricao
  productName?: string;            // joined from product data
}
