export interface Product {
  id?: string;
  nome: string;                    // matches backend "nome"
  categoriaId: string;             // matches backend "categoriaId"
  stock: number;                   // matches backend "stock"
  codigoProduto: string;           // matches backend "codigoProduto"

  // Frontend-only properties for compatibility
  name?: string;                   // computed from nome
  price?: number;                  // you might need to add this to backend
  productCode?: string;            // computed from codigoProduto
  categoryId?: string;             // computed from categoriaId
  stockQuantity?: number;          // computed from stock
  minimumStock?: number;           // you might need to add this to backend
  description?: string;            // you might need to add this to backend
}
