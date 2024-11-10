using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

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
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            // Extract token from Authorization header
            string token = req.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return new UnauthorizedObjectResult(new { success = false, message = "Token is missing." });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("your_secret_key_here");

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                }, out SecurityToken validatedToken);

                // Token is valid
                return new OkObjectResult("Token is valid. Welcome to Azure Functions!");
            }
            catch
            {
                // Token is invalid
                return new UnauthorizedObjectResult(new { success = false, message = "Invalid token." });
            }
        }
    }
}
