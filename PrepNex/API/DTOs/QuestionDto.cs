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
		public string? Type { get; set; }
		public string? Topic { get; set; }
		public string? Language { get; set; }
		public string? StarterCode { get; set; }
		public string? SuggestedAnswer { get; set; }
		public List<MultipleChoiceOptionDto>? Options { get; set; }
		public int? CorrectOptionId { get; set; }
		public List<string>? Hints { get; set; }
		public List<QuestionExampleDto>? Examples { get; set; }
		public List<string>? Constraints { get; set; }
	}

	public class MultipleChoiceOptionDto
	{
		public int Id { get; set; }
		public required string Text { get; set; }
	}

	public class QuestionExampleDto
	{
		public required string Input { get; set; }
		public required string Output { get; set; }
		public string? Explanation { get; set; }
	}
}
