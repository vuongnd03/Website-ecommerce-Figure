using APIbackend.Data;
using APIbackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace APIbackend.Controllers {

    [ApiController]
    [Route("api/[controller]")]

    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserContext dbcontext;
        private readonly AdminContext dbadmincontext;
        public AuthController(UserContext dbcontext, AdminContext dbadmincontext, IConfiguration configuration)
        {
            this.dbcontext = dbcontext;
            this.dbadmincontext = dbadmincontext;
            _configuration = configuration;
        }
        private string GenerateJwtToken(string username)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username)
             // Thêm các claim khác nếu cần
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        //đăng ký người dùng
        [HttpPost("Register")]
        public IActionResult AddUser(AddUsers adduser)
        {
            var hasher = new PasswordHasher<User>();

            var UserEntity = new User()
            {
                fullname = adduser.fullname,
                phonenumber = adduser.phonenumber,
                email = adduser.email,
                password = ""
            };
            UserEntity.password = hasher.HashPassword(UserEntity, adduser.password);
            dbcontext.Users.Add(UserEntity);
            dbcontext.SaveChanges();
            return Ok(UserEntity);
        }
        //đăng nhập
        [HttpPost("Login")]
        public IActionResult Login(LoginUser loginUser)
        {
            var user = dbcontext.Users.FirstOrDefault(u => u.phonenumber == loginUser.phonenumber);
            if(user == null)
            {
                return NotFound("tài khoản khôgn tồn tại");
            }
            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.password, loginUser.password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Mật khẩu không đúng." });
            }

            var token = GenerateJwtToken(user.phonenumber);
            return Ok(new
            {
                user.id,
                user.fullname,
                token
            });
        }

        //đăng ký admin
        [HttpPost("RegisterADmin")]
        public IActionResult Addadmin(AddAdmin addmin)
        {
            var hasher = new PasswordHasher<Admin>();

            var AdminEntity = new Admin()
            {
                username = addmin.username,
                password = "",
                rights = addmin.rights,
                dchi = addmin.dchi,
                phonenumber = addmin.phonenumber
            };
            AdminEntity.password = hasher.HashPassword(AdminEntity, addmin.password);
            dbadmincontext.Admins.Add(AdminEntity);
            dbadmincontext.SaveChanges();
            return Ok(AdminEntity);
        }
        //chỉnh sửa thông tin nhân viên
        [Authorize]
        [HttpPut("UpdateEmployee/{id}")]
        public IActionResult UpdateEmployee(int id, AddAdmin request)
        {
            var employee = dbadmincontext.Admins.FirstOrDefault(e => e.id == id);
            if (employee == null) return NotFound("Employee not found");

            employee.username = request.username;
            employee.dchi = request.dchi;
            employee.phonenumber = request.phonenumber;
            employee.rights = request.rights;

            if (!string.IsNullOrEmpty(request.password))
            {
                var hasher = new PasswordHasher<Admin>();
                employee.password = hasher.HashPassword(employee, request.password);
            }

            dbadmincontext.SaveChanges();

            return Ok(employee);
        }

        //xóa nhân viên
        [Authorize]
        [HttpDelete("DeleteEmployee/{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = dbadmincontext.Admins.FirstOrDefault(e => e.id == id);
            if (employee == null) return NotFound("Employee not found");

            dbadmincontext.Admins.Remove(employee);
            dbadmincontext.SaveChanges();

            return Ok("Xóa thành công nhân viên");
        }

        //lấy thông tin của tất cả các nhân viên
        [Authorize]
        [HttpGet("GetAllEmployees")]
        public IActionResult GetAllEmployees()
        {
            var employees = dbadmincontext.Admins.ToList();
            return Ok(employees);
        }

        // đn admin
        [HttpPost("LoginAdmin")]
        public IActionResult LoginAdmin(LoginAdmin loginadmin)
        {
            var admin = dbadmincontext.Admins.FirstOrDefault(u => u.username == loginadmin.username);
            if (admin == null)
            {
                return NotFound("Không tìm thấy tài khoản!");
            }
            var hasher = new PasswordHasher<Admin>();
            var result = hasher.VerifyHashedPassword(admin, admin.password, loginadmin.password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Mật khẩu không đúng." });
            }
            var token = GenerateJwtToken(admin.username);
            return Ok(new { user = admin, token });
            
        }
    }
}
