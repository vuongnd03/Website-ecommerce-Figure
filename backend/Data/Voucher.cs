namespace APIbackend.Data
{
    public class Voucher
    {
        public int voucherId { get; set; }  
        public string? voucherCode { get; set; }
        public int discout { get; set; }
        public int type { get; set; }
        public DateTime createDate { get; set; }
        public DateTime endDate { get; set; }
        public string? note { get; set; }
    }
}
