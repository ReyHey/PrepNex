using System;
using Microsoft.Data.SqlClient;
using System.IO;
using System.Text.Json;

namespace PrepNex.API.DataAccess
{
	public static class DBConnection
	{
		private static readonly Lazy<string> _connectionString = new Lazy<string>(LoadConnectionString);

		public static string ConnectionString => _connectionString.Value;

		public static SqlConnection CreateConnection()
		{
			return new SqlConnection(ConnectionString);
		}

		private static string LoadConnectionString()
		{
			var secretsPath = Path.Combine(AppContext.BaseDirectory, "secrets.json");

			if (!File.Exists(secretsPath))
			{
				throw new FileNotFoundException("secrets.json was not found.", secretsPath);
			}

			using var stream = File.OpenRead(secretsPath);
			using var document = JsonDocument.Parse(stream);

			if (document.RootElement.TryGetProperty("ConnectionStrings", out var connectionStrings) &&
				connectionStrings.TryGetProperty("DefaultConnection", out var defaultConnection))
			{
				return defaultConnection.GetString() ?? throw new InvalidOperationException("DefaultConnection is empty.");
			}

			if (document.RootElement.TryGetProperty("ConnectionString", out var connectionString))
			{
				return connectionString.GetString() ?? throw new InvalidOperationException("ConnectionString is empty.");
			}

			throw new InvalidOperationException("No connection string was found in secrets.json.");
		}
	}
}
