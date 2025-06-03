namespace APIbackend.Models
{
    using APIbackend.Data;
    using APIbackend.Models;
    using Microsoft.EntityFrameworkCore;

    public class AppDbContext : DbContext
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Paymentdetail> PaymentDetails { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<Update_history> Update_historys { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure composite primary key for Paymentdetail
            modelBuilder.Entity<Paymentdetail>()
                .HasKey(pd => new { pd.PaymentId, pd.ProductId });

            // Configure relationships
            modelBuilder.Entity<Paymentdetail>()
                .HasOne(pd => pd.Payment)
                .WithMany(p => p.PaymentDetails)
                .HasForeignKey(pd => pd.PaymentId);

            base.OnModelCreating(modelBuilder);
        }
    }
}