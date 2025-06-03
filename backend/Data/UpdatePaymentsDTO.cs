namespace APIbackend.Data
{
    public class Productside
    {
        public string productId { get; set; }
        public int stock { get; set; }
    }
    public class UpdatePaymentsDTO
    {
        //public int PaymentId { get; set; }
        public int UserId { get; set; }
        public int Paymentstatus { get; set; }
        public string Phonerecei { get; set; }
        public string Note { get; set; }
        public string Address { get; set; }
        public int sum { get; set; }
        public string customerName { get; set; }
        public List<Productside> sto { get; set; }
    }
}
