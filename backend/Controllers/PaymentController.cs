using APIbackend.Data;
using APIbackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
namespace APIbackend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            return await _context.Payments
                .Include(p => p.PaymentDetails)
                .ToListAsync();
        }

        // GET: api/payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.PaymentDetails)
                .FirstOrDefaultAsync(p => p.PaymentId == id);

            if (payment == null)
                return NotFound();

            return payment;
        } 

        // POST: api/payments
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(UpdatePaymentsDTO payment)
        {
            Payment clone = new Payment
            {
                customerName = payment.customerName,
                UserId = payment.UserId,
                Paymentstatus = payment.Paymentstatus,
                Phonerecei = payment.Phonerecei,
                Note = payment.Note,
                CreatedDate = DateTime.Now,
                Address = payment.Address,
                PaymentDetails = new List<Paymentdetail>(),
                sum = payment.sum
            };
            
            // baby women de ganqing haoxiang tiaolou ji
            if (payment.sto != null)
            {
                foreach (var item in payment.sto)
                {
                    var product = await _context.Products.FindAsync(item.productId);
                    if (product != null)
                    {
                        clone.PaymentDetails.Add(new Paymentdetail
                        {
                            ProductId = item.productId,
                            Stock = item.stock
                        });
                    }
                }
            }
            // i love git and also a girl from somewhere
            foreach (var item in clone.PaymentDetails)
            {
                _context.PaymentDetails.Add(item);
            }
            _context.Payments.Add(clone);
            await _context.SaveChangesAsync();
            // delete some girl from memory but i can't not,it's harder than i think so do not thing is better
            var cartItem = _context.CartItems.FirstOrDefault(c => c.UserId == payment.UserId);
            if (cartItem == null)
            {
                return NotFound();
            }
            _context.CartItems.Remove(cartItem);
            _context.SaveChanges();
            return CreatedAtAction("GetPayment", new { id = clone.PaymentId }, clone);
        }
        [HttpGet("AllUndone")]
        public IActionResult GetAllUndone()
        {
            var undonePayments = _context.Payments
                .Where(p => p.Paymentstatus <3)
                .ToList();
            return Ok(undonePayments);
        }
        //code đặc ruột
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> changestatus(int id,int x,int nvid)
        {
            var payment = await _context.Payments
                .Include(p => p.PaymentDetails)
                .FirstOrDefaultAsync(p => p.PaymentId == id);
            if (payment == null)
                return NotFound();
            payment.Paymentstatus = x;
            await _context.SaveChangesAsync();
            Update_history history = new Update_history
            {
                modify_paymentsid = id,
                modify_userid = nvid,
                CreatedDate = DateTime.Now,
                modify_status = x
            };
            _context.Update_historys.Add(history);
            _context.SaveChanges();
            if (x==1)
            {
                return Ok("đã xác nhận");
            }
            else if (x==2)
            {
                return Ok("Đang giao");
            }
            else if(x==3)
            {
                return Ok("Đã Giao");
            }
            else if(x==0)
            {
                return Ok("fixed");
            }
            return Ok("Đã Hủy");
        }
        //TOT có cup
        // doanh thu 
        [Authorize]
        [HttpGet("revenue")]
        public IActionResult GetRevenue(DateTime startDate, DateTime endDate)
        {
            var totalRevenue = _context.Payments
                .Where(p => p.Paymentstatus == 3
                            && p.CreatedDate >= startDate
                            && p.CreatedDate <= endDate)
                .Sum(p => p.sum);
            return Ok(totalRevenue);
        }
        // số lượng hàng
        [Authorize]
        [HttpGet("revenuecount")]
        public IActionResult GetRevenuecount(DateTime startDate, DateTime endDate)
        {
            var totalRevenue = _context.Payments
                .Where(p => p.Paymentstatus == 3
                            && p.CreatedDate >= startDate
                            && p.CreatedDate <= endDate)
                .ToList();
            return Ok(totalRevenue.Count);
        }
        // số lượng hàng
        [Authorize]
        [HttpGet("allcount")]
        public IActionResult GetRevenueproduct(DateTime startDate, DateTime endDate)
        {
            var totalRevenue = _context.Payments
                .Where(p => p.CreatedDate >= startDate
                            && p.CreatedDate <= endDate)
                .ToList();
            return Ok(totalRevenue.Count);
        }
        //truy vấn mã hoá đơn khách hàng
        [HttpGet("chitiethoadon")]
        public async Task<IActionResult> Getchitiethoadon(int Paymentid)
        {
            var paymentDetails = await _context.PaymentDetails
                .Where(pd => pd.PaymentId == Paymentid)
                .Select(pd => new
                {
                    pd.ProductId,
                    pd.Stock
                })
                .ToListAsync();

            if (paymentDetails == null || !paymentDetails.Any())
                return NotFound("Không tìm thấy chi tiết hóa đơn cho mã thanh toán này.");

            return Ok(paymentDetails);
        }


    }
}
