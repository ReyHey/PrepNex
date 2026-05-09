# AI Feedback Feature - Setup Guide

## Overview

PrepNex now includes an **AI-powered feedback system** that reviews your interview answers after you complete 5 questions. The system uses Azure OpenAI to provide:

- **Overall performance assessment**
- **Individual question feedback**
- **Scores out of 10** for each answer
- **Identified strengths** in your responses
- **Specific areas for improvement**
- **Constructive, personalized feedback**

## How It Works

### User Flow

1. **Answer Questions**: Complete conceptual interview questions normally
2. **Track Progress**: A counter shows how many questions you've answered (X/5)
3. **Unlock Feedback**: After answering 5 questions, a ✨ **Get AI Feedback** button appears
4. **Review Results**: Click the button to receive detailed AI feedback on all your answers
5. **Continue Learning**: Use the feedback to improve your interview skills

### Session Tracking

- Each user gets a unique **session ID** stored in `localStorage`
- All answers are tracked in the database with this session ID
- Session persists across page reloads
- You can answer more questions and request additional feedback

## Backend Setup

### 1. Azure OpenAI Configuration

Edit `API/appsettings.json` or use **User Secrets** (recommended):

```json
{
  "OpenAI": {
	"ApiKey": "your-azure-openai-api-key",
	"Endpoint": "https://your-resource.openai.azure.com/",
	"DeploymentName": "gpt-4o"
  }
}
```

**Using User Secrets** (secure, recommended for development):

```bash
cd API

# Initialize user secrets
dotnet user-secrets init

# Add OpenAI configuration
dotnet user-secrets set "OpenAI:ApiKey" "your-api-key-here"
dotnet user-secrets set "OpenAI:Endpoint" "https://your-resource.openai.azure.com/"
dotnet user-secrets set "OpenAI:DeploymentName" "gpt-4o"
```

### 2. Get Azure OpenAI Credentials

1. Go to [Azure Portal](https://portal.azure.com)
2. Create or select an **Azure OpenAI** resource
3. Go to **Keys and Endpoint**
4. Copy:
   - **KEY 1** or **KEY 2** → `ApiKey`
   - **Endpoint** → `Endpoint`
5. Go to **Model deployments**
6. Note your deployment name (e.g., "gpt-4o", "gpt-35-turbo") → `DeploymentName`

### 3. Mock Mode (No API Key Required)

If OpenAI is **not configured**, the system automatically falls back to **mock feedback**:

- ✅ Still generates realistic feedback
- ✅ Includes scores, strengths, and improvements
- ✅ Great for testing and demos
- ⚠️ Not as detailed or personalized as real AI feedback

## API Endpoints

### Submit Answer

```http
POST /api/answers/submit
Content-Type: application/json

{
  "questionId": 1,
  "answer": "Your detailed answer here...",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "message": "Answer submitted successfully",
  "sessionId": "session_1234567890_abc123",
  "answerId": 42,
  "totalAnswers": 3,
  "canRequestFeedback": false
}
```

### Get Answer Count

```http
GET /api/answers/session/{sessionId}/count
```

**Response:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "totalAnswers": 5,
  "questionIds": [1, 2, 3, 4, 5],
  "canRequestFeedback": true
}
```

### Get AI Feedback

```http
POST /api/answers/feedback
Content-Type: application/json

{
  "sessionId": "session_1234567890_abc123"
}
```

**Response:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "totalAnswers": 5,
  "overallFeedback": "Great job completing 5 questions! You demonstrated...",
  "questionFeedbacks": [
	{
	  "questionId": 1,
	  "questionTitle": "What is Object-Oriented Programming?",
	  "userAnswer": "Your answer...",
	  "feedback": "Your answer shows good understanding...",
	  "score": 8,
	  "strengths": [
		"Clear explanation of key concepts",
		"Good structure and organization"
	  ],
	  "improvements": [
		"Consider adding more real-world examples",
		"Discuss potential edge cases"
	  ]
	}
  ]
}
```

### Get Session Answers

```http
GET /api/answers/session/{sessionId}
```

