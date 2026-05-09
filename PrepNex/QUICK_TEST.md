# Quick Test Guide - AI Feedback Feature

## Test the Feature (5 minutes)

### 1. Start the Backend

```bash
cd API
dotnet run
```

Wait for: `Now listening on: http://localhost:5047`

### 2. Start the Frontend (New Terminal)

```bash
cd Frontend
npm run dev
```

Wait for: `Local: http://localhost:5173`

### 3. Test Answer Submission

Open browser to `http://localhost:5173`

1. Click on **"What is Object-Oriented Programming?"** (or any conceptual question)
2. Write a test answer: "OOP stands for Object-Oriented Programming. It includes encapsulation, inheritance, polymorphism, and abstraction."
3. Click **Submit Answer**
4. ✅ Should see "Answer submitted" confirmation
5. Notice the top bar: "Answer 4 more questions to unlock AI feedback (1/5)"

### 4. Answer 4 More Questions

Quickly answer these (can be brief for testing):
- "Explain SOLID principles" → "SOLID is about good design"
- "What is REST API?" → "REST is a web architecture style"
- "Explain async/await in C#" → "Async/await is for asynchronous programming"
- "Explain JavaScript closures" → "Closures allow functions to access outer scope"

### 5. Get AI Feedback

After 5 answers:
1. ✅ **Get AI Feedback** button should appear in navbar (purple gradient)
2. Click it
3. Wait ~3-5 seconds (loading spinner)
4. 🎉 **Feedback modal** should appear with:
   - Overall assessment
   - 5 question cards
   - Scores (out of 10)
   - Strengths & improvements

### 6. Test API Directly (Optional)

```bash
# Submit an answer
curl -X POST http://localhost:5047/api/answers/submit \
  -H "Content-Type: application/json" \
  -d '{"questionId": 1, "answer": "Test answer here", "sessionId": "test123"}'

# Check answer count
curl http://localhost:5047/api/answers/session/test123/count

# Get feedback (after 5 answers)
curl -X POST http://localhost:5047/api/answers/feedback \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test123"}'
```

## Expected Results

### ✅ Success Indicators

- [x] Backend starts without errors
- [x] Frontend connects to backend
- [x] Answer submission works
- [x] Progress counter updates (X/5)
- [x] Feedback button appears after 5 answers
- [x] Feedback modal displays with:
  - Purple gradient header
  - Overall feedback section
  - 5 question feedback cards
  - Scores (colored by performance)
  - Strengths (✓ green bullets)
  - Improvements (→ orange bullets)
  - Close button works

### ⚠️ Mock Mode Notice

If you see generic feedback like "Great job completing 5 questions...", you're in **mock mode** (OpenAI not configured). This is **normal and expected** for testing!

To enable real AI feedback, see `AI_FEEDBACK_SETUP.md`.

## Troubleshooting

### "Answer X more questions" stuck at same number

- Check browser console for errors
- Verify backend is running on port 5047
- Check that answers are >10 characters
- Try refreshing the page

### Feedback button doesn't appear

- Make sure you answered **5** questions
- Check session ID in localStorage: `localStorage.getItem('prepnex_session_id')`
- Try: `localStorage.removeItem('prepnex_session_id')` and reload

### "Failed to get AI feedback"

- Normal if you haven't answered 5 questions yet
- Check backend logs for detailed error
- Verify database has your answers: `GET /api/answers/session/{sessionId}`

## Quick Demo Script (1 minute)

Perfect for showing to others:

1. **Open app** → "PrepNex helps you practice interviews"
2. **Click question** → "Let's answer some questions"
3. **Submit 5 answers** (quickly) → "Notice the progress counter"
4. **Click AI Feedback button** → "After 5 questions, we get AI feedback"
5. **Show modal** → "Look at the detailed scores and personalized feedback!"

---

## Swagger UI Testing

Open `http://localhost:5047/swagger` to test API directly:

### Test Flow

1. **POST /api/answers/submit**
   ```json
   {
	 "questionId": 1,
	 "answer": "Your detailed answer here",
	 "sessionId": "swagger-test-123"
   }
   ```
   Repeat 5 times with different questionIds

2. **GET /api/answers/session/swagger-test-123/count**
   Should show `totalAnswers: 5` and `canRequestFeedback: true`

3. **POST /api/answers/feedback**
   ```json
   {
	 "sessionId": "swagger-test-123"
   }
   ```
   Should return full feedback with scores and suggestions

---

**All tests passing? You're ready to demo! 🚀**
