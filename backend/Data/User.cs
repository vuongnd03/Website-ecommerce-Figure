

namespace APIbackend.Data
{
    public class User
    {
        //all we do is just for u our user
        public int id { get; set; }
        public required string fullname { get; set; }
        public required string phonenumber { get; set; }
        public required string email { get; set; }
        public required string password { get; set; }
        public string? Resetcode { get; set; }
        public DateTime? ResetCodeExpiry { get; set; }
    }
}
