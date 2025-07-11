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
        console.log('✅ ProductList: Products loaded and mapped:', products);
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        console.error('❌ ProductList: Error loading products:', err);
        this.error = 'Erro ao carregar produtos: ' + err;
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('✅ ProductList: Categories loaded:', categories);
        this.categories = categories;
      },
      error: (err) => {
        console.error('❌ ProductList: Error loading categories:', err);
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
          valueA = this.getProductPrice(a);
          valueB = this.getProductPrice(b);
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
          console.log('✅ Product deleted successfully');
          this.loadProducts();
        },
        error: (err) => {
          console.error('❌ Error deleting product:', err);
          alert('Erro ao excluir produto: ' + err);
        }
      });
    }
  }

  // ===================================================================
  // SAFE GETTER METHODS (handle current backend structure)
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

  getProductPrice(product: Product): number {
    // Since backend doesn't have price, always return 0 and show "Not defined"
    return product.price || 0;
  }

  getProductCategoryId(product: Product): string {
    return product.categoryId || product.categoriaId || '';
  }

  getProductCategoryName(product: Product): string {
    // Use the joined category name from mapping
    return product.categoryName || 'Categoria não encontrada';
  }

  getCategoryDisplayName(category: Category): string {
    return category.name || category.nome || 'Sem nome';
  }

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return 'Sem Categoria';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? this.getCategoryDisplayName(category) : 'Categoria não encontrada';
  }

  getStockStatusClass(product: Product): string {
    const stockQuantity = this.getProductStock(product);
    const minimumStock = product.minimumStock || 5; // Default minimum

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
    const minimumStock = product.minimumStock || 5; // Default minimum

    if (stockQuantity <= 0) {
      return 'Sem Stock';
    } else if (stockQuantity <= minimumStock) {
      return 'Stock Baixo';
    } else {
      return 'Stock OK';
    }
  }

  // Debug method to check what data we're receiving
  debugProductData(): void {
    console.log('🔍 Debug: Current products array:', this.products);
    if (this.products.length > 0) {
      console.log('🔍 Debug: Sample product:', this.products[0]);
      console.log('🔍 Debug: Product fields:', Object.keys(this.products[0]));
    }
  }
}
