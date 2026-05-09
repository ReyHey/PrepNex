import type { Question } from '../types';

export const mockQuestions: Question[] = [
  {
    id: 1,
    title: 'Two Sum',
    description:
      'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    category: 'code-only',
    topic: 'C#',
    language: 'csharp',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Only one valid answer exists',
    ],
    hints: ['Try using a dictionary to store previously seen values.'],
    starterCode: `public class Solution
{
    public int[] TwoSum(int[] nums, int target)
    {
        // Your solution here
    }
}`,
  },
  {
    id: 2,
    title: 'FizzBuzz',
    description:
      'Write a method that returns a list of strings for numbers from 1 to `n`.\n\n- For multiples of 3, add "Fizz"\n- For multiples of 5, add "Buzz"\n- For multiples of both 3 and 5, add "FizzBuzz"\n- Otherwise, add the number as a string.',
    difficulty: 'Easy',
    category: 'code-only',
    topic: 'C#',
    language: 'csharp',
    examples: [
      {
        input: 'n = 15',
        output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
      },
    ],
    constraints: ['1 <= n <= 10^4'],
    starterCode: `public class Solution
{
    public IList<string> FizzBuzz(int n)
    {
        // Your solution here
    }
}`,
  },
  {
    id: 3,
    title: 'Reverse a String',
    description:
      'Write a function that reverses a string. The input is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    difficulty: 'Easy',
    category: 'code-only',
    topic: 'JavaScript',
    language: 'javascript',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ASCII character'],
    hints: ['Use two pointers — one at each end, swap and move inward.'],
    starterCode: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    // Your solution here
}`,
  },
  {
    id: 4,
    title: 'Find the Missing Number',
    description:
      'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
    difficulty: 'Medium',
    category: 'code-only',
    topic: 'C#',
    language: 'csharp',
    examples: [
      { input: 'nums = [3,0,1]', output: '2', explanation: 'n = 3, numbers 0–3 present. 2 is missing.' },
      { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8' },
    ],
    constraints: ['n == nums.length', '1 <= n <= 10^4', 'All nums are unique'],
    hints: ['The sum of 0..n is n*(n+1)/2. Subtract the actual sum.'],
    starterCode: `public class Solution
{
    public int MissingNumber(int[] nums)
    {
        // Your solution here
    }
}`,
  },
  {
    id: 5,
    title: 'What is Object-Oriented Programming?',
    description:
      'Explain the four fundamental principles of Object-Oriented Programming (OOP). Provide a brief description of each principle and, where possible, give a real-world or code example to illustrate your understanding.',
    difficulty: 'Easy',
    category: 'explain',
    topic: 'OOP',
    hints: ['Think about Encapsulation, Abstraction, Inheritance, and Polymorphism.'],
  },
  {
    id: 6,
    title: 'Explain the SOLID Principles',
    description:
      'SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.\n\nExplain each principle in your own words and give an example of how violating it causes problems.',
    difficulty: 'Medium',
    category: 'explain',
    topic: 'SOLID',
    hints: ['S = Single Responsibility, O = Open/Closed, L = Liskov Substitution, I = Interface Segregation, D = Dependency Inversion'],
  },
  {
    id: 7,
    title: 'What is a REST API?',
    description:
      'Explain what a REST API is, the core constraints of REST, and the meaning of the common HTTP methods. Why is statelessness important in REST?',
    difficulty: 'Easy',
    category: 'explain',
    topic: 'REST API',
    hints: ['REST stands for Representational State Transfer. Think about HTTP verbs and statelessness.'],
  },
  {
    id: 8,
    title: 'Implement and Explain async/await in C#',
    description:
      'Describe how async/await works in C#. What problem does it solve?\n\nThen, implement a method `FetchDataAsync` that simulates fetching data from two sources concurrently and returns both results combined into a list.',
    difficulty: 'Medium',
    category: 'code-and-explain',
    topic: '.NET',
    language: 'csharp',
    hints: ['Think about thread blocking vs. non-blocking I/O. For the code part, consider Task.WhenAll.'],
    starterCode: `public class DataService
{
    public async Task<List<string>> FetchDataAsync()
    {
        // Fetch from source A and source B concurrently
        // Return combined results
    }

    private Task<string> FetchFromSourceA() => Task.FromResult("Result A");
    private Task<string> FetchFromSourceB() => Task.FromResult("Result B");
}`,
  },
  {
    id: 9,
    title: 'Which HTTP method is idempotent?',
    description:
      'An idempotent HTTP method is one where making the same request multiple times produces the same result as making it once. Which of the following is NOT idempotent?',
    difficulty: 'Easy',
    category: 'multiple-choice',
    topic: 'REST API',
    options: [
      { id: 1, text: 'GET' },
      { id: 2, text: 'PUT' },
      { id: 3, text: 'POST' },
      { id: 4, text: 'DELETE' },
    ],
    correctOptionId: 3,
  },
  {
    id: 10,
    title: 'What does the `sealed` keyword do in C#?',
    description:
      'In C#, the `sealed` keyword can be applied to a class. What is the effect of marking a class as `sealed`?',
    difficulty: 'Easy',
    category: 'multiple-choice',
    topic: 'C#',
    options: [
      { id: 1, text: 'Prevents the class from being instantiated directly' },
      { id: 2, text: 'Prevents the class from being inherited by other classes' },
      { id: 3, text: 'Makes all properties in the class read-only' },
      { id: 4, text: 'Marks the class as thread-safe' },
    ],
    correctOptionId: 2,
  },
  {
    id: 11,
    title: 'What is the output of the following JavaScript code?',
    description: 'Given the following code, what will be logged to the console?\n\n```js\nconsole.log(typeof null);\n```',
    difficulty: 'Easy',
    category: 'multiple-choice',
    topic: 'JavaScript',
    options: [
      { id: 1, text: '"null"' },
      { id: 2, text: '"undefined"' },
      { id: 3, text: '"object"' },
      { id: 4, text: '"number"' },
    ],
    correctOptionId: 3,
  },
];
