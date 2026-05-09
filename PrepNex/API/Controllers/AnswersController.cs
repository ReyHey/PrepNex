using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrepNex.Data;
using PrepNex.DTOs;
using PrepNex.Models;
using PrepNex.Services;

namespace PrepNex.Controllers
{
	/// <summary>
	/// API controller for submitting answers and getting AI feedback.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	public class AnswersController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly IAIFeedbackService _aiService;
		private readonly ILogger<AnswersController> _logger;

		public AnswersController(AppDbContext context, IAIFeedbackService aiService, ILogger<AnswersController> logger)
		{
			_context = context;
			_aiService = aiService;
			_logger = logger;
		}

		/// <summary>
		/// Submit an answer for a question.
		/// </summary>
		/// <param name="request">Answer submission request</param>
		/// <returns>Confirmation with answer count for the session</returns>
		[HttpPost("submit")]
		[ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<ActionResult> SubmitAnswer([FromBody] SubmitAnswerRequest request)
		{
			try
			{
				// Validate question exists
				var question = await _context.Questions.FindAsync(request.QuestionId);
				if (question == null)
				{
					return NotFound(new { message = $"Question with ID {request.QuestionId} not found" });
				}

				// Generate session ID if not provided
				var sessionId = request.SessionId ?? Guid.NewGuid().ToString();

				// Save answer
				var userAnswer = new UserAnswer
				{
					QuestionId = request.QuestionId,
					Answer = request.Answer,
					SubmittedAt = DateTime.UtcNow,
					SessionId = sessionId
				};

				_context.UserAnswers.Add(userAnswer);
				await _context.SaveChangesAsync();

				// Count answers in this session
				var answerCount = await _context.UserAnswers
					.Where(a => a.SessionId == sessionId)
					.CountAsync();

				_logger.LogInformation("Answer submitted for question {QuestionId} in session {SessionId}. Total: {Count}", 
					request.QuestionId, sessionId, answerCount);

				return Ok(new
				{
					message = "Answer submitted successfully",
					sessionId,
					answerId = userAnswer.Id,
					totalAnswers = answerCount,
					canRequestFeedback = answerCount >= 5
				});
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error submitting answer");
				return StatusCode(500, new { message = "An error occurred while submitting the answer" });
			}
		}

		/// <summary>
		/// Get count of answers for a session.
		/// </summary>
		/// <param name="sessionId">Session ID</param>
		/// <returns>Answer count and question IDs</returns>
		[HttpGet("session/{sessionId}/count")]
		[ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
		public async Task<ActionResult> GetAnswerCount(string sessionId)
		{
			try
			{
				var answers = await _context.UserAnswers
					.Where(a => a.SessionId == sessionId)
					.Select(a => new { a.Id, a.QuestionId })
					.ToListAsync();

				return Ok(new
				{
					sessionId,
					totalAnswers = answers.Count,
					questionIds = answers.Select(a => a.QuestionId).ToList(),
					canRequestFeedback = answers.Count >= 5
				});
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting answer count for session {SessionId}", sessionId);
				return StatusCode(500, new { message = "An error occurred while retrieving answer count" });
			}
		}

		/// <summary>
		/// Get AI-powered feedback on submitted answers.
		/// Requires at least 5 answers in the session.
		/// </summary>
		/// <param name="request">Feedback request with session ID</param>
		/// <returns>AI feedback for all answers in the session</returns>
		[HttpPost("feedback")]
		[ProducesResponseType(typeof(AIFeedbackResponse), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<ActionResult<AIFeedbackResponse>> GetFeedback([FromBody] GetAIFeedbackRequest request)
		{
			try
			{
				// Get all answers for this session
				var answers = await _context.UserAnswers
					.Include(a => a.Question)
					.Where(a => a.SessionId == request.SessionId)
					.OrderBy(a => a.SubmittedAt)
					.ToListAsync();

				if (answers.Count == 0)
				{
					return NotFound(new { message = "No answers found for this session" });
				}

				if (answers.Count < 5)
				{
					return BadRequest(new
					{
						message = $"You need to answer at least 5 questions to receive feedback. Current: {answers.Count}/5",
						currentCount = answers.Count,
						required = 5
					});
				}

				_logger.LogInformation("Generating AI feedback for session {SessionId} with {Count} answers", 
					request.SessionId, answers.Count);

				// Prepare data for AI service
				var answerData = answers.Select(a => (
					QuestionTitle: a.Question?.Title ?? "Unknown Question",
					QuestionDescription: a.Question?.Description ?? "",
					UserAnswer: a.Answer,
					SuggestedAnswer: a.Question?.SuggestedAnswer
				)).ToList();

				// Get AI feedback
				var feedback = await _aiService.GetFeedbackAsync(answerData, request.SessionId);

				return Ok(feedback);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error generating feedback for session {SessionId}", request.SessionId);
				return StatusCode(500, new { message = "An error occurred while generating feedback" });
			}
		}

		/// <summary>
		/// Get all answers for a session.
		/// </summary>
		/// <param name="sessionId">Session ID</param>
		/// <returns>List of answers with question details</returns>
		[HttpGet("session/{sessionId}")]
		[ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
		public async Task<ActionResult> GetSessionAnswers(string sessionId)
		{
			try
			{
				var answers = await _context.UserAnswers
					.Include(a => a.Question)
					.Where(a => a.SessionId == sessionId)
					.OrderBy(a => a.SubmittedAt)
					.Select(a => new
					{
						a.Id,
						a.QuestionId,
						questionTitle = a.Question!.Title,
						a.Answer,
						a.SubmittedAt
					})
					.ToListAsync();

				return Ok(new
				{
					sessionId,
					totalAnswers = answers.Count,
					answers
				});
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving answers for session {SessionId}", sessionId);
				return StatusCode(500, new { message = "An error occurred while retrieving answers" });
			}
		}
	}
}
