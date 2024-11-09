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

            _logger.LogInformation($"User logged in: {user.Username}");
            return new OkObjectResult(new { success = true, message = "Login successful." });
        }
    }

} 