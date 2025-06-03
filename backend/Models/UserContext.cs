using APIbackend.Data;
using Microsoft.EntityFrameworkCore;
namespace APIbackend.Models
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options)
        {
        }
        public DbSet<User>Users { get; set; } = null!;
    }
}
