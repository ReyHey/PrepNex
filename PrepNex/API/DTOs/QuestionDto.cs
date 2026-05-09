namespace PrepNex.DTOs
{
	/// <summary>
	/// Data Transfer Object for InterviewQuestion responses.
	/// Matches the frontend ApiQuestion interface.
	/// </summary>
	public class QuestionDto
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
