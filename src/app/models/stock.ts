export interface Stock {
  id?: string;
  produtoId: string;               // matches backend "produtoId"
  quantidade: number;              // matches backend "quantidade"
  localizacao?: string;            // matches backend "localizacao"

  // Frontend-only properties for compatibility
  productId?: string;              // computed from produtoId
  quantity?: number;               // computed from quantidade
  location?: string;               // computed from localizacao
  minimumLevel?: number;           // you might need to add this to backend
  productName?: string;            // joined from product data
}
