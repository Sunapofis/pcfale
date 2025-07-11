import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { ProductService } from '../../../services/product.service';
import { Transaction } from '../../../models/transaction';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  products: Product[] = [];
  filteredTransactions: Transaction[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  selectedType = '';
  sortBy = 'date';
  sortOrder = 'desc';

  transactionTypes = [
    { value: 'compra', label: 'Compra' },
    { value: 'venda', label: 'Venda' },
    { value: 'ajuste', label: 'Ajuste' },
    { value: 'devolucao', label: 'Devolução' }
  ];

  constructor(
    private transactionService: TransactionService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadProducts();
  }

  loadTransactions(): void {
    this.loading = true;
    this.error = null;

    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        console.log('✅ TransactionList: Transactions loaded from API:', transactions);
        this.transactions = transactions;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ TransactionList: Error loading transactions from API:', err);
        this.error = 'Erro ao carregar transações: ' + err;
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
    this.filteredTransactions = this.transactions.filter(transaction => {
      const productName = this.getProductName(this.getTransactionProductId(transaction));
      const description = this.getTransactionDescription(transaction);

      const matchesSearch = productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.selectedType || this.getTransactionType(transaction) === this.selectedType;

      return matchesSearch && matchesType;
    });

    this.sortTransactions();
  }

  sortTransactions(): void {
    this.filteredTransactions.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortBy) {
        case 'date':
          valueA = new Date(this.getTransactionDate(a));
          valueB = new Date(this.getTransactionDate(b));
          break;
        case 'product':
          valueA = this.getProductName(this.getTransactionProductId(a)).toLowerCase();
          valueB = this.getProductName(this.getTransactionProductId(b)).toLowerCase();
          break;
        case 'type':
          valueA = this.getTransactionType(a).toLowerCase();
          valueB = this.getTransactionType(b).toLowerCase();
          break;
        case 'quantity':
          valueA = this.getTransactionQuantity(a);
          valueB = this.getTransactionQuantity(b);
          break;
        default:
          valueA = new Date(this.getTransactionDate(a));
          valueB = new Date(this.getTransactionDate(b));
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

  onTypeChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  createTransaction(): void {
    this.router.navigate(['/transactions/new']);
  }

  // Safe getter methods for Portuguese/English compatibility
  getTransactionProductId(transaction: Transaction): string {
    return transaction.productId || transaction.produtoId || '';
  }

  getTransactionType(transaction: Transaction): string {
    return transaction.transactionType || transaction.tipo || '';
  }

  getTransactionQuantity(transaction: Transaction): number {
    return transaction.quantity || transaction.quantidade || 0;
  }

  getTransactionDate(transaction: Transaction): string {
    return transaction.timestamp || transaction.data || '';
  }

  getTransactionDescription(transaction: Transaction): string {
    return transaction.reason || transaction.descricao || '';
  }

  getProductName(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      return product.name || product.nome || 'Produto sem nome';
    }
    return 'Produto não encontrado';
  }

  getTransactionTypeClass(transaction: Transaction): string {
    const type = this.getTransactionType(transaction).toLowerCase();
    switch (type) {
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

  getTransactionTypeName(transaction: Transaction): string {
    const type = this.getTransactionType(transaction).toLowerCase();
    switch (type) {
      case 'compra':
      case 'purchase':
        return 'Compra';
      case 'venda':
      case 'sale':
        return 'Venda';
      case 'ajuste':
      case 'adjustment':
        return 'Ajuste';
      case 'devolucao':
      case 'return':
        return 'Devolução';
      default:
        return type || 'Desconhecido';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT') + ' ' + date.toLocaleTimeString('pt-PT');
  }
}
