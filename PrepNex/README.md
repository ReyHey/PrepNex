# PrepNex - Interview Preparation Platform

PrepNex is a modern, LeetCode-inspired interview preparation platform that helps developers practice both **technical coding challenges** and **conceptual interview questions**.

## 🚀 Features

- **Split-screen Interview Experience**: Question panel + Monaco code editor
- **Dynamic Question Types**: 
  - Technical (coding challenges with syntax highlighting)
  - Conceptual (theory questions with suggested answers)
- **Smart Filtering**: Search by difficulty, category, type
- **Multiple Categories**: C#, JavaScript, .NET, REST API, SQL, OOP
- **Modern UI**: Dark theme, responsive design, LeetCode-inspired
- **Real-time Code Editor**: Monaco Editor with syntax highlighting
- **RESTful API**: ASP.NET Core backend with SQLite
- **✨ AI-Powered Feedback**: Get personalized feedback on your answers after completing 5 questions (powered by Azure OpenAI)

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS 4** - Styling
- **Monaco Editor** - Code editing
- **React Router 7** - Navigation

### Backend
- **ASP.NET Core 10** - REST API
- **Entity Framework Core** - ORM
- **SQLite** - Database
- **Swagger** - API documentation

## 📋 Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [EF Core Tools](https://docs.microsoft.com/en-us/ef/core/cli/dotnet) (installed automatically below)

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ReyHey/PrepNex.git
cd PrepNex
```

### 2. Backend Setup

```bash
cd API

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Restore packages
dotnet restore

# The database will be created and seeded automatically when you run the app
dotnet run
```

The API will start on:
- HTTP: `http://localhost:5047`
- HTTPS: `https://localhost:7278`
- Swagger UI: `http://localhost:5047/swagger`

### 3. Frontend Setup

Open a new terminal:

```bash
cd Frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will start on: `http://localhost:5173`

### 4. (Optional) Configure AI Feedback

To enable AI-powered feedback on answers:

```bash
cd API

# Option 1: Use User Secrets (recommended)
dotnet user-secrets set "OpenAI:ApiKey" "your-azure-openai-key"
dotnet user-secrets set "OpenAI:Endpoint" "https://your-resource.openai.azure.com/"
dotnet user-secrets set "OpenAI:DeploymentName" "gpt-4o"

# Option 2: Edit appsettings.json (not recommended for production)
# Add your Azure OpenAI credentials to the OpenAI section
```

**Without OpenAI configuration**, the system automatically uses **mock feedback** (still useful for testing).

📖 See [AI_FEEDBACK_SETUP.md](AI_FEEDBACK_SETUP.md) for detailed setup instructions.

## 🗄️ Database

The SQLite database (`prepnex.db`) is automatically created and seeded with sample questions when you first run the API.

### Manual Database Commands

If you need to manually manage the database:

```bash
cd API

# Create a new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# Drop database (will be recreated on next run)
rm prepnex.db
```

## 🔧 Configuration

### Frontend Environment Variables

Edit `Frontend/.env`:

```env
# API endpoint
VITE_API_BASE_URL=http://localhost:5047

# Use mock data (true/false)
VITE_USE_MOCK_DATA=false
```

### Backend Configuration

Edit `API/appsettings.json`:

```json
{
  "ConnectionStrings": {
	"DefaultConnection": "Data Source=prepnex.db"
  }
}
```

## 📁 Project Structure

```
PrepNex/
├── API/                          # Backend (.NET)
│   ├── Controllers/              # API endpoints
│   │   └── QuestionsController.cs
│   ├── Data/                     # Database context and seeding
│   │   ├── AppDbContext.cs
│   │   └── DataSeeder.cs
│   ├── DTOs/                     # Data transfer objects
│   │   └── QuestionDto.cs
│   ├── Models/                   # Entity models
│   │   └── InterviewQuestion.cs
│   ├── Migrations/               # EF Core migrations
│   ├── Program.cs                # App entry point
│   └── PrepNex.csproj
│
└── Frontend/                     # Frontend (React)
	├── src/
	│   ├── api/                  # API client and services
	│   ├── components/           # React components
	│   │   ├── interview/        # Interview page components
	│   │   ├── layout/           # Layout components
	│   │   ├── questions/        # Question list components
	│   │   └── ui/               # Reusable UI components
	│   ├── hooks/                # Custom React hooks
	│   ├── pages/                # Page components
	│   ├── types/                # TypeScript types
	│   ├── App.tsx
	│   └── main.tsx
	├── package.json
	└── vite.config.ts
```

## 🌐 API Endpoints

### Questions

- `GET /api/questions` - Get all questions (with optional filters)
  - Query params: `difficulty`, `category`, `type`, `search`
- `GET /api/questions/{id}` - Get question by ID
- `POST /api/questions` - Create new question
- `PUT /api/questions/{id}` - Update question
- `DELETE /api/questions/{id}` - Delete question

### Swagger Documentation

Visit `http://localhost:5047/swagger` when the API is running.

## 🎯 Usage

1. **Browse Questions**: Home page shows all available questions with filtering
2. **Select a Question**: Click any question to start the interview
3. **Technical Questions**: Write code in Monaco Editor, click "Run Code"
4. **Conceptual Questions**: Write your answer, submit, compare with suggested answer
5. **Navigate**: Use sidebar to switch between questions

## 🧪 Sample Questions Included

The database is pre-seeded with:
- **Technical**: Two Sum, FizzBuzz, Reverse String, Find Missing Number
- **Conceptual**: OOP principles, async/await, SOLID, REST API design, JavaScript closures, SQL joins

## 🚦 Development Scripts

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
dotnet run       # Start API
dotnet build     # Build project
dotnet test      # Run tests (if any)
```

## 🔐 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Create React App default)

Edit `API/Program.cs` to add more origins if needed.

## 🐛 Troubleshooting

### Database Issues

If you encounter database errors:

```bash
cd API
rm prepnex.db
dotnet run  # Database will be recreated
```

### CORS Errors

Make sure:
1. Backend is running on `http://localhost:5047`
2. Frontend `.env` has correct `VITE_API_BASE_URL`
3. Frontend is running on `http://localhost:5173`

### Port Conflicts

If ports are in use, change them in:
- Backend: `API/Properties/launchSettings.json`
- Frontend: `Frontend/vite.config.ts` (add `server: { port: 3000 }`)

## 📝 Adding New Questions

### Option 1: Via API (Swagger)

1. Go to `http://localhost:5047/swagger`
2. Use POST `/api/questions` endpoint
3. Fill in the question data

### Option 2: Via Database Seeder

Edit `API/Data/DataSeeder.cs` and add your question to the list, then:

```bash
cd API
rm prepnex.db
dotnet run
```

## 🎨 Customization

### Add New Categories

1. Add questions with new category in `DataSeeder.cs`
2. Update language mapping in `CodeEditorPanel.tsx` if needed

### Change Theme/Colors

Edit Tailwind classes in components or modify `Frontend/src/index.css`

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

## 📄 License

MIT License - Feel free to use for your own interview prep or projects!

## 👥 Team

Built during a hackathon by the PrepNex team.

## 🔗 Links

- **GitHub**: https://github.com/ReyHey/PrepNex
- **Demo Video**: [Coming soon]

---

**Happy Interview Prepping! 🚀**
