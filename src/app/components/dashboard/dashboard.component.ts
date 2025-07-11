import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { StockService } from '../../services/stock.service';
import { TransactionService } from '../../services/transaction.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Stock } from '../../models/stock';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalCategories = 0;
  lowStockItems: Stock[] = [];
  recentTransactions: Transaction[] = [];
  totalStockValue = 0;
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private stockService: StockService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load products count and calculate total stock value
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        console.log('✅ Products loaded:', products);
        this.totalProducts = products.length;
        this.calculateTotalStockValue(products);
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.error = 'Erro ao carregar produtos';
      }
    });

    // Load categories count
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        console.log('✅ Categories loaded:', categories);
        this.totalCategories = categories.length;
      },
      error: (err: any) => {
        console.error('Error loading categories:', err);
      }
    });

    // Load stock items (use getStock instead of getLowStockItems)
    this.stockService.getStock().subscribe({
      next: (items: Stock[]) => {
        console.log('✅ Stock items loaded:', items);
        // Filter for low stock items manually
        this.lowStockItems = items
          .filter(item => {
            const quantity = item.quantity || item.quantidade || 0;
            const minimumLevel = item.minimumLevel || 5;
            return quantity <= minimumLevel;
          })
          .slice(0, 5); // Show only first 5
      },
      error: (err: any) => {
        console.error('Error loading stock items:', err);
      }
    });

    // Load recent transactions (use getTransactions instead of getRecentTransactions)
    this.transactionService.getTransactions().subscribe({
      next: (transactions: Transaction[]) => {
        console.log('✅ Recent transactions loaded:', transactions);
        this.recentTransactions = transactions
          .sort((a, b) => {
            const dateA = new Date(a.timestamp || a.data || 0).getTime();
            const dateB = new Date(b.timestamp || b.data || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 10); // Show only last 10
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading transactions:', err);
        this.loading = false;
      }
    });
  }

  calculateTotalStockValue(products: Product[]): void {
    this.totalStockValue = products.reduce((total, product) => {
      const price = product.price || 0;
      const stock = product.stockQuantity || product.stock || 0;
      return total + (price * stock);
    }, 0);
  }

  getTransactionTypeClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'compra':
      case 'purchase':
        return 'badge bg-success';
      case 'venda':
      case 'sale':
        return 'badge bg-primary';
      case 'ajuste':
      case 'adjustment':
        return 'badge bg-warning';
      case 'devolucao':
      case 'return':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  getTransactionTypeName(type: string): string {
    switch (type?.toLowerCase()) {
      case 'purchase':
      case 'compra':
        return 'Compra';
      case 'sale':
      case 'venda':
        return 'Venda';
      case 'adjustment':
      case 'ajuste':
        return 'Ajuste';
      case 'return':
      case 'devolucao':
        return 'Devolução';
      default:
        return type || 'Desconhecido';
    }
  }
}
