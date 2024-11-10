using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace devbuddy.Models
{
    public class UserData
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "User";
    }

    public class LoginData
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
