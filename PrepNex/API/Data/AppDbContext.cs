using Microsoft.EntityFrameworkCore;
using PrepNex.Models;

namespace PrepNex.Data
{
	/// <summary>
	/// Database context for PrepNex application.
	/// </summary>
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{
		}

		public DbSet<InterviewQuestion> Questions { get; set; }
		public DbSet<UserAnswer> UserAnswers { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Configure the InterviewQuestion entity
			modelBuilder.Entity<InterviewQuestion>(entity =>
			{
				entity.HasKey(e => e.Id);
				entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
				entity.Property(e => e.Description).IsRequired();
				entity.Property(e => e.Difficulty).IsRequired().HasMaxLength(50);
				entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
				entity.Property(e => e.Type).HasMaxLength(50);
			});

			// Configure the UserAnswer entity
			modelBuilder.Entity<UserAnswer>(entity =>
			{
				entity.HasKey(e => e.Id);
				entity.Property(e => e.Answer).IsRequired();
				entity.Property(e => e.SubmittedAt).IsRequired();
				entity.Property(e => e.SessionId).HasMaxLength(100);

				entity.HasOne(e => e.Question)
					.WithMany()
					.HasForeignKey(e => e.QuestionId)
					.OnDelete(DeleteBehavior.Cascade);
			});
		}
	}
}
