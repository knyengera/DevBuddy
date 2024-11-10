using Microsoft.EntityFrameworkCore;
using System;
using devbuddy.Models;

namespace devbuddy.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<UserData> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var endpoint = Environment.GetEnvironmentVariable("COSMOSDB_ENDPOINT");
            var key = Environment.GetEnvironmentVariable("COSMOSDB_KEY");
            var databaseName = Environment.GetEnvironmentVariable("COSMOSDB_DATABASE_NAME");

            if (string.IsNullOrEmpty(endpoint) || string.IsNullOrEmpty(key) || string.IsNullOrEmpty(databaseName))
            {
                throw new InvalidOperationException("Cosmos DB connection details are not set.");
            }

            optionsBuilder.UseCosmos(endpoint, key, databaseName);
        }
    }

} 