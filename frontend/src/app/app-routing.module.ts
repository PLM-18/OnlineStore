import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductlistingComponent } from './productlisting/productlisting.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { ProductdashboardComponent } from './productdashboard/productdashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product-listing', component: ProductlistingComponent },
  { path: 'add-product', component: AddproductComponent },
  { path: 'product-dashboard', component: ProductdashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
