using Azure.AI.OpenAI;
using OpenAI.Chat;
using PrepNex.DTOs;
using System.Text.Json;

namespace PrepNex.Services
{
	/// <summary>
	/// Service for AI-powered feedback on interview answers using Azure OpenAI.
	/// </summary>
	public interface IAIFeedbackService
	{
		Task<AIFeedbackResponse> GetFeedbackAsync(List<(string QuestionTitle, string QuestionDescription, string UserAnswer, string? SuggestedAnswer)> answers, string sessionId);
	}

	public class AIFeedbackService : IAIFeedbackService
	{
		private readonly AzureOpenAIClient? _client;
		private readonly string? _deploymentName;
		private readonly ILogger<AIFeedbackService> _logger;
		private readonly bool _isConfigured;

		public AIFeedbackService(IConfiguration configuration, ILogger<AIFeedbackService> logger)
		{
			_logger = logger;

			var apiKey = configuration["OpenAI:ApiKey"];
			var endpoint = configuration["OpenAI:Endpoint"];
			_deploymentName = configuration["OpenAI:DeploymentName"];

			if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(_deploymentName))
			{
				_logger.LogWarning("OpenAI configuration is missing. AI feedback will return mock responses.");
				_isConfigured = false;
				return;
			}

			try
			{
				_client = new AzureOpenAIClient(new Uri(endpoint), new System.ClientModel.ApiKeyCredential(apiKey));
				_isConfigured = true;
				_logger.LogInformation("OpenAI client initialized successfully");
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Failed to initialize OpenAI client");
				_isConfigured = false;
			}
		}

