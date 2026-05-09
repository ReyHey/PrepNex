# Database Setup Instructions

## Prerequisites

Install EF Core tools globally (if not already installed):

```bash
dotnet tool install --global dotnet-ef
```

Or update if already installed:

```bash
dotnet tool update --global dotnet-ef
```

## Step 1: Navigate to API folder

```bash
cd API
```

## Step 2: Create Initial Migration

```bash
dotnet ef migrations add InitialCreate
```

This will create a `Migrations` folder with the migration files.

## Step 3: Create the Database

```bash
dotnet ef database update
```

This will create `prepnex.db` in the API folder.

## Step 4: Verify Database Creation

Check that `prepnex.db` exists in the API folder.

## Step 5 (Optional): Add Seed Data

You can add seed data by editing `Data/AppDbContext.cs` in the `OnModelCreating` method.

Example:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
	base.OnModelCreating(modelBuilder);

	// Existing configuration...

	// Add seed data
	modelBuilder.Entity<InterviewQuestion>().HasData(
		new InterviewQuestion
		{
			Id = 1,
			Title = "Two Sum",
			Description = "Given an array of integers nums and an integer target...",
			Difficulty = "Easy",
			Category = "C#",
			Type = "technical",
			StarterCode = "public class Solution\n{\n    public int[] TwoSum(int[] nums, int target)\n    {\n        // Your code here\n    }\n}",
			SuggestedAnswer = null
		},
		// Add more questions...
	);
}
```

Then create a new migration and update:

```bash
dotnet ef migrations add SeedData
dotnet ef database update
```

## Troubleshooting

### "dotnet ef" not recognized

Install the tool:
```bash
dotnet tool install --global dotnet-ef
```

### Build errors

Make sure you're in the API folder and run:
```bash
dotnet build
```

### Migration already exists

If you need to remove the last migration:
```bash
dotnet ef migrations remove
```

### Database already exists

If you want to start fresh:
```bash
rm prepnex.db
dotnet ef database update
```

## Verify Everything Works

1. Build the project: `dotnet build`
2. Run the project: `dotnet run`
3. Navigate to Swagger UI: `https://localhost:7XXX/swagger`
4. Try the GET /api/questions endpoint

## API Endpoints Available

Once the database is set up, these endpoints will work:

- `GET /api/questions` - Get all questions
- `GET /api/questions/{id}` - Get specific question
- `POST /api/questions` - Create new question
- `PUT /api/questions/{id}` - Update question
- `DELETE /api/questions/{id}` - Delete question

## Next Steps

After database is set up:
1. Add seed data with sample questions
2. Test endpoints via Swagger
3. Connect frontend to the API
4. Test full integration

---

**Questions?** Check the main API/README.md for more details!
