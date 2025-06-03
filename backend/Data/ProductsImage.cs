

using System.ComponentModel.DataAnnotations;

namespace APIbackend.Data
{
    public class ProductsImage
    {
        [Key]
        public int ImageId { get; set; } 
        public required string Id { get; set; }
        public string? ImagePath { get; set; }

    }
}
