using Backend.ViewModels;

namespace Backend.Models
{
    public interface IRepository
    {
        Task<bool> SaveChangesAsync();

        void Add<T>(T entity) where T : class;

        Task<List<Product>> GetProductsAsync();
        Task<Product> AddProductAsync(Product product);
        Task<Product> DeleteProductAsync(int id);

        Task<IEnumerable<Brand>> GetBrandsAsync();

        Task<IEnumerable<ProductType>> GetProductTypesAsync();

        Task<List<GroupProductsViewModel>> GetActiveProductsReportAsync();
    }
}
