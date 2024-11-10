using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using devbuddy.Data;
using BCrypt.Net;
using System.Linq;
using devbuddy.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;

namespace devbuddy.Functions
{
    public class LoginUser
    {
        private readonly ILogger<LoginUser> _logger;
        private readonly AppDbContext _context;

        public LoginUser(ILogger<LoginUser> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Function("LoginUser")]
        public async Task<IActionResult> LoginUsers(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route =("login"))] HttpRequest req)
        {
            _logger.LogInformation("Processing a user login request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var loginData = JsonSerializer.Deserialize<LoginData>(requestBody);

            if (loginData == null || string.IsNullOrEmpty(loginData.Username) || string.IsNullOrEmpty(loginData.Password))
            {
                return new BadRequestObjectResult(new { success = false, message = "Invalid login data." });
            }

            // Find user by username
            var user = _context.Users.FirstOrDefault(u => u.Username == loginData.Username);

            if (user == null)
            {
                return new UnauthorizedObjectResult(new { success = false, message = "Invalid username or password." });
            }

            // Validate password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginData.Password, user.Password);

            if (!isPasswordValid)
            {
                return new UnauthorizedObjectResult(new { success = false, message = "Invalid username or password." });
            }

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            
            // Retrieve the secret key from environment variables
            var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "";
            var ValidIssuer = Environment.GetEnvironmentVariable("JWT_VALID_ISSUER") ?? "";
            var ValidAudience = Environment.GetEnvironmentVariable("JWT_VALID_AUDIENCE") ?? "";
            
            // TODO: Use Azure Key Vault to manage secret keys securely
            var key = System.Text.Encoding.ASCII.GetBytes(secretKey);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = ValidIssuer,
                Audience = ValidAudience
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            _logger.LogInformation($"User logged in: {user.Username}");
            return new OkObjectResult(new { success = true, message = "Login successful.", token = tokenString });
        }
    }

} 