import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Form only includes fields that exist in backend
    this.productForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      categoriaId: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      codigoProduto: ['', [Validators.required, Validators.minLength(3)]]
      // NOTE: Not including price, description, minimumStock since backend doesn't have them
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }

  checkEditMode(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.filter(c => c.isActive !== false);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Erro ao carregar categorias';
      }
    });
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.loading = true;
    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        // Map to form values (only backend fields)
        this.productForm.patchValue({
          nome: product.name || product.nome,
          categoriaId: product.categoryId || product.categoriaId,
          stock: product.stockQuantity || product.stock,
          codigoProduto: product.productCode || product.codigoProduto
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Erro ao carregar produto';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      // Create product data with only backend fields
      const productData: Product = {
        nome: this.productForm.value.nome,
        categoriaId: this.productForm.value.categoriaId,
        stock: this.productForm.value.stock,
        codigoProduto: this.productForm.value.codigoProduto,
        // Frontend compatibility
        name: this.productForm.value.nome,
        categoryId: this.productForm.value.categoriaId,
        stockQuantity: this.productForm.value.stock,
        productCode: this.productForm.value.codigoProduto
      };

      const request = this.isEditMode
        ? this.productService.updateProduct(this.productId!, productData)
        : this.productService.createProduct(productData);

      request.subscribe({
        next: () => {
          this.success = `Produto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error saving product:', err);
          this.error = 'Erro ao salvar produto';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `Valor mínimo: ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  generateProductCode(): void {
    const prefix = 'PROD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const generatedCode = `${prefix}${timestamp}${random}`;

    this.productForm.patchValue({ codigoProduto: generatedCode });
  }

  getCategoryDisplayName(category: Category): string {
    return category.name || category.nome || 'Sem nome';
  }
}
