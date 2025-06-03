namespace APIbackend.Data
{
    public class ProductDetail
    {

            public required string Id { get; set; }
            public required string Name { get; set; }
            public decimal Price { get; set; }
            public string? Description { get; set; }
            public string? ImagePath { get; set; }           // ảnh chính
            public List<string>? SubImages { get; set; }     // ảnh phụ
        

    }
}
