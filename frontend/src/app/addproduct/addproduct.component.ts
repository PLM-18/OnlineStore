import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Brand {
  brandId: number;
  name: string;
}

interface ProductType {
  productTypeId: number;
  name: string;
}

@Component({
  selector: 'app-addproduct',
  standalone: false,
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css'
})
export class AddproductComponent implements OnInit{
  productForm!: FormGroup;
  brands: Brand[] = [];
  productTypes: ProductType[] = [];
  imageBase64: string = '';
  imagePreview: string = '';
  submitting: boolean = false;
  
  apiUrl = 'https://localhost:7121/api/Store';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBrands();
    this.loadProductTypes();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      producttype: ['', [Validators.required]]
    });
  }

  loadBrands(): void {
    this.http.get<Brand[]>(`${this.apiUrl}/brands`).subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.error('Error loading brands', err);
      }
    });
  }

  loadProductTypes(): void {
    this.http.get<ProductType[]>(`${this.apiUrl}/productTypes`).subscribe({
      next: (data) => {
        this.productTypes = data;
      },
      error: (err) => {
        console.error('Error loading product types', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Image size should not exceed 5MB');
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        this.imageBase64 = base64Data;
        this.imagePreview = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    if (!this.imageBase64) {
      alert('Please select an image for the product');
      return;
    }

    this.submitting = true;
    
    const productData = {
      name: this.productForm.value.name,
      price: parseFloat(this.productForm.value.price),
      description: this.productForm.value.description,
      brand: this.productForm.value.brand,
      producttype: this.productForm.value.producttype,
      image: this.imageBase64
    };

    this.http.post(`${this.apiUrl}/addProduct`, productData).subscribe({
      next: (response) => {
        this.submitting = false;
        this.router.navigate(['/product-listing'], { 
          state: { successMessage: `${productData.name} created successfully.` }
        });
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error adding product', err);
        alert('Failed to add product. Please try again.');
      }
    });
  }
}
