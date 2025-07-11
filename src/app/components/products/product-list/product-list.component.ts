import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'name';
  sortOrder = 'asc';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🚀 ProductList: Loading products from API...');
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('✅ ProductList: Products loaded from API:', products);
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        console.error('❌ ProductList: Error loading products from API:', err);
        this.error = 'Erro ao carregar produtos: ' + err;
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('✅ ProductList: Categories loaded from API:', categories);
        this.categories = categories;
      },
      error: (err) => {
        console.error('❌ ProductList: Error loading categories from API:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const productName = this.getProductDisplayName(product);
      const productCode = this.getProductCode(product);
      const productDescription = product.description || '';

      const matchesSearch = productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        productCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        productDescription.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.selectedCategory ||
        this.getProductCategoryId(product) === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortBy) {
        case 'name':
          valueA = this.getProductDisplayName(a).toLowerCase();
          valueB = this.getProductDisplayName(b).toLowerCase();
          break;
        case 'price':
          valueA = a.price || 0;
          valueB = b.price || 0;
          break;
        case 'stock':
          valueA = this.getProductStock(a);
          valueB = this.getProductStock(b);
          break;
        case 'code':
          valueA = this.getProductCode(a).toLowerCase();
          valueB = this.getProductCode(b).toLowerCase();
          break;
        default:
          valueA = this.getProductDisplayName(a).toLowerCase();
          valueB = this.getProductDisplayName(b).toLowerCase();
      }

      if (valueA < valueB) {
        return this.sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  deleteProduct(product: Product): void {
    const productName = this.getProductDisplayName(product);
    if (confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) {
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          console.log('✅ ProductList: Product deleted successfully');
          this.loadProducts();
        },
        error: (err) => {
          console.error('❌ ProductList: Error deleting product:', err);
          alert('Erro ao excluir produto: ' + err);
        }
      });
    }
  }

  // ===================================================================
  // SAFE GETTER METHODS FOR PRODUCTS
  // ===================================================================

  getProductDisplayName(product: Product): string {
    return product.name || product.nome || 'Sem nome';
  }

  getProductCode(product: Product): string {
    return product.productCode || product.codigoProduto || '';
  }

  getProductStock(product: Product): number {
    return product.stockQuantity || product.stock || 0;
  }

  getProductCategoryId(product: Product): string {
    return product.categoryId || product.categoriaId || '';
  }

  // ===================================================================
  // SAFE GETTER METHODS FOR CATEGORIES
  // ===================================================================

  // ADDED: Missing method that HTML template was looking for
  getCategoryDisplayName(category: Category): string {
    return category.name || category.nome || 'Sem nome';
  }

  // Fixed: Added null check for categoryId
  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return 'Sem Categoria';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? this.getCategoryDisplayName(category) : 'Sem Categoria';
  }

  // ===================================================================
  // STOCK STATUS METHODS (Fixed to accept single Product parameter)
  // ===================================================================

  getStockStatusClass(product: Product): string {
    const stockQuantity = this.getProductStock(product);
    const minimumStock = product.minimumStock || 5;

    if (stockQuantity <= 0) {
      return 'badge bg-danger';
    } else if (stockQuantity <= minimumStock) {
      return 'badge bg-warning';
    } else {
      return 'badge bg-success';
    }
  }

  getStockStatusText(product: Product): string {
    const stockQuantity = this.getProductStock(product);
    const minimumStock = product.minimumStock || 5;

    if (stockQuantity <= 0) {
      return 'Sem Stock';
    } else if (stockQuantity <= minimumStock) {
      return 'Stock Baixo';
    } else {
      return 'Stock OK';
    }
  }

  // ===================================================================
  // DEBUG METHODS (optional - for troubleshooting)
  // ===================================================================

  testProductApi(): void {
    console.log('🧪 ProductList: Testing product API...');

    // Direct fetch test
    fetch('https://inventario-backend-20250708203346047.azurewebsites.net/api/produtos')
      .then(r => r.json())
      .then(data => {
        console.log('✅ ProductList: Direct fetch success:', data);
        console.log('📊 ProductList: Products count:', data.length);
        if (data.length > 0) {
          console.log('📋 ProductList: Sample product:', data[0]);
          console.log('🏷️ Available fields:', Object.keys(data[0]));
        }
      })
      .catch(err => {
        console.error('❌ ProductList: Direct fetch failed:', err);
      });

    // Angular service test
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('✅ ProductList: Angular service success:', data);
      },
      error: (err) => {
        console.error('❌ ProductList: Angular service failed:', err);
      }
    });
  }

  getApiUrl(): string {
    return 'https://inventario-backend-20250708203346047.azurewebsites.net/api';
  }
}
