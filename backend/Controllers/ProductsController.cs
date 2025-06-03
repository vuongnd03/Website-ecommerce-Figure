using APIbackend.Data;
using APIbackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using Microsoft.AspNetCore.Authorization;
namespace APIbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        //u can control this product using this cute api eto 👉👈!!
        // AIs are predictable but human are not or still can be but harder
        private readonly ProductsContext _context;
        private readonly ProductsImageContext _Imagecontext;
        private readonly AppDbContext _appDbContext;
        public ProductsController (ProductsContext context, ProductsImageContext imagecontext,AppDbContext appDbContext)
        {
            _context = context;
            _Imagecontext = imagecontext;
            _appDbContext = appDbContext;
        }
        //  API thêm sản phẩm 
        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddProduct([FromForm] ProductsDto productDto)
        {
            if (productDto == null || string.IsNullOrEmpty(productDto.Name))
                return BadRequest("Sản phẩm không hợp lệ!");

            string? savedImagePath = null;

            if (productDto.ImagePath != null && productDto.ImagePath.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsFolder);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.ImagePath.FileName); // Đúng tên file
                var filePath = Path.Combine(uploadsFolder, fileName);
                try
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productDto.ImagePath.CopyToAsync(stream);
                    }

                    savedImagePath = $"/uploads/{fileName}"; 
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Lỗi khi lưu ảnh: {ex.Message}");
                }
            }
            var product = new Product
            {
                Id = productDto.Id,
                Type = productDto.Type,
                Name = productDto.Name,
                Price = productDto.Price,
                Stock = productDto.Stock,
                ImagePath = savedImagePath, 
                Description = productDto.Description,
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm sản phẩm thành công!", product });
        }
        //Api thêm nhiều ảnh phụ cho sản phẩm
        [Authorize]
        [HttpPost("AddSubImage")]
        public async Task<IActionResult> AddSubImage([FromForm] ProductsImageDto productsimagedto)
        {
            var product = await _context.Products.FindAsync(productsimagedto.Id);
            if (product == null)
            {
                return NotFound("Không tìm thấy sản phẩm!");
            }

            if (productsimagedto.ImagePath == null || productsimagedto.ImagePath.Count != 6)
            {
                return BadRequest("Phải gửi đúng 6 ảnh.");
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "sub");
            Directory.CreateDirectory(uploadsFolder);

            foreach (var image in productsimagedto.ImagePath)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                var productImage = new ProductsImage
                {
                    // KHÔNG gán ImageId nếu nó là auto-increment
                    Id = productsimagedto.Id,
                    ImagePath = $"/images/sub/{fileName}"
                };

                _Imagecontext.Productsimage.Add(productImage); // OK vì ImageId khác nhau
            }

            await _Imagecontext.SaveChangesAsync();
            return Ok("Thêm 6 ảnh phụ thành công!");
        }

        //Api hiển thị chi tiết sản phẩm
        
        [HttpGet("GetProductDetail/{id}")]
        public async Task<IActionResult> GetProductDetail(string id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            var subImages = await _Imagecontext.Productsimage
                .Where(img => img.Id == id)
                .Select(img => img.ImagePath)
                .ToListAsync();

            var productDto = new ProductDetail
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                ImagePath = product.ImagePath,
                SubImages = subImages
            };

            return Ok(productDto);
        }

        // POST: api/cart/add
        
        [HttpPost("addproductCart")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            // Kiểm tra xem sản phẩm có tồn tại không
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return NotFound("Sản phẩm không tồn tại");
            }

            // Kiểm tra xem user đã có sản phẩm này trong giỏ chưa
            var existingCartItem = await _appDbContext.CartItems
                .FirstOrDefaultAsync(c => c.UserId == request.UserId && c.ProductId == request.ProductId);

            if (existingCartItem != null)
            {
                // Nếu đã có, cập nhật số lượng
                existingCartItem.Quantity += request.Quantity;
            }
            else
            {
                // Nếu chưa có, thêm mới
                var newCartItem = new CartItem
                {
                    UserId = request.UserId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    AddedDate = DateTime.Now
                };

                _appDbContext.CartItems.Add(newCartItem);
            }

            await _appDbContext.SaveChangesAsync();
            return Ok("Đã thêm vào giỏ hàng");
        }
        //API lấy sản phẩm trong giỏ hàng ra
        
        [HttpGet("getcart/{userId}")]
        public async Task<IActionResult> GetCartItems(int userId)
        {
            var cartItems = await _appDbContext.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product) // đảm bảo bạn đã cấu hình navigation property
                .Select(ci => new CartItemDto
                {
                    ProductId = ci.Product.Id,
                    ProductName = ci.Product.Name,
                    ImagePath = ci.Product.ImagePath,
                    Quantity = ci.Quantity,
                    Price = ci.Product.Price
                })
                .ToListAsync();

            if (cartItems == null || !cartItems.Any())
            {
                return NotFound("Giỏ hàng trống.");
            }

            return Ok(cartItems);
        }
        //API xoá sản phẩm trong giỏ hàng
        
        [HttpDelete("deletefromcart")]
        public IActionResult Deletefromcart(int userId,string ProductId)
        {
            var cartItem = _appDbContext.CartItems.FirstOrDefault(c => c.UserId == userId && c.ProductId == ProductId);
            if(cartItem == null)
            {
                return NotFound();
            }
            _appDbContext.CartItems.Remove(cartItem);
            _appDbContext.SaveChanges();
            return Ok(cartItem);
        }
        // 2 API xóa sản phẩm của client
        
        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var cartproduct = _appDbContext.CartItems.FirstOrDefault(c => c.ProductId == id);
            if (cartproduct != null)
            {
                return BadRequest("Tìm thấy sản phẩm trong giỏ hàng, bạn không thể xoá nó!");
            }

            var imagedelete = _Imagecontext.Productsimage.Where(img => img.Id == id).ToList();
            if (imagedelete.Any())
            {
                _Imagecontext.Productsimage.RemoveRange(imagedelete);
                await _Imagecontext.SaveChangesAsync();
            }

            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa sản phẩm thành công!" });
            }

            return NotFound("Không tìm thấy sản phẩm để xoá.");
        }

        //API lấy sản phẩm và tìm kiếm

        [HttpGet("Get/{id}")]
        public IActionResult GetProduct(string id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound("Không tìm thấy sản phẩm!");
            }
            return Ok(product); // Trả về dữ liệu sản phẩm
        }
        //API tìm kiếm sản phẩm theo search suggestions
        
        [HttpGet("Search")]
        public IActionResult SeacrhProduct(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return BadRequest("keyword is required");
            var result = _context.Products.Where(p => p.Name.Contains(keyword)).Select(p => new
            {
                p.Id,
                p.Name,
                p.ImagePath,
                p.Price
            })
                .Take(10)
                .ToList();
            return Ok(result);
        }
        //API lấy hết sản phẩm
        
        [HttpPost("GetAll")]
        public IActionResult AllProduct()
        {
            var product = _context.Products.ToList();
            return Ok(product);
        }
        //API lấy sản phẩm theo loại
        
        [HttpGet("gettype/{type}")]
        public async Task<IActionResult> Gettypeproduct(string type)
        {
            var typeproduct = await _context.Products.Where(p => p.Type.ToLower() == type.ToLower()).ToListAsync();
            if(typeproduct == null || typeproduct.Count == 0)
            {
                return NotFound($"không tìm thấy loại danh mục sản phẩm này:{type}");
            }
            return Ok(typeproduct);
        }

        //API sắp xếp sản phẩm theo giá tăng dần
        
        [HttpGet("sapxeptangdan")]
        public async Task<IActionResult> GetProductsAscending()
        {
            var products = await _context.Products.OrderBy(p => p.Price).ToListAsync();
            return Ok(products);
        }

        //API sắp xp sản phẩm theo giá giảm dần
        
        [HttpGet("sapxepgiamdan")]
        public async Task<IActionResult> GetProductsDescending()
        {
            var products = await _context.Products.OrderByDescending(p => p.Price).ToListAsync();
            return Ok(products);
        }
        //API sắp xếp sản phẩm mới nhất
        
        [HttpGet("moinhat")]
        public async Task<IActionResult> GetNewestProducts()
        {
            var products = await _context.Products.OrderByDescending(p => p.CreatedDate).ToListAsync();
            return Ok(products);
        }
        //API sắp xếp sản phẩm theo khoảng giá
        
        [HttpGet("sapxeptheogia")]
        public async Task<IActionResult> GetProductflowPrice(decimal minprice, decimal maxprice)
        {
            if (minprice > maxprice)
            {
                return BadRequest("minprice không được cao hơn maxpricr");
            }
            var products = await _context.Products.Where(p => p.Price >= minprice && p.Price <= maxprice).OrderByDescending(p => p.Price).ToListAsync();
            return Ok(products);
        }
        //API cho danh mục sản phẩm được yêu thích nhất lấy 6 sản phẩm
        
        [HttpGet("Type/{type}")]
        public async Task<IActionResult> GetProductType(string type) {
            var product = await _context.Products.Where(p => p.Type.ToLower() == type.ToLower()).OrderByDescending(p => p.CreatedDate).Take(6).ToListAsync();
            if(product == null || product.Count == 0)
            {
                return NotFound($"Không tìm thấy sản phẩm nào thuộc cùng loại: {type}");
            }
            return Ok(product);
        }
        //API cho Hàng Hot trend lấy 5 sản phẩm
        
        [HttpGet("Hottrend/{Type}")]
        public async Task<IActionResult> GetProductHottrend(string Type)
        {
            var products = await _context.Products.Where(p => p.Type.ToLower() == Type.ToLower()).OrderByDescending(p => p.CreatedDate).Take(5).ToListAsync();
            if(products == null || products.Count == 0)
            {
                return NotFound($"Không tìm thấy sản phẩm nào thuộc cùng loại: {Type}");
            }
            return Ok(products);
        }
        //cảm ơn bạn đã xem tới đây vì api này dài vl
    }
}
