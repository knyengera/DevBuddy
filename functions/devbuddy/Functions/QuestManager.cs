using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using devbuddy.Data;
using devbuddy.Models;

namespace devbuddy.Functions
{
    public class QuestManager
    {
        private readonly ILogger<QuestManager> _logger;
        private readonly AppDbContext _context;

        public QuestManager(ILogger<QuestManager> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Function("CreateQuest")]
        public async Task<IActionResult> CreateQuest(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "quests")] HttpRequest req)
        {
            _logger.LogInformation("Processing a quest creation request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var quest = JsonSerializer.Deserialize<Quest>(requestBody);

            if (quest == null || string.IsNullOrEmpty(quest.Title))
            {
                return new BadRequestObjectResult("Invalid quest data.");
            }

            _context.Quests.Add(quest);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Quest created: {quest.Title}");
            return new OkObjectResult(quest);
        }

        [Function("GetQuests")]
        public IActionResult GetQuests(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "quests")] HttpRequest req)
        {
            _logger.LogInformation("Fetching all quests.");
            var quests = _context.Quests.ToList();
            return new OkObjectResult(quests);
        }

        [Function("GetQuestById")]
        public IActionResult GetQuestById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "quests/{id}")] HttpRequest req, string id)
        {
            _logger.LogInformation($"Fetching quest with ID: {id}");
            var quest = _context.Quests.FirstOrDefault(q => q.Id == id);

            if (quest == null)
            {
                return new NotFoundObjectResult("Quest not found.");
            }

            return new OkObjectResult(quest);
        }

        [Function("UpdateQuest")]
        public async Task<IActionResult> UpdateQuest(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "quests/{id}")] HttpRequest req, string id)
        {
            _logger.LogInformation($"Updating quest with ID: {id}");

            var existingQuest = _context.Quests.FirstOrDefault(q => q.Id == id);
            if (existingQuest == null)
            {
                return new NotFoundObjectResult("Quest not found.");
            }

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var updatedQuest = JsonSerializer.Deserialize<Quest>(requestBody);

            if (updatedQuest == null || string.IsNullOrEmpty(updatedQuest.Title))
            {
                return new BadRequestObjectResult("Invalid quest data.");
            }

            existingQuest.Title = updatedQuest.Title;
            existingQuest.Category = updatedQuest.Category;
            existingQuest.Xp = updatedQuest.Xp;
            existingQuest.Status = updatedQuest.Status;
            existingQuest.Progress = updatedQuest.Progress;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Quest updated: {existingQuest.Title}");
            return new OkObjectResult(existingQuest);
        }

        [Function("DeleteQuest")]
        public async Task<IActionResult> DeleteQuest(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "quests/{id}")] HttpRequest req, string id)
        {
            _logger.LogInformation($"Deleting quest with ID: {id}");

            var quest = _context.Quests.FirstOrDefault(q => q.Id == id);
            if (quest == null)
            {
                return new NotFoundObjectResult("Quest not found.");
            }

            _context.Quests.Remove(quest);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Quest deleted: {quest.Title}");
            return new OkObjectResult("Quest deleted successfully.");
        }
    }
} 