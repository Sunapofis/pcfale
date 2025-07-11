import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  showActiveOnly = true;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🚀 CategoryList: Loading categories from API...');
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    console.log('🌐 CategoryList: Making API call to get categories...');

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('✅ CategoryList: Categories loaded from API:', categories);
        this.categories = categories;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ CategoryList: Error loading categories from API:', err);
        this.error = 'Erro ao carregar categorias: ' + err;
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    console.log('🔍 CategoryList: Applying filters...');
    this.filteredCategories = this.categories.filter(category => {
      // Use both nome (backend) and name (frontend) for safety
      const categoryName = this.getCategoryDisplayName(category);
      const categoryDescription = category.description || '';

      const matchesSearch = categoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        categoryDescription.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesActiveFilter = !this.showActiveOnly || category.isActive !== false;

      return matchesSearch && matchesActiveFilter;
    });
    console.log('📊 CategoryList: Filtered categories:', this.filteredCategories.length);
  }

  onSearchChange(): void {
    console.log('🔍 CategoryList: Search term changed:', this.searchTerm);
    this.applyFilters();
  }

  onActiveFilterChange(): void {
    console.log('🔍 CategoryList: Active filter changed:', this.showActiveOnly);
    this.applyFilters();
  }

  editCategory(category: Category): void {
    console.log('✏️ CategoryList: Editing category:', category.id);
    this.router.navigate(['/categories/edit', category.id]);
  }

  deleteCategory(category: Category): void {
    const categoryName = this.getCategoryDisplayName(category);
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      console.log('🗑️ CategoryList: Deleting category:', category.id);

      this.categoryService.deleteCategory(category.id!).subscribe({
        next: () => {
          console.log('✅ CategoryList: Category deleted successfully');
          this.loadCategories(); // Reload the list
        },
        error: (err) => {
          console.error('❌ CategoryList: Error deleting category:', err);
          alert('Erro ao excluir categoria: ' + err);
        }
      });
    }
  }

  // Get category name safely (handles both Portuguese and English)
  getCategoryDisplayName(category: Category): string {
    return category.name || category.nome || 'Sem nome';
  }

  // Added missing methods for HTML template
  testCategoryApi(): void {
    console.log('🧪 CategoryList: Testing category API...');

    // Direct fetch test to see raw data
    fetch('https://inventario-backend-20250708203346047.azurewebsites.net/api/categorias')
      .then(r => r.json())
      .then(data => {
        console.log('✅ CategoryList: Direct fetch success:', data);
        console.log('📊 CategoryList: Categories count:', data.length);
        if (data.length > 0) {
          console.log('📋 CategoryList: Sample category:', data[0]);
          console.log('🏷️ Available fields:', Object.keys(data[0]));
        }
      })
      .catch(err => {
        console.error('❌ CategoryList: Direct fetch failed:', err);
      });

    // Angular service test
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.log('✅ CategoryList: Angular service success:', data);
      },
      error: (err) => {
        console.error('❌ CategoryList: Angular service failed:', err);
      }
    });
  }

  getApiUrl(): string {
    return 'https://inventario-backend-20250708203346047.azurewebsites.net/api';
  }
}
