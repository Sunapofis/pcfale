export interface Product {

  id?: string;
  nome: string;
  categoriaId: string;
  stock: number;
  codigoProduto: string;

  // FRONTEND-ONLY FIELDS (computed/defaulted, not sent to backend)
  name?: string;                   // computed from nome
  categoryId?: string;             // computed from categoriaId
  stockQuantity?: number;          // computed from stock
  productCode?: string;            // computed from codigoProduto

  // DEFAULT FIELDS (since they don't exist in backend)
  price?: number;                  // default to 0 since backend doesn't have preco
  description?: string;            // default to empty since backend doesn't have descricao
  minimumStock?: number;           // default to 5 since backend doesn't have stockMinimo
  categoryName?: string;           // joined from categories lookup
}
