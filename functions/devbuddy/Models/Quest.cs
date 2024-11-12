namespace devbuddy.Models
{
    public class Quest
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int Xp { get; set; } = 0;
        public string Status { get; set; } = string.Empty;
        public double Progress { get; set; } = 0;
    }
}