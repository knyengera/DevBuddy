using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using devbuddy.Data;
using Microsoft.EntityFrameworkCore;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        // Add Application Insights telemetry
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        // Configure AppDbContext with Cosmos DB provider
        services.AddDbContext<AppDbContext>(options =>
        {
            var endpoint = Environment.GetEnvironmentVariable("COSMOSDB_ENDPOINT");
            var key = Environment.GetEnvironmentVariable("COSMOSDB_KEY");
            var databaseName = Environment.GetEnvironmentVariable("COSMOSDB_DATABASE_NAME");

            if (string.IsNullOrEmpty(endpoint) || string.IsNullOrEmpty(key) || string.IsNullOrEmpty(databaseName))
            {
                throw new InvalidOperationException("Cosmos DB connection details are not set.");
            }

            options.UseCosmos(endpoint, key, databaseName);
        });
    })
    .Build();

host.Run();
