using Backend.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;

namespace Backend.Models
{
    public class Repository : IRepository
    {
        private readonly AppDbContext _appDbContext;

        public Repository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async Task<List<Product>> GetProductsAsync()
        {

            List<Product> products = await _appDbContext.Products
                .Join(_appDbContext.Brands, p => p.BrandId, b => b.BrandId, (p, b) => new { Product = p, BrandName = b.Name })
                .Join(_appDbContext.ProductTypes, pb => pb.Product.ProductTypeId, pt => pt.ProductTypeId, (pb, pt) => new Product
                {
                    ProductId = pb.Product.ProductId,
                    Price = pb.Product.Price,
                    Image = pb.Product.Image,
                    BrandId = pb.Product.BrandId,
                    ProductTypeId = pb.Product.ProductTypeId,
                    Name = pb.Product.Name,
                    Description = pb.Product.Description,
                    Brand = new Brand
                    {
                        BrandId = pb.Product.BrandId,
                        Name = pb.BrandName,
                        Description = null,
                        DateCreated = pb.Product.DateCreated,
                        DateModified = pb.Product.DateModified,
                        IsActive = pb.Product.IsActive,
                        IsDeleted = pb.Product.IsDeleted
                    },
                    ProductType = new ProductType
                    {
                        ProductTypeId = pt.ProductTypeId,
                        Name = pt.Name,
                        Description = pt.Description,
                        DateCreated = pt.DateCreated,
                        DateModified = pt.DateModified,
                        IsActive = pt.IsActive,
                        IsDeleted = pt.IsDeleted
                    },

                })
                .ToListAsync();

            return products;
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            _appDbContext.Products.Add(product);
            await _appDbContext.SaveChangesAsync();
            return product;
        }

        public async Task<Product> DeleteProductAsync(int id)
        {
            var product = await _appDbContext.Products.FindAsync(id);
            if (product != null)
            {
                _appDbContext.Products.Remove(product);
                await _appDbContext.SaveChangesAsync();
                return product;
            }

            return null;

        }

        public async Task<IEnumerable<Brand>> GetBrandsAsync()
        {
            return await _appDbContext.Brands.ToListAsync();
        }

        public async Task<IEnumerable<ProductType>> GetProductTypesAsync()
        {
            return await _appDbContext.ProductTypes.ToListAsync();
        }

        public async Task<List<Brand>> GetProductsGroupedByBrandAsync()
        {
            return await _appDbContext.Brands
                .Include(b => b.Products)
                .ToListAsync();
        }

        public async Task<List<GroupProductsViewModel>> GetActiveProductsReportAsync()
        {
            var activeProductsReport = await _appDbContext.Products
                .Where(p => p.IsActive) 
                .Include(p => p.ProductType)
                .Include(p => p.Brand)
                .ToListAsync();

            var report = activeProductsReport
                .GroupBy(p => new { ProductTypeName = p.ProductType.Name, BrandName = p.Brand.Name })
                .Select(g => new GroupProductsViewModel
                {
                    ProductType = g.Key.ProductTypeName,
                    Brand = g.Key.BrandName,
                    IsActive = true,
                    Products = g.Select(p => new ProductViewModel
                    {
                        name = p.Name,
                        producttype = p.ProductType.Name,
                        price = p.Price,
                        description = p.Description,
                        brand = p.Brand.Name, 
                        image = p.Image
                    }).ToList()
                })
                .ToList();

            return report;
        }
    }
}
