using Microsoft.EntityFrameworkCore;
using PrepNex.Data;
using PrepNex.Services;

namespace PrepNex
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.
			builder.Services.AddControllers();

			// Configure Entity Framework with SQLite
			builder.Services.AddDbContext<AppDbContext>(options =>
				options.UseSqlite(
					builder.Configuration.GetConnectionString("DefaultConnection") 
					?? "Data Source=prepnex.db"));

			// Register AI Feedback Service
			builder.Services.AddScoped<IAIFeedbackService, AIFeedbackService>();

			// Configure CORS for frontend
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowFrontend", policy =>
				{
					policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5174")
						.AllowAnyHeader()
						.AllowAnyMethod();
				});
			});

			// Configure Swagger/OpenAPI
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen(options =>
			{
				options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
				{
					Title = "PrepNex API",
					Version = "v1",
					Description = "API for PrepNex interview preparation platform",
					Contact = new Microsoft.OpenApi.Models.OpenApiContact
					{
						Name = "PrepNex Team"
					}
				});

				// Include XML comments if available
				var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
				var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
				if (File.Exists(xmlPath))
				{
					options.IncludeXmlComments(xmlPath);
				}
			});

			var app = builder.Build();

			// Seed the database
			using (var scope = app.Services.CreateScope())
			{
				var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
				context.Database.EnsureCreated();
				DataSeeder.SeedDatabase(context);
			}

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI(options =>
				{
					options.SwaggerEndpoint("/swagger/v1/swagger.json", "PrepNex API v1");
					options.RoutePrefix = "swagger";
				});
			}

			app.UseHttpsRedirection();

			// Enable CORS
			app.UseCors("AllowFrontend");

			app.UseAuthorization();

			app.MapControllers();

			app.Run();
		}
	}
}
