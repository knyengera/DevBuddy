using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System;

namespace devbuddy.Functions
{
    public class Auth
    {
        private readonly ILogger<Auth> _logger;

        public Auth(ILogger<Auth> logger)
        {
            _logger = logger;
        }

        [Function("Auth")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "verify")] HttpRequest req)
        {
            _logger.LogInformation("Verify token function processed a request.");

            // Extract token from Authorization header
            string token = req.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return new UnauthorizedObjectResult(new { success = false, message = "Token is missing." });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            
            // Retrieve the secret key from environment variables
            var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "";
            var ValidIssuer = Environment.GetEnvironmentVariable("JWT_VALID_ISSUER") ?? "";
            var ValidAudience = Environment.GetEnvironmentVariable("JWT_VALID_AUDIENCE") ?? "";
            
            // TODO: Use Azure Key Vault to manage secret keys securely
            var key = System.Text.Encoding.ASCII.GetBytes(secretKey);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = ValidIssuer,
                    ValidateAudience = true,
                    ValidAudience = ValidAudience,
                }, out SecurityToken validatedToken);

                // Token is valid
                return new OkObjectResult(new { success = true, message = "Token verifed." });
            }
            catch
            {
                // Token is invalid
                return new UnauthorizedObjectResult(new { success = false, message = "Invalid token." });
            }
        }

        [Function("Ping")]
        public IActionResult Ping([HttpTrigger(AuthorizationLevel.Function, "get", Route = "ping")] HttpRequest req)
        {
            _logger.LogInformation("Ping endpoint was called.");
            return new OkObjectResult(new { status = "Service is running", timestamp = DateTime.UtcNow });
        }
    }
}
