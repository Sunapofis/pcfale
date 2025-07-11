import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {
  searchForm: FormGroup;
  products: any[] = [];
  categories: any[] = [];
  loading = false;
  searchPerformed = false;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      categoryId: [''],
      minPrice: [''],
      maxPrice: [''],
      inStock: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = [
      { id: 1, name: 'Smartphones' },
      { id: 2, name: 'Laptops' },
      { id: 3, name: 'Tablets' }
    ];
  }

  onSearch(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value?.trim();

    if (!searchTerm || searchTerm.length < 2) {
      alert('Digite pelo menos 2 caracteres para pesquisar');
      return;
    }

    this.loading = true;
    this.searchPerformed = true;

    // Simulate API call
    setTimeout(() => {
      this.products = [
        {
          id: 1,
          name: 'Smartphone Samsung Galaxy S23',
          productCode: 'SM001',
          price: 799.99,
          stockQuantity: 25,
          categoryId: 1
        },
        {
          id: 2,
          name: 'Samsung Galaxy Note',
          productCode: 'SM002',
          price: 899.99,
          stockQuantity: 15,
          categoryId: 1
        }
      ].filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.applyFilters();
      this.loading = false;
    }, 1000);
  }

  applyFilters(): void {
    const filters = this.searchForm.value;

    this.products = this.products.filter(product => {
      // Category filter
      if (filters.categoryId && product.categoryId.toString() !== filters.categoryId) {
        return false;
      }

      // Price range filter
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      // In stock filter
      if (filters.inStock && (product.stockQuantity || 0) <= 0) {
        return false;
      }

      return true;
    });
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.products = [];
    this.searchPerformed = false;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sem Categoria';
  }

  getStockStatus(product: any): { class: string, text: string } {
    const stock = product.stockQuantity || 0;
    const minStock = product.minimumStock || 0;

    if (stock <= 0) {
      return { class: 'badge bg-danger', text: 'Sem Stock' };
    } else if (stock <= minStock) {
      return { class: 'badge bg-warning', text: 'Stock Baixo' };
    } else {
      return { class: 'badge bg-success', text: 'Stock OK' };
    }
  }
}
