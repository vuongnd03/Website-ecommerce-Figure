using APIbackend.Data;
using Microsoft.EntityFrameworkCore;

namespace APIbackend.Models
{
    public class ChatAiContext : DbContext
    {
        public ChatAiContext(DbContextOptions<ChatAiContext> options)
            : base(options)
        {
        }
        public DbSet<ChatAi> ChatAis { get; set; } = null!;

    }
}
