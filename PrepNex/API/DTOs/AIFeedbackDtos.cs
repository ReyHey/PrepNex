namespace PrepNex.DTOs
{
	/// <summary>
	/// Request to submit an answer for a question.
	/// </summary>
	public class SubmitAnswerRequest
	{
		public int QuestionId { get; set; }
		public required string Answer { get; set; }
		public string? SessionId { get; set; }
	}

	/// <summary>
	/// Request to get AI feedback on answers.
	/// </summary>
	public class GetAIFeedbackRequest
	{
		public required string SessionId { get; set; }
	}

	/// <summary>
	/// AI feedback response.
	/// </summary>
	public class AIFeedbackResponse
	{
		public required string SessionId { get; set; }
		public int TotalAnswers { get; set; }
		public required string OverallFeedback { get; set; }
		public List<QuestionFeedback> QuestionFeedbacks { get; set; } = new();
	}

	/// <summary>
	/// Feedback for a specific question.
	/// </summary>
	public class QuestionFeedback
	{
		public int QuestionId { get; set; }
		public required string QuestionTitle { get; set; }
		public required string UserAnswer { get; set; }
		public required string Feedback { get; set; }
		public int? Score { get; set; } // Out of 10
		public List<string> Strengths { get; set; } = new();
		public List<string> Improvements { get; set; } = new();
	}
}
