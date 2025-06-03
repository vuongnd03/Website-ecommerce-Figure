using APIbackend.Data;

namespace APIbackend.Models
{
    public class CartItem
    {
        public int CartItemId { get; set; }
        public int UserId { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public DateTime AddedDate { get; set; }

        public Product Product { get; set; }
    }
}
