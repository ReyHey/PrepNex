using PrepNex.Models;

namespace PrepNex.Data
{
	/// <summary>
	/// Seeds the database with initial interview questions matching the frontend expectations.
	/// </summary>
	public static class DataSeeder
	{
		public static void SeedDatabase(AppDbContext context)
		{
			// Only seed if database is empty
			if (context.Questions.Any())
			{
				return;
			}

			var questions = new List<InterviewQuestion>
			{
				new InterviewQuestion
				{
					Title = "Two Sum",
					Description = "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
					Difficulty = "Easy",
					Category = "code-only",
					Topic = "C#",
					Language = "csharp",
					Examples = new List<QuestionExample>
					{
						new QuestionExample { Input = "nums = [2,7,11,15], target = 9", Output = "[0,1]", Explanation = "nums[0] + nums[1] == 9" },
						new QuestionExample { Input = "nums = [3,2,4], target = 6", Output = "[1,2]" }
					},
					Constraints = new List<string>
					{
						"2 <= nums.length <= 10^4",
						"-10^9 <= nums[i] <= 10^9",
						"Only one valid answer exists"
					},
					Hints = new List<string> { "Try using a dictionary to store previously seen values." },
					StarterCode = @"public class Solution
{
	public int[] TwoSum(int[] nums, int target)
	{
		// Your solution here
	}
}"
				},
				new InterviewQuestion
				{
					Title = "FizzBuzz",
					Description = "Write a method that returns a list of strings for numbers from 1 to `n`.\n\n- For multiples of 3, add \"Fizz\"\n- For multiples of 5, add \"Buzz\"\n- For multiples of both 3 and 5, add \"FizzBuzz\"\n- Otherwise, add the number as a string.",
					Difficulty = "Easy",
					Category = "code-only",
					Topic = "C#",
					Language = "csharp",
					Examples = new List<QuestionExample>
					{
						new QuestionExample 
						{ 
							Input = "n = 15", 
							Output = "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]" 
						}
					},
					Constraints = new List<string> { "1 <= n <= 10^4" },
					StarterCode = @"public class Solution
{
	public IList<string> FizzBuzz(int n)
	{
		// Your solution here
	}
}"
				},
				new InterviewQuestion
				{
					Title = "Reverse a String",
					Description = "Write a function that reverses a string. The input is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
					Difficulty = "Easy",
					Category = "code-only",
					Topic = "JavaScript",
					Language = "javascript",
					Examples = new List<QuestionExample>
					{
						new QuestionExample { Input = "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", Output = "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
						new QuestionExample { Input = "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", Output = "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" }
					},
					Constraints = new List<string>
					{
						"1 <= s.length <= 10^5",
						"s[i] is a printable ASCII character"
					},
					Hints = new List<string> { "Use two pointers — one at each end, swap and move inward." },
					StarterCode = @"/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
	// Your solution here
}"
				},
				new InterviewQuestion
				{
					Title = "Find the Missing Number",
					Description = "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
					Difficulty = "Medium",
					Category = "code-only",
					Topic = "C#",
					Language = "csharp",
					Examples = new List<QuestionExample>
					{
						new QuestionExample { Input = "nums = [3,0,1]", Output = "2", Explanation = "n = 3, numbers 0–3 present. 2 is missing." },
						new QuestionExample { Input = "nums = [9,6,4,2,3,5,7,0,1]", Output = "8" }
					},
					Constraints = new List<string>
					{
						"n == nums.length",
						"1 <= n <= 10^4",
						"All nums are unique"
					},
					Hints = new List<string> { "The sum of 0..n is n*(n+1)/2. Subtract the actual sum." },
					StarterCode = @"public class Solution
{
	public int MissingNumber(int[] nums)
	{
		// Your solution here
	}
}"
				},
				new InterviewQuestion
				{
					Title = "What is Object-Oriented Programming?",
					Description = "Explain the four fundamental principles of Object-Oriented Programming (OOP). Provide a brief description of each principle and, where possible, give a real-world or code example to illustrate your understanding.",
					Difficulty = "Easy",
					Category = "explain",
					Topic = "OOP",
					Hints = new List<string> { "Think about Encapsulation, Abstraction, Inheritance, and Polymorphism." }
				},
				new InterviewQuestion
				{
					Title = "Explain the SOLID Principles",
					Description = "SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.\n\nExplain each principle in your own words and give an example of how violating it causes problems.",
					Difficulty = "Medium",
					Category = "explain",
					Topic = "SOLID",
					Hints = new List<string> { "S = Single Responsibility, O = Open/Closed, L = Liskov Substitution, I = Interface Segregation, D = Dependency Inversion" }
				},
				new InterviewQuestion
				{
					Title = "What is a REST API?",
					Description = "Explain what a REST API is, the core constraints of REST, and the meaning of the common HTTP methods. Why is statelessness important in REST?",
					Difficulty = "Easy",
					Category = "explain",
					Topic = "REST API",
					Hints = new List<string> { "REST stands for Representational State Transfer. Think about HTTP verbs and statelessness." }
				},
				new InterviewQuestion
				{
					Title = "Implement and Explain async/await in C#",
					Description = "Describe how async/await works in C#. What problem does it solve?\n\nThen, implement a method `FetchDataAsync` that simulates fetching data from two sources concurrently and returns both results combined into a list.",
					Difficulty = "Medium",
					Category = "code-and-explain",
					Topic = ".NET",
					Language = "csharp",
					Hints = new List<string> { "Think about thread blocking vs. non-blocking I/O. For the code part, consider Task.WhenAll." },
					StarterCode = @"public class DataService
{
	public async Task<List<string>> FetchDataAsync()
	{
		// Fetch from source A and source B concurrently
		// Return combined results
	}

	private Task<string> FetchFromSourceA() => Task.FromResult(""Result A"");
	private Task<string> FetchFromSourceB() => Task.FromResult(""Result B"");
}"
				},
				new InterviewQuestion
				{
					Title = "Which HTTP method is idempotent?",
					Description = "An idempotent HTTP method is one where making the same request multiple times produces the same result as making it once. Which of the following is NOT idempotent?",
					Difficulty = "Easy",
					Category = "multiple-choice",
					Topic = "REST API",
					Options = new List<MultipleChoiceOption>
					{
						new MultipleChoiceOption { Id = 1, Text = "GET" },
						new MultipleChoiceOption { Id = 2, Text = "PUT" },
						new MultipleChoiceOption { Id = 3, Text = "POST" },
						new MultipleChoiceOption { Id = 4, Text = "DELETE" }
					},
					CorrectOptionId = 3
				},
				new InterviewQuestion
				{
					Title = "What does the `sealed` keyword do in C#?",
					Description = "In C#, the `sealed` keyword can be applied to a class. What is the effect of marking a class as `sealed`?",
					Difficulty = "Easy",
					Category = "multiple-choice",
					Topic = "C#",
					Options = new List<MultipleChoiceOption>
					{
						new MultipleChoiceOption { Id = 1, Text = "Prevents the class from being instantiated directly" },
						new MultipleChoiceOption { Id = 2, Text = "Prevents the class from being inherited by other classes" },
						new MultipleChoiceOption { Id = 3, Text = "Makes all properties in the class read-only" },
						new MultipleChoiceOption { Id = 4, Text = "Marks the class as thread-safe" }
					},
					CorrectOptionId = 2
				},
				new InterviewQuestion
				{
					Title = "What is the output of the following JavaScript code?",
					Description = "Given the following code, what will be logged to the console?\n\n```js\nconsole.log(typeof null);\n```",
					Difficulty = "Easy",
					Category = "multiple-choice",
					Topic = "JavaScript",
					Options = new List<MultipleChoiceOption>
					{
						new MultipleChoiceOption { Id = 1, Text = "\"null\"" },
						new MultipleChoiceOption { Id = 2, Text = "\"undefined\"" },
						new MultipleChoiceOption { Id = 3, Text = "\"object\"" },
						new MultipleChoiceOption { Id = 4, Text = "\"number\"" }
					},
					CorrectOptionId = 3
				}
			};

			context.Questions.AddRange(questions);
			context.SaveChanges();
		}
	}
}
