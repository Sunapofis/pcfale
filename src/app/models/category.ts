export interface Category {
  id?: string;
  nome: string;                    // matches backend "nome"

  // Frontend-only properties for compatibility
  name?: string;                   // computed from nome
  description?: string;            // you might need to add this to backend
  isActive?: boolean;              // you might need to add this to backend
}
