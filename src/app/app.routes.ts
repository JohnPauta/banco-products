import { Routes } from '@angular/router';
import { ProductList } from './products/product-list/product-list';
import { ProductAdd } from './products/product-add/product-add';
import { ProductEdit } from './products/product-edit/product-edit';

export const routes: Routes = [
    { path: 'products', component: ProductList },
    { path: 'products/add', component: ProductAdd },
    { path: 'products/edit/:id', component: ProductEdit },
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: '**', redirectTo: 'products' },
];
