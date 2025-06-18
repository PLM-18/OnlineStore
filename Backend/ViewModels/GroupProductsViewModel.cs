namespace Backend.ViewModels
{
    public class GroupProductsViewModel
    {
        public string ProductType { get; set; }
        public string Brand { get; set; }
        public List<ProductViewModel> Products { get; set; }
        public bool IsActive { get; set; }
    }
}
