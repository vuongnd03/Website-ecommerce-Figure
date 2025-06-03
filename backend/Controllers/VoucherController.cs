using APIbackend.Data;
using APIbackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace APIbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VoucherController : ControllerBase
{
    
    private readonly AppDbContext _context;

    public VoucherController(AppDbContext context)
    {
        _context = context;
    }

    //[get]Voucher : lấy thông tin tất cả các voucher dùng để hiện voucher
    
    [HttpGet]
    public IActionResult GetAll()
    {
        var vouchers = _context.Vouchers.ToList();
        return Ok(vouchers);
    }

    // Thêm voucher
    [Authorize]
    [HttpPost("Add")]
    public IActionResult AddVoucher([FromBody] Voucher voucher)
    {
        _context.Vouchers.Add(voucher);
        _context.SaveChanges();
        return Ok(voucher);
    }

    // edit voucher
    [Authorize]
    [HttpPut("Update/{id}")]
    public IActionResult UpdateVoucher(int id, [FromBody] Voucher updated)
    {
        var voucher = _context.Vouchers.Find(id);
        if (voucher == null)
            return NotFound();

        voucher.voucherCode = updated.voucherCode;
        voucher.discout = updated.discout;
        voucher.type = updated.type;
        voucher.createDate = updated.createDate;
        voucher.endDate = updated.endDate;
        voucher.note = updated.note;

        _context.SaveChanges();
        return Ok(voucher);
    }

    // xóa voucher
    [Authorize]
    [HttpDelete("Delete/{id}")]
    public IActionResult DeleteVoucher(int id)
    {
        var voucher = _context.Vouchers.Find(id);
        if (voucher == null)
            return NotFound();

        _context.Vouchers.Remove(voucher);
        _context.SaveChanges();
        return Ok(new { message = "Deleted successfully" });
    }
//lấy giá của đơn sau khi áp voucher
[HttpGet("getprice")]
    public IActionResult getPrice(string voucher, int price) {
        var voucher1 = _context.Vouchers.FirstOrDefault(v => v.voucherCode == voucher);
        if (voucher1 == null)
            return NotFound("Voucher not found");
        if (voucher1.type == 0)
        {
            price = price - voucher1.discout;
        }
        else
        {
            price = price - (price * voucher1.discout / 100);
        }
        return Ok(price);
    }
    //it's just better when we do it by our heart but if u are tired remember "never give up" is stupid! so it is ur choice 
    //to be stupid or smart and some time you can be stupid instead of being smart there is no problem
}
