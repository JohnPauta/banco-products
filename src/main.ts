import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { App } from './app/app';
import { ProductList } from './app/products/product-list/product-list';
import { ProductAdd } from './app/products/product-add/product-add';
import { ProductEdit } from './app/products/product-edit/product-edit';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: 'products', component: ProductList },
  { path: 'products/add', component: ProductAdd },
  { path: 'products/edit/:id', component: ProductEdit },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
];

bootstrapApplication(App, { providers: [provideRouter(routes), provideHttpClient()] });
