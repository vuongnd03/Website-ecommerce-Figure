namespace APIbackend.Data
{
    public class ProductsDto
    {
        public required string Id { get; set; }
        public required string Type { get; set; }

        public required string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public IFormFile? ImagePath { get; set; }
        public required string Description { get; set; }
    }
}
