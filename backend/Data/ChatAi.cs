using System.ComponentModel.DataAnnotations;

namespace APIbackend.Data
{
    public class ChatAi
    {
        [Key]
        public int Id { get; set; }  // tự động tăng
        public string Message { get; set; }
    }
}
