using System.Text.Json.Serialization;

namespace APIbackend.Data
{
    public class Paymentdetail
    {
        public int PaymentId { get; set; }
        public string ProductId { get; set; }
        public int Stock { get; set; }
        [JsonIgnore]
        public Payment Payment { get; set; }
        public Product Product { get; set; }
    }

}
