import type { Question } from '../types';

export const mockQuestions: Question[] = [
  {
    id: 1,
    title: 'Two Sum',
    description:
      'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    category: 'C#',
    type: 'technical',
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
    category: 'C#',
    type: 'technical',
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
    category: 'JavaScript',
    type: 'technical',
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
    category: 'C#',
    type: 'technical',
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
    category: 'OOP',
    type: 'conceptual',
    hints: ['Think about Encapsulation, Abstraction, Inheritance, and Polymorphism.'],
    suggestedAnswer: `OOP is built on four pillars:

1. **Encapsulation** — Bundling data and the methods that operate on it inside a class, and restricting direct access from outside. Example: a BankAccount class with a private balance field and public Deposit/Withdraw methods.

2. **Abstraction** — Hiding implementation details and exposing only essential features. Example: a Car class exposes Start(), Stop() without revealing engine internals.

3. **Inheritance** — A class (child) can inherit fields and methods from another class (parent), enabling code reuse. Example: Dog and Cat both inherit from Animal.

4. **Polymorphism** — The ability of objects of different types to be treated as objects of a common type. Example: calling animal.MakeSound() on a Dog returns "Woof", on a Cat returns "Meow".`,
  },
  {
    id: 6,
    title: 'Explain the SOLID Principles',
    description:
      'SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.\n\nExplain each principle in your own words and give an example of how violating it causes problems.',
    difficulty: 'Medium',
    category: 'SOLID',
    type: 'conceptual',
    hints: ['S = Single Responsibility, O = Open/Closed, L = Liskov Substitution, I = Interface Segregation, D = Dependency Inversion'],
    suggestedAnswer: `**S — Single Responsibility**: A class should have one reason to change. Violation: a UserService that both handles business logic AND sends emails — changing email templates forces changes to the service.

**O — Open/Closed**: Open for extension, closed for modification. Violation: adding a new payment type by editing a giant switch statement in existing code.

**L — Liskov Substitution**: Subtypes must be substitutable for their base types without breaking behaviour. Violation: a Square subclass of Rectangle that breaks the setWidth/setHeight contract.

**I — Interface Segregation**: Clients shouldn't be forced to depend on interfaces they don't use. Violation: a fat IWorker interface with both Work() and Eat() — robots don't eat.

**D — Dependency Inversion**: Depend on abstractions, not concretions. Violation: a high-level OrderService directly instantiating SqlOrderRepository — hard to test or swap.`,
  },
  {
    id: 7,
    title: 'What is a REST API?',
    description:
      'Explain what a REST API is, the core constraints of REST, and the meaning of the common HTTP methods. Why is statelessness important in REST?',
    difficulty: 'Easy',
    category: 'REST API',
    type: 'conceptual',
    hints: ['REST stands for Representational State Transfer. Think about HTTP verbs and statelessness.'],
    suggestedAnswer: `REST (Representational State Transfer) is an architectural style for designing networked applications using HTTP.

**Core HTTP Methods:**
- GET — retrieve a resource
- POST — create a new resource
- PUT/PATCH — update an existing resource
- DELETE — remove a resource

**Key constraints:**
- **Stateless**: Each request contains all the information needed to process it. The server stores no client session state — this enables horizontal scaling.
- **Uniform Interface**: Resources are identified by URLs. Representations (JSON/XML) are separate from the resource itself.
- **Client–Server separation**: Frontend and backend can evolve independently.
- **Cacheable**: Responses can declare themselves cacheable to improve performance.

Statelessness is important because it allows any server instance to handle any request, making load balancing trivial.`,
  },
  {
    id: 8,
    title: 'Explain async/await in C#',
    description:
      'Describe how async/await works in C#. What problem does it solve? What is the difference between Task, Task<T>, and ValueTask? When should you use ConfigureAwait(false)?',
    difficulty: 'Medium',
    category: '.NET',
    type: 'conceptual',
    hints: ['Think about thread blocking vs. non-blocking I/O and the state machine generated by the compiler.'],
    suggestedAnswer: `**async/await** enables writing asynchronous code that reads like synchronous code.

The compiler transforms an async method into a **state machine** — when an await is hit and the awaited task isn't complete, control returns to the caller without blocking a thread.

**Types:**
- \`Task\` — represents an async operation with no return value
- \`Task<T>\` — async operation that returns T
- \`ValueTask<T>\` — struct-based, avoids heap allocation when the result is often available synchronously (e.g. cached)

**ConfigureAwait(false):** By default, await captures the current SynchronizationContext and resumes on it (important in UI/ASP.NET Classic). In library code, use \`ConfigureAwait(false)\` to avoid context-switching overhead and prevent deadlocks.

**Common pitfall:** calling \`.Result\` or \`.Wait()\` on a Task in a context with a SynchronizationContext can deadlock — always await instead.`,
  },
];
