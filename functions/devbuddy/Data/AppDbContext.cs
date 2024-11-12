using Microsoft.EntityFrameworkCore;
using devbuddy.Models;

namespace devbuddy.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
         : base(options)
        {
        }

        public DbSet<UserData> Users { get; set; }
        public DbSet<Quest> Quests { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserData>()
                .ToContainer("Users")
                .HasPartitionKey(u => u.Id);

            modelBuilder.Entity<Quest>()
                .ToContainer("Quests")
                .HasPartitionKey(q => q.Id);


        }
    }
}
