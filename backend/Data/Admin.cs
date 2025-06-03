namespace APIbackend.Data
{
    public class Admin
    {
        public int id { get; set; }
        public required string username { get; set; }
        public required string password { get; set; }
        public int rights {  get; set; }
        public required string dchi { get; set; }
        public required string phonenumber { get; set; }
    }
}
