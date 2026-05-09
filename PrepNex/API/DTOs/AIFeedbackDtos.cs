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

	/// <summary>
	/// Request to review code/explanation for a question.
	/// </summary>
	public class ReviewRequest
	{
		public string? Code { get; set; }
		public string? Explanation { get; set; }
	}

	/// <summary>
	/// Response from AI review.
	/// </summary>
	public class ReviewResponse
	{
		public int Score { get; set; }
		public required string Feedback { get; set; }
	}

	/// <summary>
	/// Request to submit multiple choice answer.
	/// </summary>
	public class SubmitMultipleChoiceRequest
	{
		public int SelectedOptionId { get; set; }
	}

	/// <summary>
	/// Response for multiple choice submission.
	/// </summary>
	public class SubmitMultipleChoiceResponse
	{
		public bool Correct { get; set; }
	}
}
