using APIbackend.Models;
using System.Text.Json.Serialization;

namespace APIbackend.Data
{
    public class Product
    {
        public required string Id { get; set; }
        public required string Type { get; set; }

        public required string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImagePath { get; set; }
        public required string Description { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        [JsonIgnore]
        public ICollection<CartItem> CartItems { get; set; }
    }
}
