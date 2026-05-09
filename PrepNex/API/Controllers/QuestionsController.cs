using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrepNex.Data;
using PrepNex.DTOs;
using PrepNex.Models;

namespace PrepNex.Controllers
{
	/// <summary>
	/// API controller for managing interview questions.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	public class QuestionsController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly ILogger<QuestionsController> _logger;

		public QuestionsController(AppDbContext context, ILogger<QuestionsController> logger)
		{
			_context = context;
			_logger = logger;
		}

		/// <summary>
		/// Get all interview questions with optional filtering.
		/// </summary>
		/// <param name="difficulty">Filter by difficulty (Easy, Medium, Hard)</param>
		/// <param name="category">Filter by category (C#, JavaScript, etc.)</param>
		/// <param name="type">Filter by type (technical, conceptual)</param>
		/// <param name="search">Search in question titles</param>
		/// <returns>List of questions matching the filters</returns>
		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<QuestionDto>), StatusCodes.Status200OK)]
		public async Task<ActionResult<IEnumerable<QuestionDto>>> GetQuestions(
			[FromQuery] string? difficulty = null,
			[FromQuery] string? category = null,
			[FromQuery] string? type = null,
			[FromQuery] string? search = null)
		{
			try
			{
				var query = _context.Questions.AsQueryable();

				// Apply filters
				if (!string.IsNullOrWhiteSpace(difficulty))
				{
					query = query.Where(q => q.Difficulty == difficulty);
				}

				if (!string.IsNullOrWhiteSpace(category))
				{
					query = query.Where(q => q.Category == category);
				}

				if (!string.IsNullOrWhiteSpace(type))
				{
					query = query.Where(q => q.Type == type);
				}

				if (!string.IsNullOrWhiteSpace(search))
				{
					query = query.Where(q => q.Title.Contains(search));
				}

				var questions = await query
					.OrderBy(q => q.Id)
					.ToListAsync();

				var questionDtos = questions.Select(q => new QuestionDto
				{
					Id = q.Id,
					Title = q.Title,
					Description = q.Description,
					Difficulty = q.Difficulty,
					Category = q.Category,
					Type = q.Type,
					Topic = q.Topic,
					Language = q.Language,
					StarterCode = q.StarterCode,
					SuggestedAnswer = q.SuggestedAnswer,
					Options = q.Options?.Select(o => new MultipleChoiceOptionDto { Id = o.Id, Text = o.Text }).ToList(),
					CorrectOptionId = q.CorrectOptionId,
					Hints = q.Hints,
					Examples = q.Examples?.Select(e => new QuestionExampleDto { Input = e.Input, Output = e.Output, Explanation = e.Explanation }).ToList(),
					Constraints = q.Constraints
				}).ToList();

				return Ok(questionDtos);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving questions");
				return StatusCode(500, new { message = "An error occurred while retrieving questions" });
			}
		}

		/// <summary>
		/// Get a specific interview question by ID.
		/// </summary>
		/// <param name="id">Question ID</param>
		/// <returns>Question details</returns>
		[HttpGet("{id}")]
		[ProducesResponseType(typeof(QuestionDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<QuestionDto>> GetQuestion(int id)
		{
			try
			{
				var question = await _context.Questions
					.Where(q => q.Id == id)
					.FirstOrDefaultAsync();

				if (question == null)
				{
					return NotFound(new { message = $"Question with ID {id} not found" });
				}

				var questionDto = new QuestionDto
				{
					Id = question.Id,
					Title = question.Title,
					Description = question.Description,
					Difficulty = question.Difficulty,
					Category = question.Category,
					Type = question.Type,
					Topic = question.Topic,
					Language = question.Language,
					StarterCode = question.StarterCode,
					SuggestedAnswer = question.SuggestedAnswer,
					Options = question.Options?.Select(o => new MultipleChoiceOptionDto { Id = o.Id, Text = o.Text }).ToList(),
					CorrectOptionId = question.CorrectOptionId,
					Hints = question.Hints,
					Examples = question.Examples?.Select(e => new QuestionExampleDto { Input = e.Input, Output = e.Output, Explanation = e.Explanation }).ToList(),
					Constraints = question.Constraints
				};

				return Ok(questionDto);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving question {QuestionId}", id);
				return StatusCode(500, new { message = "An error occurred while retrieving the question" });
			}
		}

		/// <summary>
		/// Create a new interview question.
		/// </summary>
		/// <param name="dto">Question data</param>
		/// <returns>Created question</returns>
		[HttpPost]
		[ProducesResponseType(typeof(QuestionDto), StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<ActionResult<QuestionDto>> CreateQuestion([FromBody] QuestionDto dto)
		{
			try
			{
				var question = new InterviewQuestion
				{
					Title = dto.Title,
					Description = dto.Description,
					Difficulty = dto.Difficulty,
					Category = dto.Category,
					Type = dto.Type,
					Topic = dto.Topic,
					Language = dto.Language,
					StarterCode = dto.StarterCode,
					SuggestedAnswer = dto.SuggestedAnswer,
					Options = dto.Options?.Select(o => new Models.MultipleChoiceOption { Id = o.Id, Text = o.Text }).ToList(),
					CorrectOptionId = dto.CorrectOptionId,
					Hints = dto.Hints,
					Examples = dto.Examples?.Select(e => new Models.QuestionExample { Input = e.Input, Output = e.Output, Explanation = e.Explanation }).ToList(),
					Constraints = dto.Constraints
				};

				_context.Questions.Add(question);
				await _context.SaveChangesAsync();

				dto.Id = question.Id;

				return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, dto);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating question");
				return StatusCode(500, new { message = "An error occurred while creating the question" });
			}
		}

		/// <summary>
		/// Update an existing interview question.
		/// </summary>
		/// <param name="id">Question ID</param>
		/// <param name="dto">Updated question data</param>
		/// <returns>No content on success</returns>
		[HttpPut("{id}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> UpdateQuestion(int id, [FromBody] QuestionDto dto)
		{
			try
			{
				var question = await _context.Questions.FindAsync(id);
				if (question == null)
				{
					return NotFound(new { message = $"Question with ID {id} not found" });
				}

				question.Title = dto.Title;
				question.Description = dto.Description;
				question.Difficulty = dto.Difficulty;
				question.Category = dto.Category;
				question.Type = dto.Type;
				question.Topic = dto.Topic;
				question.Language = dto.Language;
				question.StarterCode = dto.StarterCode;
				question.SuggestedAnswer = dto.SuggestedAnswer;
				question.Options = dto.Options?.Select(o => new Models.MultipleChoiceOption { Id = o.Id, Text = o.Text }).ToList();
				question.CorrectOptionId = dto.CorrectOptionId;
				question.Hints = dto.Hints;
				question.Examples = dto.Examples?.Select(e => new Models.QuestionExample { Input = e.Input, Output = e.Output, Explanation = e.Explanation }).ToList();
				question.Constraints = dto.Constraints;

				await _context.SaveChangesAsync();

				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating question {QuestionId}", id);
				return StatusCode(500, new { message = "An error occurred while updating the question" });
			}
		}

		/// <summary>
		/// Delete an interview question.
		/// </summary>
		/// <param name="id">Question ID</param>
		/// <returns>No content on success</returns>
		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> DeleteQuestion(int id)
		{
			try
			{
				var question = await _context.Questions.FindAsync(id);
				if (question == null)
				{
					return NotFound(new { message = $"Question with ID {id} not found" });
				}

				_context.Questions.Remove(question);
				await _context.SaveChangesAsync();

				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error deleting question {QuestionId}", id);
				return StatusCode(500, new { message = "An error occurred while deleting the question" });
			}
		}

		/// <summary>
		/// Submit code and explanation for AI review.
		/// </summary>
		/// <param name="id">Question ID</param>
		/// <param name="request">Review request containing code and/or explanation</param>
		/// <returns>AI feedback with score and suggestions</returns>
		[HttpPost("{id}/review")]
		[ProducesResponseType(typeof(ReviewResponse), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<ReviewResponse>> ReviewAnswer(int id, [FromBody] ReviewRequest request)
		{
			try
			{
				var question = await _context.Questions.FindAsync(id);
				if (question == null)
				{
					return NotFound(new { message = $"Question with ID {id} not found" });
				}

				// Simple scoring logic based on content length and presence
				int score = 0;
				var feedbackParts = new List<string>();

				bool hasCode = !string.IsNullOrWhiteSpace(request.Code) && request.Code.Length > 20;
				bool hasExplanation = !string.IsNullOrWhiteSpace(request.Explanation) && request.Explanation.Length > 20;

				if (hasCode && hasExplanation)
				{
					score = 8;
					feedbackParts.Add("Good work! Your answer demonstrates a solid understanding of the concept.");
					feedbackParts.Add("The key ideas are well-covered.");
					feedbackParts.Add("Consider elaborating on edge cases or trade-offs to make your answer even stronger.");
				}
				else if (hasCode || hasExplanation)
				{
					score = 7;
					feedbackParts.Add("Good start! You've covered some key points.");
					if (!hasCode)
					{
						feedbackParts.Add("Consider adding a code implementation to demonstrate your understanding.");
					}
					if (!hasExplanation)
					{
						feedbackParts.Add("Adding more explanation about the 'why' behind your approach would strengthen your answer.");
					}
				}
				else
				{
					score = 4;
					feedbackParts.Add("Your answer needs more depth.");
					feedbackParts.Add("Try to explain the 'why' behind your approach and consider common edge cases.");
					feedbackParts.Add("Include both code and explanation to demonstrate full understanding.");
				}

				var response = new ReviewResponse
				{
					Score = score,
					Feedback = string.Join(" ", feedbackParts)
				};

				_logger.LogInformation("Review completed for question {QuestionId} with score {Score}", id, score);

				return Ok(response);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error reviewing answer for question {QuestionId}", id);
				return StatusCode(500, new { message = "An error occurred while reviewing the answer" });
			}
		}

		/// <summary>
		/// Submit answer for a multiple choice question.
		/// </summary>
		/// <param name="id">Question ID</param>
		/// <param name="request">Answer request containing selected option ID</param>
		/// <returns>Whether the answer was correct</returns>
		[HttpPost("{id}/answer")]
		[ProducesResponseType(typeof(SubmitMultipleChoiceResponse), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<SubmitMultipleChoiceResponse>> SubmitAnswer(int id, [FromBody] SubmitMultipleChoiceRequest request)
		{
			try
			{
				var question = await _context.Questions.FindAsync(id);
				if (question == null)
				{
					return NotFound(new { message = $"Question with ID {id} not found" });
				}

				if (question.Category != "multiple-choice" || question.CorrectOptionId == null)
				{
					return BadRequest(new { message = "This question is not a multiple choice question" });
				}

				bool isCorrect = question.CorrectOptionId == request.SelectedOptionId;

				var response = new SubmitMultipleChoiceResponse
				{
					Correct = isCorrect
				};

				_logger.LogInformation("Answer submitted for question {QuestionId}: {IsCorrect}", id, isCorrect);

				return Ok(response);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error submitting answer for question {QuestionId}", id);
				return StatusCode(500, new { message = "An error occurred while submitting the answer" });
			}
		}
	}
}
