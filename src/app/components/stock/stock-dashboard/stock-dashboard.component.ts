import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { ProductService } from '../../../services/product.service';
import { Stock } from '../../../models/stock';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-stock-dashboard',
  templateUrl: './stock-dashboard.component.html',
  styleUrls: ['./stock-dashboard.component.css']
})
export class StockDashboardComponent implements OnInit {
  stockItems: Stock[] = [];
  products: Product[] = [];
  filteredStockItems: Stock[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  showLowStockOnly = false;

  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStockData();
    this.loadProducts();
  }

  loadStockData(): void {
    this.loading = true;
    this.error = null;

    this.stockService.getStock().subscribe({
      next: (stockItems) => {
        console.log('✅ StockDashboard: Stock loaded from API:', stockItems);
        this.stockItems = stockItems;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ StockDashboard: Error loading stock from API:', err);
        this.error = 'Erro ao carregar dados de stock: ' + err;
        this.loading = false;
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredStockItems = this.stockItems.filter(item => {
      const productName = this.getProductName(this.getStockProductId(item));
      const location = this.getStockLocation(item);

      const matchesSearch = productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesLowStock = !this.showLowStockOnly || this.isLowStock(item);

      return matchesSearch && matchesLowStock;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onLowStockFilterChange(): void {
    this.applyFilters();
  }

  updateStock(stockItem: Stock): void {
    const productId = this.getStockProductId(stockItem);
    this.router.navigate(['/stock/update', productId]);
  }

  // Safe getter methods for Portuguese/English compatibility
  getStockProductId(stockItem: Stock): string {
    return stockItem.productId || stockItem.produtoId || '';
  }

  getStockQuantity(stockItem: Stock): number {
    return stockItem.quantity || stockItem.quantidade || 0;
  }

  getStockLocation(stockItem: Stock): string {
    return stockItem.location || stockItem.localizacao || 'Sem localização';
  }

  getProductName(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      return product.name || product.nome || 'Produto sem nome';
    }
    return 'Produto não encontrado';
  }

  isLowStock(stockItem: Stock): boolean {
    const quantity = this.getStockQuantity(stockItem);
    const minimumLevel = stockItem.minimumLevel || 5;
    return quantity <= minimumLevel;
  }

  getStockStatusClass(stockItem: Stock): string {
    const quantity = this.getStockQuantity(stockItem);
    const minimumLevel = stockItem.minimumLevel || 5;

    if (quantity <= 0) {
      return 'badge bg-danger';
    } else if (quantity <= minimumLevel) {
      return 'badge bg-warning';
    } else {
      return 'badge bg-success';
    }
  }

  getStockStatusText(stockItem: Stock): string {
    const quantity = this.getStockQuantity(stockItem);
    const minimumLevel = stockItem.minimumLevel || 5;

    if (quantity <= 0) {
      return 'Sem Stock';
    } else if (quantity <= minimumLevel) {
      return 'Stock Baixo';
    } else {
      return 'Stock Normal';
    }
  }
}
