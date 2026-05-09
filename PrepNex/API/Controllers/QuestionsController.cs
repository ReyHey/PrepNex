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
					.Select(q => new QuestionDto
					{
						Id = q.Id,
						Title = q.Title,
						Description = q.Description,
						Difficulty = q.Difficulty,
						Category = q.Category,
						Type = q.Type,
						StarterCode = q.StarterCode,
						SuggestedAnswer = q.SuggestedAnswer
					})
					.ToListAsync();

				return Ok(questions);
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
					.Select(q => new QuestionDto
					{
						Id = q.Id,
						Title = q.Title,
						Description = q.Description,
						Difficulty = q.Difficulty,
						Category = q.Category,
						Type = q.Type,
						StarterCode = q.StarterCode,
						SuggestedAnswer = q.SuggestedAnswer
					})
					.FirstOrDefaultAsync();

				if (question == null)
				{
					return NotFound(new { message = $"Question with ID {id} not found" });
				}

				return Ok(question);
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
					StarterCode = dto.StarterCode,
					SuggestedAnswer = dto.SuggestedAnswer
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
				question.StarterCode = dto.StarterCode;
				question.SuggestedAnswer = dto.SuggestedAnswer;

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
	}
}
