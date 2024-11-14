using System.IO;
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

public static class AnalyzeChatbotConversation
{
    private static readonly HttpClient httpClient = new HttpClient();
    private static readonly string predictionUrl = Environment.GetEnvironmentVariable("PredictionUrl");
    private static readonly string subscriptionKey = Environment.GetEnvironmentVariable("SubscriptionKey");

    [FunctionName("AnalyzeChatbotConversation")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");

        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);

        var conversationItem = new
        {
            id = data?.id ?? "default_id",
            text = data?.text ?? "default_text",
            modality = "text",
            language = data?.language ?? "en",
            participantId = data?.participantId ?? "default_participant"
        };

        var analysisInput = new
        {
            kind = "Conversation",
            analysisInput = new { conversationItem },
            parameters = new
            {
                projectName = "calmstackbot",
                verbose = true,
                deploymentName = "calmstack-datsets",
                stringIndexType = "TextElement_V8"
            }
        };

        var jsonContent = JsonConvert.SerializeObject(analysisInput);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

        var response = await httpClient.PostAsync(predictionUrl, content);
        var responseString = await response.Content.ReadAsStringAsync();

        return new OkObjectResult(responseString);
    }
}