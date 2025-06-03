using APIbackend.Data;
using APIbackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace APIbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly IWebHostEnvironment _env;
        private readonly AppDbContext _context;
        private readonly UserContext _userContext;
        public OrderController(EmailService emailService, IWebHostEnvironment env,AppDbContext context, UserContext userContext)
        {
            _emailService = emailService;
            _env = env;
            _context = context;
            _userContext = userContext;
        }

        [HttpPost("checkout-success")]
        public async Task<IActionResult> CheckoutSuccess(int orderidl)
        {
            // 1. Lấy thông tin đơn hàng từ database
            var model = await _context.Payments
                .Include(p => p.PaymentDetails)
                .ThenInclude(pd => pd.Product)
                .FirstOrDefaultAsync(p => p.PaymentId == orderidl);
            // 1. Sinh file PDF
            var pdf = InvoiceGenerator.GenerateInvoice(model);

            // 2. Load template email và thay giá trị
            var path = Path.Combine(_env.ContentRootPath, "Templates", "SuccessEmailTemplate.html");
            var html = await System.IO.File.ReadAllTextAsync(path);
            html = html.Replace("{CustomerName}", model.customerName)
                       .Replace("{OrderId}", model.PaymentId.ToString())
                       .Replace("{TotalAmount}", model.sum.ToString("N0"));

            var user = _userContext.Users.FirstOrDefault(u => u.id == model.UserId);
            var email = user?.email;
            // 3. Gửi email
            await _emailService.SendEmailWithAttachmentAsync(
                email,
                $"Xác nhận đơn hàng {model.PaymentId}",
                html,
                pdf,
                $"HoaDon_{model.PaymentId}.pdf"
            );
            return Ok("Đã gửi email xác nhận");
        }
    }

    public class CheckoutRequest
    {
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
