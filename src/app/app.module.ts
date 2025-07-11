import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductSearchComponent } from './components/products/product-search/product-search.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { StockDashboardComponent } from './components/stock/stock-dashboard/stock-dashboard.component';
import { StockFormComponent } from './components/stock/stock-form/stock-form.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transactions/transaction-form/transaction-form.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoadingComponent } from './shared/loading/loading.component';

// Services
import { ApiService } from './services/api.service';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { StockService } from './services/stock.service';
import { TransactionService } from './services/transaction.service';

// Interceptors
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductListComponent,
    ProductFormComponent,
    ProductSearchComponent,
    CategoryListComponent,
    CategoryFormComponent,
    StockDashboardComponent,
    StockFormComponent,
    TransactionListComponent,
    TransactionFormComponent,
    NavbarComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    ApiService,
    ProductService,
    CategoryService,
    StockService,
    TransactionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
