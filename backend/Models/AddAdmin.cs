using System.Security.AccessControl;

namespace APIbackend.Models
{
    public class AddAdmin
    {
        public required string username { get; set; }
        public required string password { get; set; }
        public required int rights { get; set; }
        public required string dchi { get; set; }
        public required string phonenumber { get; set; }
    }
}
    