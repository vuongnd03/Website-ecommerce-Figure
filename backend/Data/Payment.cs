using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace APIbackend.Data
{
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Paymentstatus { get; set; }
        public string Phonerecei { get; set; }
        public string Note { get; set; }
        public string Address { get; set; }
        public int sum { get; set; }
        public string customerName { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        public List<Paymentdetail> PaymentDetails { get; set; }
    }
}
