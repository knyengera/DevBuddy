using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using devbuddy.Data;

[assembly: FunctionsStartup(typeof(devbuddy.Startup))]

namespace devbuddy
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddDbContext<AppDbContext>();
        }
    }
} 