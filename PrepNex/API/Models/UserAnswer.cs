namespace PrepNex.Models
{
	/// <summary>
	/// Represents a user's answer to an interview question.
	/// </summary>
	public class UserAnswer
	{
		public int Id { get; set; }

		public int QuestionId { get; set; }

		public required string Answer { get; set; }

		public DateTime SubmittedAt { get; set; }

		public string? SessionId { get; set; }

		// Navigation property
		public InterviewQuestion? Question { get; set; }
	}
}
