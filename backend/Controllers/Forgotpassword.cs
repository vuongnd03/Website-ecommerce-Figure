using APIbackend.Data;
using APIbackend.Models;
using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace APIbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Forgotpassword : ControllerBase
    {
        private readonly UserContext dbcontext;
        private readonly IEmailService emailService;
        public Forgotpassword(UserContext dbcontext, IEmailService emailService)
        {

            this.dbcontext = dbcontext;
            this.emailService = emailService;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest requet)
        {
            var user = await dbcontext.Users.FirstOrDefaultAsync(u => u.email == requet.email);
            if (user == null)
            {
                return NotFound("không tìm thấy tài khoản người dùng với email trên");
            }
            var vericode = new Random().Next(100000, 999999).ToString();
            user.Resetcode = vericode;
            user.ResetCodeExpiry = DateTime.UtcNow.AddMinutes(1);
            await emailService.SendEmailAsync(user.email, "Your verification code", $"Your code is: {vericode}");
            await dbcontext.SaveChangesAsync();
            return Ok("Code sent");
        }

        [HttpPost("verify-code")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeRequest requet)
        {
            var user = await dbcontext.Users.FirstOrDefaultAsync(u => u.email == requet.email);
            if (user == null || user.Resetcode != requet.code || user.ResetCodeExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired code");

            return Ok("Code valid");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest requet)
        {
            var user = await dbcontext.Users.FirstOrDefaultAsync(u => u.email == requet.email);
            if (user == null) return NotFound("User not found");
            //băm mật khẩu
            var hasher = new PasswordHasher<User>();
            user.password = hasher.HashPassword(user, requet.newpassword);
            // Xóa mã reset sau khi đặt lại mật khẩu
            user.Resetcode = null;
            user.ResetCodeExpiry = null;

            await dbcontext.SaveChangesAsync();
            return Ok("lưu mật khẩu mới thành công");
        }

    }

}
