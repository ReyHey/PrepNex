# PrepNex Backend API

## 🚀 Setup Complete

The API infrastructure is now set up with:

- ✅ Entity Framework Core with SQLite
- ✅ CORS configured for frontend (ports 5173 and 3000)
- ✅ Swagger/OpenAPI documentation
- ✅ QuestionsController with full CRUD operations
- ✅ DTOs and Models ready
- ✅ AppDbContext configured

## 📋 Next Steps for Database Team Member

### 1. Restore NuGet Packages

```bash
cd API
dotnet restore
```

### 2. Create Initial Migration

```bash
dotnet ef migrations add InitialCreate
```

### 3. Create Database

```bash
dotnet ef database update
```

This will create `prepnex.db` in the API folder.

### 4. Seed the Database (Optional)

You can add seed data in `AppDbContext.OnModelCreating()` or create a separate seeder class.

Example seed data:

```csharp
modelBuilder.Entity<InterviewQuestion>().HasData(
	new InterviewQuestion
	{
		Id = 1,
		Title = "Two Sum",
		Description = "Given an array of integers...",
		Difficulty = "Easy",
		Category = "C#",
		Type = "technical",
		StarterCode = "public class Solution\n{\n    public int[] TwoSum(int[] nums, int target)\n    {\n        // Your code here\n    }\n}"
	}
);
```

## 🔧 Running the API

### Development Mode

```bash
cd API
dotnet run
```

Or press F5 in Visual Studio.

The API will run on:
- HTTPS: `https://localhost:7XXX` (check launchSettings.json)
- HTTP: `http://localhost:5XXX`

### Access Swagger UI

Navigate to: `https://localhost:7XXX/swagger`

## 📡 API Endpoints

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | Get all questions with optional filters |
| GET | `/api/questions/{id}` | Get a specific question |
| POST | `/api/questions` | Create a new question |
| PUT | `/api/questions/{id}` | Update a question |
| DELETE | `/api/questions/{id}` | Delete a question |

### Query Parameters for GET /api/questions

- `difficulty` - Filter by difficulty (Easy, Medium, Hard)
- `category` - Filter by category (C#, JavaScript, .NET, etc.)
- `type` - Filter by type (technical, conceptual)
- `search` - Search in question titles

Example:
```
GET /api/questions?difficulty=Easy&category=C%23&type=technical
```

## 🗄️ Database Schema

### InterviewQuestion Table

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | int | No | Primary key |
| Title | string(200) | No | Question title |
| Description | string | No | Question description |
| Difficulty | string(50) | No | Easy/Medium/Hard |
| Category | string(100) | No | C#, JavaScript, etc. |
| Type | string(50) | No | technical/conceptual |
| StarterCode | string | Yes | Code template |
| SuggestedAnswer | string | Yes | Model answer |

## 🔗 Frontend Integration

The frontend is already configured to work with this API. Update the API URL in:

`Frontend/src/api/client.ts`

Change from mock data to:
```typescript
const API_BASE_URL = 'https://localhost:7XXX/api';
```

## 🧪 Testing the API

### Using Swagger
1. Run the API
2. Navigate to `/swagger`
3. Try the endpoints directly from the UI

### Using curl

```bash
# Get all questions
curl https://localhost:7XXX/api/questions

# Get question by ID
curl https://localhost:7XXX/api/questions/1

# Create a question
curl -X POST https://localhost:7XXX/api/questions \
  -H "Content-Type: application/json" \
  -d '{
	"title": "Test Question",
	"description": "Test description",
	"difficulty": "Easy",
	"category": "C#",
	"type": "technical"
  }'
```

## 🛠️ EF Core Commands Reference

```bash
# Add migration
dotnet ef migrations add <MigrationName>

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# View pending migrations
dotnet ef migrations list

# Generate SQL script
dotnet ef migrations script
```

## 📝 Model Definition

The `InterviewQuestion` model is in `API/Models/InterviewQuestion.cs`:

```csharp
public class InterviewQuestion
{
	public int Id { get; set; }
	public required string Title { get; set; }
	public required string Description { get; set; }
	public required string Difficulty { get; set; }
	public required string Category { get; set; }
	public required string Type { get; set; }
	public string? StarterCode { get; set; }
	public string? SuggestedAnswer { get; set; }
}
```

## 🎯 PRD Compliance

This implementation covers:
- ✅ REST API with ASP.NET Core
- ✅ SQLite database structure
- ✅ Entity Framework Core ORM
- ✅ Full CRUD operations
- ✅ Filtering and search
- ✅ OpenAPI/Swagger documentation
- ✅ CORS for frontend integration

## 🚨 Troubleshooting

### Port conflicts
Check `API/Properties/launchSettings.json` and update ports if needed.

### CORS issues
The API is configured for ports 5173 and 3000. Update `Program.cs` if your frontend uses a different port.

### EF Core not found
Make sure you have the EF Core tools installed:
```bash
dotnet tool install --global dotnet-ef
```

## 📞 Support

Questions? Ask your teammates working on:
- Frontend: Check `Frontend/` folder
- Database: You're in the right place!
- Integration: Make sure both are running

---

**Ready to go! 🎉** Your API is structured and waiting for the database migrations.
