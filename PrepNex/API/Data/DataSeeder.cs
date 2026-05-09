using PrepNex.Models;

namespace PrepNex.Data
{
	/// <summary>
	/// Seeds the database with initial interview questions.
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
				// C# Technical Questions
				new InterviewQuestion
				{
					Title = "Two Sum",
					Description = "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Example 1:**\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] == 9\n\n**Example 2:**\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\n**Constraints:**\n- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- Only one valid answer exists\n\n**Hint:** Try using a dictionary to store previously seen values.",
					Difficulty = "Easy",
					Category = "C#",
					Type = "technical",
					StarterCode = @"public class Solution
{
	public int[] TwoSum(int[] nums, int target)
	{
		// Your solution here
	}
}",
					SuggestedAnswer = @"public int[] TwoSum(int[] nums, int target)
{
	var dict = new Dictionary<int, int>();
	for (int i = 0; i < nums.Length; i++)
	{
		int complement = target - nums[i];
		if (dict.ContainsKey(complement))
		{
			return new int[] { dict[complement], i };
		}
		dict[nums[i]] = i;
	}
	throw new ArgumentException(""No solution found"");
}"
				},
				new InterviewQuestion
				{
					Title = "FizzBuzz",
					Description = "Write a method that returns a list of strings for numbers from 1 to `n`.\n\n- For multiples of 3, add \"Fizz\"\n- For multiples of 5, add \"Buzz\"\n- For multiples of both 3 and 5, add \"FizzBuzz\"\n- Otherwise, add the number as a string.\n\n**Example:**\nInput: n = 15\nOutput: [\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]\n\n**Constraints:**\n- 1 <= n <= 10^4",
					Difficulty = "Easy",
					Category = "C#",
					Type = "technical",
					StarterCode = @"public class Solution
{
	public IList<string> FizzBuzz(int n)
	{
		// Your solution here
	}
}",
					SuggestedAnswer = @"public IList<string> FizzBuzz(int n)
{
	var result = new List<string>();
	for (int i = 1; i <= n; i++)
	{
		if (i % 15 == 0)
			result.Add(""FizzBuzz"");
		else if (i % 3 == 0)
			result.Add(""Fizz"");
		else if (i % 5 == 0)
			result.Add(""Buzz"");
		else
			result.Add(i.ToString());
	}
	return result;
}"
				},
				new InterviewQuestion
				{
					Title = "Find Missing Number",
					Description = "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\n**Example 1:**\nInput: nums = [3,0,1]\nOutput: 2\nExplanation: n = 3, numbers 0-3 are present. 2 is missing.\n\n**Example 2:**\nInput: nums = [9,6,4,2,3,5,7,0,1]\nOutput: 8\n\n**Constraints:**\n- n == nums.length\n- 1 <= n <= 10^4\n- All nums are unique\n\n**Hint:** The sum of 0..n is n*(n+1)/2. Subtract the actual sum.",
					Difficulty = "Medium",
					Category = "C#",
					Type = "technical",
					StarterCode = @"public class Solution
{
	public int MissingNumber(int[] nums)
	{
		// Your solution here
	}
}",
					SuggestedAnswer = @"public int MissingNumber(int[] nums)
{
	int n = nums.Length;
	int expectedSum = n * (n + 1) / 2;
	int actualSum = nums.Sum();
	return expectedSum - actualSum;
}"
				},
				new InterviewQuestion
				{
					Title = "Valid Palindrome",
					Description = "A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n**Example 1:**\nInput: s = \"A man, a plan, a canal: Panama\"\nOutput: true\nExplanation: \"amanaplanacanalpanama\" is a palindrome.\n\n**Example 2:**\nInput: s = \"race a car\"\nOutput: false\n\n**Constraints:**\n- 1 <= s.length <= 2 * 10^5\n- s consists only of printable ASCII characters",
					Difficulty = "Easy",
					Category = "C#",
					Type = "technical",
					StarterCode = @"public class Solution
{
	public bool IsPalindrome(string s)
	{
		// Your solution here
	}
}",
					SuggestedAnswer = @"public bool IsPalindrome(string s)
{
	int left = 0, right = s.Length - 1;
	while (left < right)
	{
		while (left < right && !char.IsLetterOrDigit(s[left])) left++;
		while (left < right && !char.IsLetterOrDigit(s[right])) right--;
		if (char.ToLower(s[left]) != char.ToLower(s[right]))
			return false;
		left++;
		right--;
	}
	return true;
}"
				},

