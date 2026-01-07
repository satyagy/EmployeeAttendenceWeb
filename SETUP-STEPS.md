# Complete Setup Steps - Fix Prisma Error

## The Problem
The error `PrismaClientInitializationError` means:
1. **DATABASE_URL is missing** from your `.env` file, OR
2. **Prisma Client hasn't been generated**, OR
3. **Database tables don't exist**

## Step-by-Step Fix

### Step 1: Install dotenv (if not already installed)
```bash
npm install dotenv
```

### Step 2: Create/Verify .env File

Create a `.env` file in the root directory (`/Users/satyagy/Documents/EmployeeAttendenceWeb/.env`):

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/employee_attendance?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI API (for chatbot - optional)
OPENAI_API_KEY="your-openai-api-key"

# Admin User Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin User"
```

**Important:** Replace:
- `username` with your PostgreSQL username (usually `postgres`)
- `password` with your PostgreSQL password
- `your-secret-key-here` with a generated secret (run: `openssl rand -base64 32`)

### Step 3: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE employee_attendance;

# Exit
\q
```

### Step 4: Generate Prisma Client

```bash
npm run db:generate
```

This creates the Prisma Client that the scripts need.

### Step 5: Create Database Tables

```bash
npm run db:push
```

This creates all the tables (users, attendance, tasks, leaves) in your database.

### Step 6: Create Admin User

Now run the seed script:

```bash
npm run seed:admin
```

You should see:
```
✅ Admin user created successfully!
========================================
Login Credentials:
========================================
Email:    admin@example.com
Password: admin123
```

### Step 7: Start the Server

```bash
npm run dev
```

### Step 8: Login

Go to http://localhost:3000 and login with:
- **Email:** `admin@example.com`
- **Password:** `admin123`

## Troubleshooting

### Error: "DATABASE_URL is not set"
- Make sure `.env` file exists in the root directory
- Check the file has `DATABASE_URL=...` (no spaces around `=`)
- Verify the path is correct

### Error: "Can't reach database server"
- Check PostgreSQL is running:
  ```bash
  # macOS
  brew services list | grep postgresql
  
  # Or check if it's running
  pg_isready
  ```
- Verify DATABASE_URL format is correct
- Make sure database `employee_attendance` exists

### Error: "PrismaClient needs to be constructed"
- Run: `npm run db:generate`
- Make sure `.env` file has `DATABASE_URL`
- Restart your terminal after creating `.env`

### Still Not Working?

1. **Verify .env file location:**
   ```bash
   ls -la .env
   # Should show: .env
   ```

2. **Check DATABASE_URL format:**
   ```bash
   cat .env | grep DATABASE_URL
   # Should show: DATABASE_URL="postgresql://..."
   ```

3. **Test database connection:**
   ```bash
   psql "postgresql://username:password@localhost:5432/employee_attendance"
   # If this works, your DATABASE_URL is correct
   ```

4. **Use JavaScript version:**
   ```bash
   npm run seed:admin:js
   ```

## Quick Checklist

- [ ] `.env` file exists in root directory
- [ ] `DATABASE_URL` is set in `.env`
- [ ] PostgreSQL is running
- [ ] Database `employee_attendance` exists
- [ ] Ran `npm run db:generate`
- [ ] Ran `npm run db:push`
- [ ] Ran `npm run seed:admin`

If all checked, login should work! 🎉

