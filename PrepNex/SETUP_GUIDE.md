# 🚀 PrepNex API - Quick Start Guide

## ✅ What's Been Set Up

Your API backend is **fully configured and ready to go!** Here's what's done:

### Backend Infrastructure ✅
- ✅ **Entity Framework Core** with SQLite
- ✅ **CORS** configured for frontend (ports 5173 and 3000)
- ✅ **Swagger/OpenAPI** documentation at `/swagger`
- ✅ **Controllers** with full CRUD operations
- ✅ **Models & DTOs** aligned with frontend
- ✅ **AppDbContext** configured
- ✅ **Connection strings** set up
- ✅ **.NET 10** target framework

### API Details
- **HTTPS Port:** `https://localhost:7278`
- **HTTP Port:** `http://localhost:5047`
- **Swagger UI:** `https://localhost:7278/swagger`
- **Database:** SQLite (`prepnex.db`)

---

## 🎯 For Your Database Team Member

### Step 1: Install EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

### Step 2: Navigate to API Folder

```bash
cd API
```

### Step 3: Create Database Migration

```bash
dotnet ef migrations add InitialCreate
```

### Step 4: Apply Migration to Create Database

```bash
dotnet ef database update
```

**That's it!** Your database is now created at `API/prepnex.db`

---

## 🧪 Testing the API

### Option 1: Run and Test via Swagger (Easiest)

```bash
cd API
dotnet run
```

Then open: `https://localhost:7278/swagger`

You'll see all endpoints documented and can test them directly!

### Option 2: Test via curl

```bash
# Get all questions
curl https://localhost:7278/api/questions

# Get question by ID
curl https://localhost:7278/api/questions/1
```

### Option 3: Test via Visual Studio

1. Press **F5** to run with debugging
2. Browser will open to Swagger automatically
3. Try the endpoints!

---

## 📡 Available API Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/questions` | Get all questions | `?difficulty=Easy&category=C%23&type=technical&search=sum` |
| GET | `/api/questions/{id}` | Get specific question | - |
| POST | `/api/questions` | Create new question | - |
| PUT | `/api/questions/{id}` | Update question | - |
| DELETE | `/api/questions/{id}` | Delete question | - |

### Example: Get All Easy C# Questions

```
GET https://localhost:7278/api/questions?difficulty=Easy&category=C%23
```

---

## 🗄️ Database Schema

The `InterviewQuestion` table has these fields:

```csharp
public class InterviewQuestion
{
	public int Id { get; set; }                     // Primary key
	public required string Title { get; set; }       // Question title
	public required string Description { get; set; } // Full description
	public required string Difficulty { get; set; }  // Easy/Medium/Hard
	public required string Category { get; set; }    // C#, JavaScript, etc.
	public required string Type { get; set; }        // technical/conceptual
	public string? StarterCode { get; set; }        // Code template (optional)
	public string? SuggestedAnswer { get; set; }    // Model answer (optional)
}
```

---

## 📝 Adding Seed Data (Optional but Recommended)

To add initial questions to your database:

### Method 1: Via EF Core Seed Data

Edit `API/Data/AppDbContext.cs` and add to `OnModelCreating`:

```csharp
modelBuilder.Entity<InterviewQuestion>().HasData(
	new InterviewQuestion
	{
		Id = 1,
		Title = "Two Sum",
		Description = "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
		Difficulty = "Easy",
		Category = "C#",
		Type = "technical",
		StarterCode = "public class Solution\n{\n    public int[] TwoSum(int[] nums, int target)\n    {\n        // Your code here\n    }\n}"
	},
	new InterviewQuestion
	{
		Id = 2,
		Title = "What is OOP?",
		Description = "Explain the four pillars of Object-Oriented Programming and provide examples of each.",
		Difficulty = "Easy",
		Category = "OOP",
		Type = "conceptual",
		SuggestedAnswer = "The four pillars are: 1) Encapsulation - bundling data and methods...",
	}
	// Add more...
);
```

Then run:
```bash
dotnet ef migrations add SeedData
dotnet ef database update
```

### Method 2: Via API Endpoints

Use Swagger UI or curl to POST questions:

```bash
curl -X POST https://localhost:7278/api/questions \
  -H "Content-Type: application/json" \
  -d '{
	"title": "FizzBuzz",
	"description": "Write a program that prints numbers 1 to 100...",
	"difficulty": "Easy",
	"category": "C#",
	"type": "technical",
	"starterCode": "public class Solution { }"
  }'
```

---

## 🔗 Connecting the Frontend

Your frontend is already set up! Just update the API URL:

In `Frontend/src/api/client.ts`:

```typescript
const API_BASE_URL = 'https://localhost:7278/api';
```

Then the frontend will call your real backend instead of using mock data.

---

## 🛠️ Useful Commands

```bash
# Restore packages
dotnet restore

# Build project
dotnet build

# Run project
dotnet run

# Add migration
dotnet ef migrations add <MigrationName>

# Apply migrations
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# List all migrations
dotnet ef migrations list

# Drop database and recreate
rm prepnex.db
dotnet ef database update
```

---

## 🚨 Common Issues & Solutions

### 1. "dotnet ef" command not found

**Solution:**
```bash
dotnet tool install --global dotnet-ef
```

### 2. Port already in use

**Solution:** Change ports in `API/Properties/launchSettings.json`

### 3. CORS errors from frontend

**Solution:** Make sure frontend port is in the CORS policy in `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
```

### 4. Build errors

**Solution:**
```bash
cd API
dotnet clean
dotnet restore
dotnet build
```

---

## 📊 Project Structure

```
API/
├── Controllers/
│   ├── QuestionsController.cs  ✅ Full CRUD operations
│   └── WeatherForecastController.cs (can delete later)
├── Data/
│   └── AppDbContext.cs          ✅ EF Core context
├── DTOs/
│   └── QuestionDto.cs           ✅ API response shape
├── Models/
│   └── InterviewQuestion.cs     ✅ Database model
├── Properties/
│   └── launchSettings.json
├── appsettings.json             ✅ Connection string
├── appsettings.Development.json ✅ Dev settings
├── Program.cs                   ✅ Startup & configuration
├── PrepNex.csproj               ✅ .NET 10 + EF Core
├── README.md                    ✅ Full documentation
└── DATABASE_SETUP.md            ✅ Setup instructions
```

---

## ✅ Checklist for Your Team

### Database Person:
- [ ] Install `dotnet-ef` tools
- [ ] Run `dotnet ef migrations add InitialCreate`
- [ ] Run `dotnet ef database update`
- [ ] (Optional) Add seed data
- [ ] Test via Swagger

### Integration Person:
- [ ] Verify API runs on port 7278
- [ ] Check Swagger UI works
- [ ] Test CORS with frontend
- [ ] Update frontend API URL

### Frontend Person:
- [ ] Update `API_BASE_URL` to `https://localhost:7278/api`
- [ ] Remove or disable mock data fallback
- [ ] Test full integration

---

## 🎉 Ready to Demo!

Once the database is set up and seeded:

1. **Start Backend:** `cd API && dotnet run`
2. **Start Frontend:** `cd Frontend && npm run dev`
3. **Open Browser:** `http://localhost:5173`
4. **Check Swagger:** `https://localhost:7278/swagger`

Your PrepNex platform is ready for the hackathon demo! 🚀

---

## 📞 Need Help?

- **Backend issues:** Check `API/README.md`
- **Database issues:** Check `API/DATABASE_SETUP.md`
- **EF Core docs:** https://learn.microsoft.com/ef/core/
- **Swagger docs:** Available at `/swagger` when running

**Good luck with the hackathon!** 🎯