				// JavaScript Technical Questions
				new InterviewQuestion
				{
					Title = "Reverse String",
					Description = "Write a function that reverses a string. The input is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n**Example 1:**\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\n**Example 2:**\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\n**Constraints:**\n- 1 <= s.length <= 10^5\n- s[i] is a printable ASCII character\n\n**Hint:** Use two pointers — one at each end, swap and move inward.",
					Difficulty = "Easy",
					Category = "JavaScript",
					Type = "technical",
					StarterCode = @"/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
	// Your solution here
}",
					SuggestedAnswer = @"function reverseString(s) {
	let left = 0, right = s.length - 1;
	while (left < right) {
		[s[left], s[right]] = [s[right], s[left]];
		left++;
		right--;
	}
}"
				},
				new InterviewQuestion
				{
					Title = "Find First Duplicate",
					Description = "Given an array of integers, find the first number that appears twice.\n\nReturn -1 if no duplicate exists.\n\n**Example 1:**\nInput: arr = [2,1,3,5,3,2]\nOutput: 3\nExplanation: 3 appears twice first\n\n**Example 2:**\nInput: arr = [2,1,3,5]\nOutput: -1\n\n**Constraints:**\n- 1 <= arr.length <= 10^5\n- -10^9 <= arr[i] <= 10^9",
					Difficulty = "Easy",
					Category = "JavaScript",
					Type = "technical",
					StarterCode = @"/**
 * @param {number[]} arr
 * @return {number}
 */
function findFirstDuplicate(arr) {
	// Your solution here
}",
					SuggestedAnswer = @"function findFirstDuplicate(arr) {
	const seen = new Set();
	for (const num of arr) {
		if (seen.has(num)) {
			return num;
		}
		seen.add(num);
	}
	return -1;
}"
				},

				// Conceptual Questions - C#
				new InterviewQuestion
				{
					Title = "What is Object-Oriented Programming?",
					Description = "Explain the core principles of Object-Oriented Programming (OOP) and how they apply to C# development.\n\nIn your answer, cover:\n- The four main pillars of OOP\n- How each principle is implemented in C#\n- Real-world examples of when you'd use each principle\n- Any trade-offs or considerations",
					Difficulty = "Easy",
					Category = "C#",
					Type = "conceptual",
					SuggestedAnswer = @"Object-Oriented Programming (OOP) is a programming paradigm based on the concept of 'objects' that contain data and code. The four main pillars of OOP are:

1. **Encapsulation**: Bundling data (fields) and methods that operate on that data within a single unit (class). In C#, we use access modifiers (private, public, protected) to control visibility. Example: A BankAccount class that keeps balance private and exposes Deposit/Withdraw methods.

2. **Inheritance**: A mechanism where a class can inherit properties and methods from another class. In C#, we use the colon syntax (class Dog : Animal). This promotes code reuse. Example: Having a base Employee class with derived classes like Manager and Developer.

3. **Polymorphism**: The ability of objects to take multiple forms. In C#, this is achieved through method overriding (virtual/override) and interfaces. Example: Having multiple payment processors (CreditCard, PayPal) that all implement IPaymentProcessor.

4. **Abstraction**: Hiding complex implementation details and exposing only necessary features. In C#, we use abstract classes and interfaces. Example: A DatabaseConnection interface that hides whether you're using SQL Server or PostgreSQL.

Trade-offs: OOP can lead to over-engineering for simple problems. Sometimes functional or procedural approaches are more appropriate."
				},
				new InterviewQuestion
				{
					Title = "Explain async/await in C#",
					Description = "Describe how asynchronous programming works in C# using async and await keywords.\n\nIn your answer, explain:\n- What problem async/await solves\n- How it works under the hood\n- When to use it vs when not to\n- Common pitfalls\n- Best practices",
					Difficulty = "Medium",
					Category = ".NET",
					Type = "conceptual",
					SuggestedAnswer = @"Async/await is C#'s way of writing asynchronous code that looks synchronous.

**Problem it solves**: Prevents blocking threads while waiting for I/O operations (network calls, file access, database queries), improving application responsiveness and scalability.

**How it works**: 
- 'async' marks a method that contains asynchronous operations
- 'await' tells the compiler to pause execution until the awaited task completes
- Under the hood, the compiler transforms the method into a state machine
- The thread is freed to do other work while waiting

**When to use**:
- I/O-bound operations (API calls, database queries)
- Long-running operations that shouldn't block the UI
- Server applications that need to handle many concurrent requests

**When NOT to use**:
- CPU-bound operations (use Task.Run instead)
- Very fast synchronous operations (overhead not worth it)

**Common pitfalls**:
- Deadlocks when blocking on async code (.Result or .Wait())
- Async void (should almost always be async Task)
- Not awaiting tasks (fire and forget issues)

**Best practices**:
- Always await or return tasks
- Use ConfigureAwait(false) in library code
- Avoid mixing async and blocking code
- Use async all the way down"
				},
				new InterviewQuestion
				{
					Title = "What are SOLID principles?",
					Description = "Explain the SOLID principles of object-oriented design and how they improve code quality.\n\nFor each principle, provide:\n- What it stands for\n- What problem it solves\n- A practical C# example\n- How it improves maintainability",
					Difficulty = "Hard",
					Category = "C#",
					Type = "conceptual",
					SuggestedAnswer = @"SOLID is an acronym for five design principles that make software designs more maintainable and flexible:

**S - Single Responsibility Principle (SRP)**
A class should have only one reason to change. Each class should focus on a single responsibility.
Example: Separate UserRepository (data access) from UserValidator (validation logic) from UserEmailService (email sending).
Benefit: Changes to email logic don't affect data access code.

**O - Open/Closed Principle (OCP)**
Classes should be open for extension but closed for modification.
Example: Use interfaces and inheritance. Instead of modifying a ReportGenerator class for each format, create IReportFormatter interface with PdfFormatter, ExcelFormatter implementations.
Benefit: Add new features without risking existing code.

**L - Liskov Substitution Principle (LSP)**
Derived classes must be substitutable for their base classes without breaking functionality.
Example: If Square inherits from Rectangle, operations valid on Rectangle must work on Square. If SetWidth/SetHeight break this, the hierarchy is wrong.
Benefit: Ensures inheritance hierarchies make logical sense.

**I - Interface Segregation Principle (ISP)**
Clients shouldn't be forced to depend on interfaces they don't use.
Example: Instead of one large IWorker interface with Work(), Eat(), Sleep(), create focused interfaces: IWorkable, IFeedable, IRestable.
Benefit: Classes only implement what they need.

**D - Dependency Inversion Principle (DIP)**
High-level modules shouldn't depend on low-level modules. Both should depend on abstractions.
Example: OrderService should depend on IPaymentProcessor interface, not concrete CreditCardProcessor class.
Benefit: Loose coupling, easier testing, better flexibility."
				},

				// Conceptual Questions - REST API
				new InterviewQuestion
				{
					Title = "What is REST and RESTful API design?",
					Description = "Explain REST architecture and best practices for designing RESTful APIs.\n\nCover:\n- What REST stands for and its core principles\n- HTTP methods and their proper usage\n- Resource naming conventions\n- Status codes\n- Versioning strategies\n- Common mistakes",
					Difficulty = "Medium",
					Category = "REST API",
					Type = "conceptual",
					SuggestedAnswer = @"REST (Representational State Transfer) is an architectural style for designing networked applications.

**Core Principles**:
1. Stateless: Each request contains all information needed
2. Client-Server separation: UI and data storage are independent
3. Cacheable: Responses must define if they can be cached
4. Uniform interface: Consistent way to interact with resources
5. Layered system: Client can't tell if connected to end server

**HTTP Methods**:
- GET: Retrieve resources (idempotent, safe)
- POST: Create new resources
- PUT: Update/replace entire resource (idempotent)
- PATCH: Partial update
- DELETE: Remove resource (idempotent)

**Resource Naming**:
- Use nouns, not verbs: /users not /getUsers
- Use plural names: /users/123
- Hierarchical: /users/123/orders/456
- Lowercase, kebab-case for multi-word: /order-items

**Status Codes**:
- 200 OK: Success
- 201 Created: Resource created
- 204 No Content: Success but no body
- 400 Bad Request: Client error
- 401 Unauthorized: Authentication required
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Server error

**Versioning**:
- URL: /api/v1/users
- Header: Accept: application/vnd.api+json;version=1
- Query parameter: /users?version=1

**Common Mistakes**:
- Using verbs in URLs
- Not using proper HTTP methods
- Inconsistent naming
- Not handling errors properly
- Over-fetching/under-fetching data
- No pagination on large collections"
				},

				// JavaScript Conceptual
				new InterviewQuestion
				{
					Title = "Explain JavaScript closures",
					Description = "What is a closure in JavaScript? How do closures work and what are common use cases?\n\nInclude:\n- Definition and explanation\n- How closures are created\n- Practical examples\n- Common patterns (module pattern, private variables)\n- Performance considerations",
					Difficulty = "Medium",
					Category = "JavaScript",
					Type = "conceptual",
					SuggestedAnswer = @"A closure is a function that has access to variables in its outer (enclosing) scope, even after the outer function has returned.

**How it works**:
When a function is created, it maintains a reference to its lexical environment (the scope in which it was defined). This allows it to access those variables later.

**Example**:
```javascript
function createCounter() {
	let count = 0;
	return function() {
		return ++count;
	};
}
const counter = createCounter();
counter(); // 1
counter(); // 2
```

The inner function maintains access to 'count' even after createCounter() finishes.

**Common use cases**:

1. **Private variables**:
```javascript
function BankAccount(initialBalance) {
	let balance = initialBalance; // private
	return {
		deposit: (amount) => balance += amount,
		getBalance: () => balance
	};
}
```

2. **Module pattern**:
```javascript
const calculator = (function() {
	let result = 0; // private state
	return {
		add: (n) => result += n,
		get: () => result
	};
})();
```

3. **Event handlers**:
```javascript
function setupButton(buttonId) {
	let clickCount = 0;
	document.getElementById(buttonId).onclick = function() {
		console.log(++clickCount);
	};
}
```

4. **Function factories**:
```javascript
function multiplier(factor) {
	return (num) => num * factor;
}
const double = multiplier(2);
const triple = multiplier(3);
```

**Performance considerations**:
- Closures keep references to entire scope chain (can prevent garbage collection)
- Don't create functions inside loops unnecessarily
- Be aware of memory implications for long-lived closures"
				},

				// SQL Questions
				new InterviewQuestion
				{
					Title = "SQL Joins Explained",
					Description = "Explain the different types of SQL joins and when to use each one.\n\nCover:\n- INNER JOIN\n- LEFT JOIN (LEFT OUTER JOIN)\n- RIGHT JOIN (RIGHT OUTER JOIN)\n- FULL OUTER JOIN\n- CROSS JOIN\n\nFor each, provide:\n- What it does\n- When to use it\n- Example scenario\n- Performance considerations",
					Difficulty = "Medium",
					Category = "SQL",
					Type = "conceptual",
					SuggestedAnswer = @"SQL joins combine rows from two or more tables based on related columns.

**INNER JOIN**:
Returns only matching rows from both tables.
Use when: You only want records that exist in both tables.
Example: Get orders with customer details (only orders that have valid customers).
```sql
SELECT * FROM Orders o
INNER JOIN Customers c ON o.CustomerId = c.Id
```
Performance: Usually fastest as it returns smallest result set.

**LEFT JOIN (LEFT OUTER JOIN)**:
Returns all rows from left table, matching rows from right (NULL if no match).
Use when: You want all records from main table, optionally with related data.
Example: Get all customers and their orders (including customers with no orders).
```sql
SELECT * FROM Customers c
LEFT JOIN Orders o ON c.Id = o.CustomerId
```

**RIGHT JOIN (RIGHT OUTER JOIN)**:
Opposite of LEFT JOIN. Rarely used (just reverse tables and use LEFT JOIN).
Returns all rows from right table, matching rows from left.

**FULL OUTER JOIN**:
Returns all rows when there's a match in either table.
Use when: You want everything from both tables, with matches combined.
Example: Find both unassigned employees and unfilled positions.
```sql
SELECT * FROM Employees e
FULL OUTER JOIN Positions p ON e.PositionId = p.Id
```
Note: Not supported by MySQL, use UNION of LEFT and RIGHT joins.

**CROSS JOIN**:
Cartesian product - every row from first table with every row from second.
Use when: You need all combinations (size tables, calendar generation).
Example: Generate all combinations of colors and sizes.
```sql
SELECT * FROM Colors CROSS JOIN Sizes
```
Warning: Result size = rows1 × rows2. Can be huge!

**Performance tips**:
- Index join columns
- INNER JOIN usually fastest
- Filter early (WHERE before JOIN when possible)
- OUTER JOINs more expensive than INNER
- Avoid CROSS JOIN on large tables
- Use EXISTS instead of IN with subqueries for better performance"
				}
			};

			context.Questions.AddRange(questions);
			context.SaveChanges();
		}
	}
}
