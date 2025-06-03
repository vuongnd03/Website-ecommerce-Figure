using APIbackend.Data;
using Microsoft.EntityFrameworkCore;

namespace APIbackend.Models
{
    public class AdminContext : DbContext
    {
        public AdminContext(DbContextOptions<AdminContext> options) : base(options)
        {
        }
        public DbSet<Admin> Admins { get; set; } = null!;
    }
}
