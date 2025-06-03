namespace APIbackend.Models
{
    public class AddUsers
    {
        public int id { get; set; }
        public required string fullname { get; set; }
        public required string phonenumber { get; set; }
        public required string email { get; set; }
        public required string password { get; set; }
    }
}
