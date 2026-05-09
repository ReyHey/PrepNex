# 🎯 PrepNex - Quick Reference Card

## 🚀 ONE COMMAND TO RULE THEM ALL
```powershell
.\start-prepnex.ps1
```
**Does everything:** Database setup → Build → Install deps → Start services

---

## 📋 Common Commands

### Start Everything
```powershell
.\start-prepnex.ps1
```

### Check Environment
```powershell
.\check-environment.ps1
```

### Setup Database Only
```powershell
.\setup-database.ps1
```

### Manual Start (Backend)
```powershell
cd API
dotnet run
```

### Manual Start (Frontend)
```powershell
cd Frontend
npm run dev
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5047 |
| Swagger UI | http://localhost:5047/swagger |

---

## 🔧 Quick Fixes

### Database Not Connected
```powershell
# Check SQL Server
sqlcmd -S localhost -Q "SELECT @@VERSION"

# If fails, try:
sqlcmd -S localhost\SQLEXPRESS -Q "SELECT @@VERSION"

# Then update API/appsettings.json with correct server
```

### Reset Database
```powershell
sqlcmd -S localhost -Q "DROP DATABASE PrepNex"
.\setup-database.ps1
```

### Clean Build
```powershell
# Backend
cd API
dotnet clean
dotnet build

# Frontend
cd Frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Port Conflicts
```powershell
# Find process using port 5047
netstat -ano | findstr :5047

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

---

## 🐛 Troubleshooting Decision Tree

### Build Fails?
1. Check .NET version: `dotnet --version` (need 10.x)
2. Restore packages: `cd API && dotnet restore`
3. Clean build: `dotnet clean && dotnet build`

### SQL Server Issues?
1. Check if running: `sqlcmd -S localhost -Q "SELECT 1"`
2. Try SQLEXPRESS: `sqlcmd -S localhost\SQLEXPRESS -Q "SELECT 1"`
3. Update connection string in `API/appsettings.json`

### Frontend Won't Start?
1. Check Node.js: `node --version` (need v18+)
2. Install deps: `cd Frontend && npm install`
3. Clear cache: `npm cache clean --force`

### API Returns 500 Errors?
1. Check database exists: `sqlcmd -S localhost -d PrepNex -Q "SELECT COUNT(*) FROM Questions"`
2. Check connection string in appsettings.json
3. Check logs in Visual Studio Output window

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `API/appsettings.json` | Database connection |
| `Frontend/.env` | API endpoint config |
| `API/Database/schema.sql` | Database structure |
| `API/Database/seed.sql` | Initial data |
| `start-prepnex.ps1` | All-in-one startup |
| `QUICK_START.md` | Full documentation |

---

## 🎓 Need More Help?

1. **Full Guide**: Read `QUICK_START.md`
2. **Changes Made**: Read `DATABASE_MIGRATION_SUMMARY.md`
3. **Environment Check**: Run `.\check-environment.ps1`
4. **Database Schema**: See `API/Database/README.md`

---

## ✅ Success Checklist

- [ ] SQL Server installed and running
- [ ] .NET 10 SDK installed
- [ ] Node.js installed
- [ ] Run `.\check-environment.ps1` (all green)
- [ ] Run `.\start-prepnex.ps1` (services start)
- [ ] Open http://localhost:5173 (frontend loads)
- [ ] Open http://localhost:5047/swagger (API responds)

---

**🎉 You're ready to rock PrepNex!**

Print this card and keep it handy! 📌
