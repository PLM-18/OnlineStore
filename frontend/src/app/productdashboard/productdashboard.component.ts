import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportingService } from '../services/report.service';

interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  brand: {
    name: string;
  };
  productType: {
    name: string;
  };
}

interface ProductByBrand {
  brand: string;
  count: number;
}

interface ProductByType {
  type: string;
  count: number;
}

@Component({
  selector: 'app-productdashboard',
  standalone: false,
  templateUrl: './productdashboard.component.html',
  styleUrl: './productdashboard.component.css'
})
export class ProductdashboardComponent implements OnInit {
  topExpensiveProducts: Product[] = [];
  isLoading: boolean = true;

  constructor(private reportService: ReportingService) { }

  ngOnInit(): void {
    Chart.register(...registerables);

    // Get products grouped by brand for pie chart
    this.reportService.getProductsGroupedByBrand().subscribe({
      next: (data) => {
        this.renderBrandPieChart(data);
      },
      error: (err) => {
        console.error('Error loading brand data:', err);
      }
    });

    this.reportService.getProductsGroupedByType().subscribe({
      next: (data) => {
        this.renderTypePieChart(data);
      },
      error: (err) => {
        console.error('Error loading product type data:', err);
      }
    });

    this.reportService.getAllProducts().subscribe({
      next: (products) => {
        this.topExpensiveProducts = products
          .sort((a, b) => b.price - a.price)
          .slice(0, 10);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  renderBrandPieChart(data: ProductByBrand[]): void {
    if (!data || data.length === 0) return;

    const labels = data.map(item => item.brand);
    const counts = data.map(item => item.count);

    const backgroundColors = [
      '#FF9999', // Light pink
      '#99CCFF', // Light blue
      '#FFDD99', // Light yellow/gold
      '#CCCCCC', // Light gray
      '#D7A9D5', // Light purple
      '#A9D7A9'  // Light green
    ];

    const chartElement = document.getElementById('brandPieChart');
    if (!chartElement) return;

    new Chart('brandPieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => this.darkenColor(color, 10)),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.parsed} (${Math.round((context.parsed / context.dataset.data.reduce((a, b) => Number(a) + Number(b), 0)) * 100)}%)`;
              }
            }
          }
        }
      }
    });
  }

  renderTypePieChart(data: ProductByType[]): void {
    if (!data || data.length === 0) return;

    const labels = data.map(item => item.type);
    const counts = data.map(item => item.count);

    const backgroundColors = [
      '#FF9999', // Light pink
      '#99CCFF', // Light blue
      '#FFDD99', // Light yellow/gold
      '#CCCCCC', // Light gray
      '#D7A9D5'  // Light purple
    ];

    const chartElement = document.getElementById('typePieChart');
    if (!chartElement) return;

    new Chart('typePieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => this.darkenColor(color, 10)),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.parsed} (${Math.round((context.parsed / context.dataset.data.reduce((a, b) => Number(a) + Number(b), 0)) * 100)}%)`;
              }
            }
          }
        }
      }
    });
  }

  darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const darkenR = Math.max(0, r - amount);
    const darkenG = Math.max(0, g - amount);
    const darkenB = Math.max(0, b - amount);

    return `#${darkenR.toString(16).padStart(2, '0')}${darkenG.toString(16).padStart(2, '0')}${darkenB.toString(16).padStart(2, '0')}`;
  }
}