using APIbackend.Data;
using Microsoft.EntityFrameworkCore;

namespace APIbackend.Models
{
    public class ProductsImageContext : DbContext
    {
        public ProductsImageContext(DbContextOptions<ProductsImageContext> options)
       : base(options)
        {
        }
        public DbSet<ProductsImage> Productsimage { get; set; }
    }
}
    