namespace APIbackend.Data
{
    public class AddToCartRequest
    {
        public int UserId { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
