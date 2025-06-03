namespace APIbackend.Data
{
    public class ResetPasswordRequest
    {
        public string email { get; set; }
        public string newpassword { get; set; }
    }
}
