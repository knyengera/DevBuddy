namespace devbuddy.Models
{
    public class Quest
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public int Xp { get; set; }
        public string Status { get; set; }
        public double Progress { get; set; }
    }
}