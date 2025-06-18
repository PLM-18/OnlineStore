import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ProductByBrand {
  brand: string;
  count: number;
}

export interface ProductByType {
  type: string;
  count: number;
}

export interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  brand: {
    name: string;
  };
  productType: {
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private readonly apiUrl = 'https://localhost:7121/api/Report';

  constructor(private http: HttpClient) {}

  getProductsGroupedByBrand(): Observable<ProductByBrand[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productsByBrand`);
  }

  getProductsGroupedByType(): Observable<ProductByType[]> {
    return this.http.get<ProductByType[]>(`${this.apiUrl}/productsByType`);
  }
  
  getActiveProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activeProductsReport`);
  }
  
  // New method to get all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('https://localhost:7121/api/Store/GetAllProducts');
  }
  
  getTopExpensiveProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => {
        return products
          .sort((a, b) => b.price - a.price)
          .slice(0, 10);
      })
    );
  }
}