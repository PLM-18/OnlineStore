using Backend.Models;
using Backend.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly IRepository _repository;

        public StoreController(IRepository repository)
        {
            _repository = repository;
        }


        [HttpPost]
        [Route("addProduct")]
        public async Task<IActionResult> AddProduct([FromBody] ProductViewModel pvm)
        {
            if (!int.TryParse(pvm.brand, out int brandId))
            {

                return BadRequest("Invalid brand ID.");

            }

            if (!int.TryParse(pvm.producttype, out int productTypeId))
            {
                return BadRequest("Invalid product type ID.");
            }
            var product = new Product
            {
                Description = pvm.description,
                Name = pvm.name,
                BrandId = brandId,
                ProductTypeId = productTypeId,
                Price = pvm.price,
                Image = pvm.image
            };

            var addedProduct = await _repository.AddProductAsync(product);
            return Ok(addedProduct);
        }

        [HttpGet]
        [Route("GetAllProducts")]
        public async Task<IActionResult> GetProducts()
        {
            var prods = await _repository.GetProductsAsync();
            return Ok(prods);
        }

        [HttpGet("brands")]
        public async Task<IActionResult> GetBrands()
        {
            var brands = await _repository.GetBrandsAsync();
            return Ok(brands);
        }

        [HttpGet("productTypes")]
        public async Task<IActionResult> GetProductTypes()
        {
            var productTypes = await _repository.GetProductTypesAsync();
            return Ok(productTypes);
        }

    }
}
