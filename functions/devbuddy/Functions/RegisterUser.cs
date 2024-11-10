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

namespace devbuddy.Functions
{
    public class RegisterUser
    {
        private readonly ILogger<RegisterUser> _logger;
        private readonly AppDbContext _context;

        public RegisterUser(ILogger<RegisterUser> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Function("RegisterUser")]
        public async Task<IActionResult> RegisterUsers(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route =("register"))] HttpRequest req)
        {
            _logger.LogInformation("Processing a user registration request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var userData = JsonSerializer.Deserialize<UserData>(requestBody);

            if (userData == null || string.IsNullOrEmpty(userData.Username) || string.IsNullOrEmpty(userData.Email))
            {
                return new BadRequestObjectResult("Invalid user data.");
            }

            // Check if user already exists
            var existingUser = _context.Users
                .FirstOrDefault(u => u.Username == userData.Username || u.Email == userData.Email);

            if (existingUser != null)
            {
                return new ConflictObjectResult("User with the same username or email already exists.");
            }

            // Validate email format
            if (!IsValidEmail(userData.Email))
            {
                return new BadRequestObjectResult("Invalid email format.");
            }

            // Validate password strength
            if (!IsValidPassword(userData.Password))
            {
                return new BadRequestObjectResult("Password does not meet strength requirements.");
            }

            // Hash the password before saving
            userData.Password = BCrypt.Net.BCrypt.HashPassword(userData.Password);

            // Save user data to Cosmos DB
            _context.Users.Add(userData);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"User registered: {userData.Username}, {userData.Email}");
            return new OkObjectResult("User registered successfully.");
        }

        private bool IsValidEmail(string email)
        {
            // Simple email validation logic
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPassword(string password)
        {
            // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
            return password.Length >= 8 &&
                   password.Any(char.IsUpper) &&
                   password.Any(char.IsLower) &&
                   password.Any(char.IsDigit) &&
                   password.Any(ch => !char.IsLetterOrDigit(ch)); 
        }
    }
} 