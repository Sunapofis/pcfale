export interface Category {
  // BACKEND FIELDS (exactly as they exist in your Java model)
  id?: string;
  nome: string;                    // ✅ exists in backend

  // FRONTEND-ONLY FIELDS (computed/defaulted)
  name?: string;                   // computed from nome
  description?: string;            // default to empty (backend doesn't have this)
  isActive?: boolean;              // default to true (backend doesn't have this)
}
