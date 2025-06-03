namespace APIbackend.Data
{
    public class ProductsImageDto
    {
        public required string Id { get; set; }
        public List<IFormFile>? ImagePath { get; set; }
    }
}