**Response:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "totalAnswers": 5,
  "answers": [
	{
	  "id": 1,
	  "questionId": 5,
	  "questionTitle": "What is Object-Oriented Programming?",
	  "answer": "Your detailed answer...",
	  "submittedAt": "2026-05-09T12:30:00Z"
	}
  ]
}
```

## Database Schema

### UserAnswers Table

```sql
CREATE TABLE UserAnswers (
	Id INTEGER PRIMARY KEY AUTOINCREMENT,
	QuestionId INTEGER NOT NULL,
	Answer TEXT NOT NULL,
	SubmittedAt TEXT NOT NULL,
	SessionId TEXT NULL,
	FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE
);
```

## Frontend Integration

### Session Management

The frontend automatically:
- Generates a unique session ID on first visit
- Stores it in `localStorage` as `prepnex_session_id`
- Includes it with every answer submission
- Persists across page reloads

### UI Features

1. **Progress Indicator**
   - Shows "Answer X more questions to unlock AI feedback (Y/5)"
   - Appears at the top of the interview page

2. **Feedback Button**
   - Appears in navbar after 5+ answers
   - Shows total answer count
   - Animated loading state while fetching feedback

3. **Feedback Modal**
   - Full-screen overlay with feedback report
   - Overall assessment at the top
   - Individual question cards with:
	 - Score badge (colored by performance)
	 - Detailed feedback text
	 - ✓ Strengths section (green)
	 - → Improvements section (orange)

## Testing the Feature

### Test Scenario

1. **Start the backend:**
   ```bash
   cd API
   dotnet run
   ```

2. **Start the frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Answer questions:**
   - Go to any **conceptual question** (e.g., "What is Object-Oriented Programming?")
   - Write a detailed answer (min 10 characters)
   - Click **Submit Answer**
   - Repeat for 4 more questions

4. **Request feedback:**
   - After 5 answers, click ✨ **Get AI Feedback** in the navbar
   - Wait a few seconds
   - View your personalized feedback report!

### Test with Mock Data

If you don't want to set up Azure OpenAI:

1. Leave the OpenAI configuration empty in `appsettings.json`
2. The system will automatically use **mock feedback**
3. You'll still get realistic scores and feedback

## Cost Considerations

### Azure OpenAI Pricing

- **GPT-4o**: ~$5 per 1M input tokens, ~$15 per 1M output tokens
- **GPT-3.5-turbo**: ~$0.50 per 1M input tokens, ~$1.50 per 1M output tokens

**Estimated cost per feedback request (5 questions):**
- Input: ~1,500 tokens (questions + answers)
- Output: ~1,000 tokens (feedback)
- **GPT-4o**: ~$0.02 per request
- **GPT-3.5-turbo**: ~$0.002 per request

💡 **Tip**: Use GPT-3.5-turbo for development, GPT-4o for production

### Free Tier

Azure OpenAI offers:
- **$200 free credit** for new accounts
- Enough for thousands of feedback requests

## Customization

### Adjusting the Question Threshold

In `AnswersController.cs`, change the minimum:

```csharp
if (answers.Count < 5) // Change this number
{
	return BadRequest(new { ... });
}
```

And in `InterviewPage.tsx`:

```typescript
const canRequestFeedback = data.canRequestFeedback; // Based on backend
```

### Customizing the AI Prompt

Edit `AIFeedbackService.cs`, method `BuildPrompt()`:

```csharp
var prompt = @"You are an expert technical interviewer...
[Customize the instructions here]";
```

### Changing the Model

Use different Azure OpenAI models:
- `gpt-4o` (latest, most capable)
- `gpt-4` (very capable, slightly older)
- `gpt-35-turbo` (fast, cost-effective)

Set in `appsettings.json`:
```json
"DeploymentName": "gpt-35-turbo"
```

## Troubleshooting

### "Failed to get AI feedback"

**Possible causes:**
1. OpenAI credentials not configured → Check `appsettings.json`
2. Invalid API key → Verify in Azure Portal
3. Deployment name mismatch → Ensure it matches your Azure deployment
4. Network issues → Check firewall/proxy settings

**Solution**: Check backend logs for detailed error messages

### "You need to answer at least 5 questions"

You haven't submitted enough answers. Make sure:
- You're answering **conceptual questions** (text answers)
- Answers are **at least 10 characters** long
- Answers are being submitted successfully (check for errors)

### Session ID not persisting

Clear browser storage and reload:
```javascript
localStorage.removeItem('prepnex_session_id');
location.reload();
```

### Mock feedback instead of real AI

If you're getting generic feedback:
1. OpenAI configuration is missing or invalid
2. Check console logs for "OpenAI configuration is missing"
3. Verify your `appsettings.json` or User Secrets

## Future Enhancements

Potential improvements:
- [ ] AI feedback for **technical (code)** questions
- [ ] **Real-time hints** as you type
- [ ] **Comparison charts** across sessions
- [ ] **Detailed analytics** dashboard
- [ ] **Export feedback** as PDF
- [ ] **Voice mode** for practice interviews
- [ ] **Multi-language support**

## Security Notes

⚠️ **Important:**
- Never commit API keys to Git
- Use **User Secrets** for development
- Use **Azure Key Vault** or **Environment Variables** for production
- Answers are stored in the database (consider encryption for sensitive data)

## Support

For issues or questions:
1. Check backend logs in Visual Studio Output
2. Check browser console for frontend errors
3. Review API responses in Network tab
4. Consult Azure OpenAI documentation

---

**Happy Interview Prepping with AI! 🚀✨**
