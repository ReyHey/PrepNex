-- =============================================================
-- PrepNex Seed Data
-- Mirrors the 11 questions in Frontend/src/api/mockData.ts
-- Run after schema.sql
-- =============================================================

USE PrepNex;
GO

SET NOCOUNT ON;
BEGIN TRANSACTION;

-- -------------------------------------------------------
-- Questions
-- -------------------------------------------------------
SET IDENTITY_INSERT Questions ON;

INSERT INTO Questions (Id, Title, Description, Difficulty, Category, Topic, Language, StarterCode) VALUES
(1,
 N'Two Sum',
 N'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.',
 'Easy', 'code-only', 'C#', 'csharp',
 N'public class Solution
{
    public int[] TwoSum(int[] nums, int target)
    {
        // Your solution here
    }
}'),

(2,
 N'FizzBuzz',
 N'Write a method that returns a list of strings for numbers from 1 to `n`.

- For multiples of 3, add "Fizz"
- For multiples of 5, add "Buzz"
- For multiples of both 3 and 5, add "FizzBuzz"
- Otherwise, add the number as a string.',
 'Easy', 'code-only', 'C#', 'csharp',
 N'public class Solution
{
    public IList<string> FizzBuzz(int n)
    {
        // Your solution here
    }
}'),

(3,
 N'Reverse a String',
 N'Write a function that reverses a string. The input is given as an array of characters `s`.

You must do this by modifying the input array in-place with O(1) extra memory.',
 'Easy', 'code-only', 'JavaScript', 'javascript',
 N'/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    // Your solution here
}'),

(4,
 N'Find the Missing Number',
 N'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
 'Medium', 'code-only', 'C#', 'csharp',
 N'public class Solution
{
    public int MissingNumber(int[] nums)
    {
        // Your solution here
    }
}'),

(5,
 N'What is Object-Oriented Programming?',
 N'Explain the four fundamental principles of Object-Oriented Programming (OOP). Provide a brief description of each principle and, where possible, give a real-world or code example to illustrate your understanding.',
 'Easy', 'explain', 'OOP', NULL, NULL),

(6,
 N'Explain the SOLID Principles',
 N'SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.

Explain each principle in your own words and give an example of how violating it causes problems.',
 'Medium', 'explain', 'SOLID', NULL, NULL),

(7,
 N'What is a REST API?',
 N'Explain what a REST API is, the core constraints of REST, and the meaning of the common HTTP methods. Why is statelessness important in REST?',
 'Easy', 'explain', 'REST API', NULL, NULL),

(8,
 N'Implement and Explain async/await in C#',
 N'Describe how async/await works in C#. What problem does it solve?

Then, implement a method `FetchDataAsync` that simulates fetching data from two sources concurrently and returns both results combined into a list.',
 'Medium', 'code-and-explain', '.NET', 'csharp',
 N'public class DataService
{
    public async Task<List<string>> FetchDataAsync()
    {
        // Fetch from source A and source B concurrently
        // Return combined results
    }

    private Task<string> FetchFromSourceA() => Task.FromResult("Result A");
    private Task<string> FetchFromSourceB() => Task.FromResult("Result B");
}'),

(9,
 N'Which HTTP method is NOT idempotent?',
 N'An idempotent HTTP method is one where making the same request multiple times produces the same result as making it once. Which of the following is NOT idempotent?',
 'Easy', 'multiple-choice', 'REST API', NULL, NULL),

(10,
 N'What does the `sealed` keyword do in C#?',
 N'In C#, the `sealed` keyword can be applied to a class. What is the effect of marking a class as `sealed`?',
 'Easy', 'multiple-choice', 'C#', NULL, NULL),

(11,
 N'What is the output of `typeof null` in JavaScript?',
 N'Given the following code, what will be logged to the console?

```js
console.log(typeof null);
```',
 'Easy', 'multiple-choice', 'JavaScript', NULL, NULL);

SET IDENTITY_INSERT Questions OFF;

-- -------------------------------------------------------
-- Multiple-choice options
-- -------------------------------------------------------
SET IDENTITY_INSERT QuestionOptions ON;

-- Q9: Which HTTP method is NOT idempotent?  (correct = POST, Id=3)
INSERT INTO QuestionOptions (Id, QuestionId, Text, IsCorrect, SortOrder) VALUES
(1,  9, N'GET',    0, 1),
(2,  9, N'PUT',    0, 2),
(3,  9, N'POST',   1, 3),
(4,  9, N'DELETE', 0, 4);

-- Q10: What does `sealed` do?  (correct = prevents inheritance, Id=6)
INSERT INTO QuestionOptions (Id, QuestionId, Text, IsCorrect, SortOrder) VALUES
(5,  10, N'Prevents the class from being instantiated directly',  0, 1),
(6,  10, N'Prevents the class from being inherited by other classes', 1, 2),
(7,  10, N'Makes all properties in the class read-only',          0, 3),
(8,  10, N'Marks the class as thread-safe',                       0, 4);

-- Q11: typeof null  (correct = "object", Id=11)
INSERT INTO QuestionOptions (Id, QuestionId, Text, IsCorrect, SortOrder) VALUES
(9,  11, N'"null"',      0, 1),
(10, 11, N'"undefined"', 0, 2),
(11, 11, N'"object"',    1, 3),
(12, 11, N'"number"',    0, 4);

SET IDENTITY_INSERT QuestionOptions OFF;

-- -------------------------------------------------------
-- Hints
-- -------------------------------------------------------
SET IDENTITY_INSERT QuestionHints ON;

INSERT INTO QuestionHints (Id, QuestionId, Text, SortOrder) VALUES
(1, 1, N'Try using a dictionary to store previously seen values.',                                              1),
(2, 3, N'Use two pointers — one at each end, swap and move inward.',                                           1),
(3, 4, N'The sum of 0..n is n*(n+1)/2. Subtract the actual sum.',                                             1),
(4, 5, N'Think about Encapsulation, Abstraction, Inheritance, and Polymorphism.',                              1),
(5, 6, N'S = Single Responsibility, O = Open/Closed, L = Liskov Substitution, I = Interface Segregation, D = Dependency Inversion', 1),
(6, 7, N'REST stands for Representational State Transfer. Think about HTTP verbs and statelessness.',          1),
(7, 8, N'Think about thread blocking vs. non-blocking I/O. For the code part, consider Task.WhenAll.',        1);

SET IDENTITY_INSERT QuestionHints OFF;

-- -------------------------------------------------------
-- Examples
-- -------------------------------------------------------
SET IDENTITY_INSERT QuestionExamples ON;

-- Q1: Two Sum
INSERT INTO QuestionExamples (Id, QuestionId, Input, Output, Explanation, SortOrder) VALUES
(1, 1, N'nums = [2,7,11,15], target = 9', N'[0,1]', N'nums[0] + nums[1] == 9', 1),
(2, 1, N'nums = [3,2,4], target = 6',     N'[1,2]', NULL,                      2);

-- Q2: FizzBuzz
INSERT INTO QuestionExamples (Id, QuestionId, Input, Output, Explanation, SortOrder) VALUES
(3, 2, N'n = 15', N'["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', NULL, 1);

-- Q3: Reverse a String
INSERT INTO QuestionExamples (Id, QuestionId, Input, Output, Explanation, SortOrder) VALUES
(4, 3, N's = ["h","e","l","l","o"]',     N'["o","l","l","e","h"]', NULL, 1),
(5, 3, N's = ["H","a","n","n","a","h"]', N'["h","a","n","n","a","H"]', NULL, 2);

-- Q4: Find the Missing Number
INSERT INTO QuestionExamples (Id, QuestionId, Input, Output, Explanation, SortOrder) VALUES
(6, 4, N'nums = [3,0,1]',             N'2', N'n = 3, numbers 0–3 present. 2 is missing.', 1),
(7, 4, N'nums = [9,6,4,2,3,5,7,0,1]', N'8', NULL, 2);

SET IDENTITY_INSERT QuestionExamples OFF;

-- -------------------------------------------------------
-- Constraints
-- -------------------------------------------------------
SET IDENTITY_INSERT QuestionConstraints ON;

-- Q1: Two Sum
INSERT INTO QuestionConstraints (Id, QuestionId, Text, SortOrder) VALUES
(1, 1, N'2 <= nums.length <= 10^4',        1),
(2, 1, N'-10^9 <= nums[i] <= 10^9',        2),
(3, 1, N'Only one valid answer exists',     3);

-- Q2: FizzBuzz
INSERT INTO QuestionConstraints (Id, QuestionId, Text, SortOrder) VALUES
(4, 2, N'1 <= n <= 10^4', 1);

-- Q3: Reverse a String
INSERT INTO QuestionConstraints (Id, QuestionId, Text, SortOrder) VALUES
(5, 3, N'1 <= s.length <= 10^5',            1),
(6, 3, N's[i] is a printable ASCII character', 2);

-- Q4: Find the Missing Number
INSERT INTO QuestionConstraints (Id, QuestionId, Text, SortOrder) VALUES
(7, 4, N'n == nums.length',         1),
(8, 4, N'1 <= n <= 10^4',           2),
(9, 4, N'All nums are unique',      3);

SET IDENTITY_INSERT QuestionConstraints OFF;

COMMIT TRANSACTION;

PRINT 'Seed data inserted: 11 questions, 12 options, 7 hints, 7 examples, 9 constraints.';
