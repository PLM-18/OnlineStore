import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  image: string;
  brand: {
    name: string;
  };
  productType: {
    name: string;
  };
}

@Component({
  selector: 'app-productlisting',
  standalone: false,
  templateUrl: './productlisting.component.html',
  styleUrl: './productlisting.component.css'
})
export class ProductlistingComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];

  filterText: string = '';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;

  apiUrl = 'https://localhost:7121/api/Store';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProducts();

    const message = history.state.successMessage;
    if (message) {
      this.showNotification(message);
    }
  }

  loadProducts(): void {
    this.http.get<Product[]>(`${this.apiUrl}/GetAllProducts`).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.applyFilter();
        this.updateDisplayedProducts();
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.showNotification('Failed to load products');
      }
    });
  }

  applyFilter(): void {
    if (!this.filterText) {
      this.filteredProducts = [...this.products];
    } else {
      const searchTerm = this.filterText.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.name.toLowerCase().includes(searchTerm) ||
        product.productType.name.toLowerCase().includes(searchTerm) ||
        product.price.toString().includes(searchTerm)
      );
    }

    this.sortProducts();
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      let valueA, valueB;

      switch (this.sortColumn) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'brand':
          valueA = a.brand.name.toLowerCase();
          valueB = b.brand.name.toLowerCase();
          break;
        case 'productType':
          valueA = a.productType.name.toLowerCase();
          valueB = b.productType.name.toLowerCase();
          break;
        case 'description':
          valueA = a.description.toLowerCase();
          valueB = b.description.toLowerCase();
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }

      // Apply sort direction
      if (this.sortDirection === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });

    this.updateDisplayedProducts();
  }

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortProducts();
  }

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredProducts.length);

    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProducts();
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