		public async Task<AIFeedbackResponse> GetFeedbackAsync(
			List<(string QuestionTitle, string QuestionDescription, string UserAnswer, string? SuggestedAnswer)> answers,
			string sessionId)
		{
			if (!_isConfigured || _client == null)
			{
				return GenerateMockFeedback(answers, sessionId);
			}

			try
			{
				var chatClient = _client.GetChatClient(_deploymentName!);

				// Build the prompt
				var prompt = BuildPrompt(answers);

				var messages = new List<ChatMessage>
				{
					new SystemChatMessage(@"You are an expert technical interviewer reviewing a candidate's interview answers. 
Provide constructive, detailed feedback on their responses. Be encouraging but honest. 
For each answer, identify strengths and areas for improvement. 
Rate each answer out of 10 and provide an overall assessment."),
					new UserChatMessage(prompt)
				};

				var options = new ChatCompletionOptions
				{
					Temperature = 0.7f,
					MaxOutputTokenCount = 2000
				};

				var completion = await chatClient.CompleteChatAsync(messages, options);
				var feedbackText = completion.Value.Content[0].Text;

				return ParseAIFeedback(feedbackText, answers, sessionId);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting AI feedback");
				return GenerateMockFeedback(answers, sessionId);
			}
		}

		private string BuildPrompt(List<(string QuestionTitle, string QuestionDescription, string UserAnswer, string? SuggestedAnswer)> answers)
		{
			var prompt = $"Please review the following {answers.Count} interview answers:\n\n";

			for (int i = 0; i < answers.Count; i++)
			{
				var answer = answers[i];
				prompt += $"**Question {i + 1}: {answer.QuestionTitle}**\n";
				prompt += $"Description: {answer.QuestionDescription}\n";
				prompt += $"Candidate's Answer:\n{answer.UserAnswer}\n";
				if (!string.IsNullOrWhiteSpace(answer.SuggestedAnswer))
				{
					prompt += $"Reference Answer:\n{answer.SuggestedAnswer}\n";
				}
				prompt += "\n---\n\n";
			}

			prompt += @"Please provide:
1. An overall assessment of the candidate's performance
2. For each question:
   - A score out of 10
   - Key strengths in their answer
   - Specific areas for improvement
   - Constructive feedback

Format your response as follows:
OVERALL: [Overall assessment here]

QUESTION 1:
SCORE: [X/10]
STRENGTHS: [Bullet points]
IMPROVEMENTS: [Bullet points]
FEEDBACK: [Detailed feedback]

[Repeat for each question]";

			return prompt;
		}

		private AIFeedbackResponse ParseAIFeedback(string feedbackText, List<(string QuestionTitle, string QuestionDescription, string UserAnswer, string? SuggestedAnswer)> answers, string sessionId)
		{
			// Simple parsing - in production, you might use structured output or JSON mode
			var response = new AIFeedbackResponse
			{
				SessionId = sessionId,
				TotalAnswers = answers.Count,
				OverallFeedback = "AI feedback generated successfully.",
				QuestionFeedbacks = new List<QuestionFeedback>()
			};

			// Extract overall feedback
			var overallMatch = System.Text.RegularExpressions.Regex.Match(feedbackText, @"OVERALL:\s*(.+?)(?=QUESTION|$)", System.Text.RegularExpressions.RegexOptions.Singleline);
			if (overallMatch.Success)
			{
				response.OverallFeedback = overallMatch.Groups[1].Value.Trim();
			}

			// Parse individual question feedback
			for (int i = 0; i < answers.Count; i++)
			{
				var questionPattern = $@"QUESTION {i + 1}:(.+?)(?=QUESTION {i + 2}:|$)";
				var questionMatch = System.Text.RegularExpressions.Regex.Match(feedbackText, questionPattern, System.Text.RegularExpressions.RegexOptions.Singleline);

				if (questionMatch.Success)
				{
					var questionSection = questionMatch.Groups[1].Value;

					var scoreMatch = System.Text.RegularExpressions.Regex.Match(questionSection, @"SCORE:\s*(\d+)");
					var strengthsMatch = System.Text.RegularExpressions.Regex.Match(questionSection, @"STRENGTHS:\s*(.+?)(?=IMPROVEMENTS:|$)", System.Text.RegularExpressions.RegexOptions.Singleline);
					var improvementsMatch = System.Text.RegularExpressions.Regex.Match(questionSection, @"IMPROVEMENTS:\s*(.+?)(?=FEEDBACK:|$)", System.Text.RegularExpressions.RegexOptions.Singleline);
					var feedbackMatch = System.Text.RegularExpressions.Regex.Match(questionSection, @"FEEDBACK:\s*(.+?)$", System.Text.RegularExpressions.RegexOptions.Singleline);

					var questionFeedback = new QuestionFeedback
					{
						QuestionId = i + 1,
						QuestionTitle = answers[i].QuestionTitle,
						UserAnswer = answers[i].UserAnswer,
						Feedback = feedbackMatch.Success ? feedbackMatch.Groups[1].Value.Trim() : "No detailed feedback available.",
						Score = scoreMatch.Success ? int.Parse(scoreMatch.Groups[1].Value) : null,
						Strengths = ParseBulletPoints(strengthsMatch.Success ? strengthsMatch.Groups[1].Value : ""),
						Improvements = ParseBulletPoints(improvementsMatch.Success ? improvementsMatch.Groups[1].Value : "")
					};

					response.QuestionFeedbacks.Add(questionFeedback);
				}
			}

			return response;
		}

		private List<string> ParseBulletPoints(string text)
		{
			var points = new List<string>();
			var lines = text.Split('\n', StringSplitOptions.RemoveEmptyEntries);
			foreach (var line in lines)
			{
				var cleaned = line.Trim().TrimStart('-', '*', '•').Trim();
				if (!string.IsNullOrWhiteSpace(cleaned))
				{
					points.Add(cleaned);
				}
			}
			return points;
		}

		private AIFeedbackResponse GenerateMockFeedback(List<(string QuestionTitle, string QuestionDescription, string UserAnswer, string? SuggestedAnswer)> answers, string sessionId)
		{
			_logger.LogInformation("Generating mock AI feedback for {Count} answers", answers.Count);

			var response = new AIFeedbackResponse
			{
				SessionId = sessionId,
				TotalAnswers = answers.Count,
				OverallFeedback = $"Great job completing {answers.Count} questions! You demonstrated solid understanding of the concepts. Continue to practice explaining your thought process clearly and consider edge cases in your solutions.",
				QuestionFeedbacks = new List<QuestionFeedback>()
			};

			for (int i = 0; i < answers.Count; i++)
			{
				var answer = answers[i];
				var hasContent = !string.IsNullOrWhiteSpace(answer.UserAnswer) && answer.UserAnswer.Length > 50;
				var score = hasContent ? new Random().Next(6, 10) : new Random().Next(3, 7);

				var feedback = new QuestionFeedback
				{
					QuestionId = i + 1,
					QuestionTitle = answer.QuestionTitle,
					UserAnswer = answer.UserAnswer,
					Score = score,
					Feedback = hasContent
						? $"Your answer shows good understanding of {answer.QuestionTitle}. You covered the main concepts well."
						: "Your answer could be more detailed. Try to elaborate on your reasoning and provide specific examples.",
					Strengths = hasContent
						? new List<string>
						{
							"Clear explanation of key concepts",
							"Good structure and organization",
							answer.UserAnswer.Length > 200 ? "Thorough and detailed response" : "Concise and to the point"
						}
						: new List<string> { "Attempted the question" },
					Improvements = new List<string>
					{
						hasContent ? "Consider adding more real-world examples" : "Provide more detailed explanations",
						"Discuss potential edge cases or limitations",
						"Connect concepts to practical applications"
					}
				};

				response.QuestionFeedbacks.Add(feedback);
			}

			return response;
		}
	}
}
