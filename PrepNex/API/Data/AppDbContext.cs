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
				entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
			});
		}
	}
}
