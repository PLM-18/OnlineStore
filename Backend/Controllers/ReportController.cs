using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IRepository _repository;

        public ReportController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("productsByBrand")]
        public async Task<IActionResult> getProductsByBrand()
        {
            var products = await _repository.GetProductsAsync();
            var groupByBrand = products
                .GroupBy(p => p.Brand.Name)
                .Select(g => new { Brand = g.Key, Count = g.Count() })
                .ToList();

            return Ok(groupByBrand);
        }

        [HttpGet("productsByType")]
        public async Task<IActionResult> GetProductsByType()
        { 
            var products = await _repository.GetProductsAsync();
            var groupByType = products
                .GroupBy(p => p.ProductType.Name)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToList();

            return Ok(groupByType);
        }

        [HttpGet("activeProductsReport")]
        public async Task<IActionResult> GetActiveProductsReport()
        {
            var activeProductReports = await _repository.GetActiveProductsReportAsync();
            return Ok(activeProductReports);

        }
    }
}
