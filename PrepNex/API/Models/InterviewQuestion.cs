namespace PrepNex.Models
{
	/// <summary>
	/// Represents an interview question with all its metadata.
	/// </summary>
	public class InterviewQuestion
	{
		public int Id { get; set; }

		public required string Title { get; set; }

		public required string Description { get; set; }

		public required string Difficulty { get; set; }

		public required string Category { get; set; }

		public required string Type { get; set; }

		public string? StarterCode { get; set; }

		public string? SuggestedAnswer { get; set; }
	}
}
