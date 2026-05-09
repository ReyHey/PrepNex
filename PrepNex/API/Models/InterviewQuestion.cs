using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

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

		public string? Type { get; set; }

		public string? Topic { get; set; }

		public string? Language { get; set; }

		public string? StarterCode { get; set; }

		public string? SuggestedAnswer { get; set; }

		// Store as JSON string in database
		public string? OptionsJson { get; set; }

		[NotMapped]
		public List<MultipleChoiceOption>? Options
		{
			get => string.IsNullOrEmpty(OptionsJson) 
				? null 
				: JsonSerializer.Deserialize<List<MultipleChoiceOption>>(OptionsJson);
			set => OptionsJson = value == null 
				? null 
				: JsonSerializer.Serialize(value);
		}

		public int? CorrectOptionId { get; set; }

		// Store as JSON string in database
		public string? HintsJson { get; set; }

		[NotMapped]
		public List<string>? Hints
		{
			get => string.IsNullOrEmpty(HintsJson) 
				? null 
				: JsonSerializer.Deserialize<List<string>>(HintsJson);
			set => HintsJson = value == null 
				? null 
				: JsonSerializer.Serialize(value);
		}

		// Store as JSON string in database
		public string? ExamplesJson { get; set; }

		[NotMapped]
		public List<QuestionExample>? Examples
		{
			get => string.IsNullOrEmpty(ExamplesJson) 
				? null 
				: JsonSerializer.Deserialize<List<QuestionExample>>(ExamplesJson);
			set => ExamplesJson = value == null 
				? null 
				: JsonSerializer.Serialize(value);
		}

		// Store as JSON string in database
		public string? ConstraintsJson { get; set; }

		[NotMapped]
		public List<string>? Constraints
		{
			get => string.IsNullOrEmpty(ConstraintsJson) 
				? null 
				: JsonSerializer.Deserialize<List<string>>(ConstraintsJson);
			set => ConstraintsJson = value == null 
				? null 
				: JsonSerializer.Serialize(value);
		}
	}

	public class MultipleChoiceOption
	{
		public int Id { get; set; }
		public required string Text { get; set; }
	}

	public class QuestionExample
	{
		public required string Input { get; set; }
		public required string Output { get; set; }
		public string? Explanation { get; set; }
	}
}
