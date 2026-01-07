# Quick Start Guide - Fix Login Issues

## Step 1: Install Dependencies

```bash
npm install
```

This will install `tsx` which is needed to run TypeScript scripts.

## Step 2: Set Up Database

### Create Database
```bash
# Connect to PostgreSQL
psql -U your_username

# Create database
CREATE DATABASE employee_attendance;
\q
```

### Create Tables

**Option A: Using Prisma (Recommended)**
```bash
npm run db:generate
npm run db:push
```

**Option B: Using SQL Script**
```bash
psql -U your_username -d employee_attendance -f database-setup.sql
```

## Step 3: Create Admin User

### Try TypeScript version first:
```bash
npm run seed:admin
```

### If that fails, use JavaScript version:
```bash
npm run seed:admin:js
```

### Or use interactive script:
```bash
npm run create:admin
```

## Step 4: Verify Admin User

The script will display:
```
✅ Admin user created successfully!
========================================
Login Credentials:
========================================
Email:    admin@example.com
Password: admin123
Name:     Admin User
Role:     ADMIN
========================================
```

## Step 5: Start Server and Login

```bash
npm run dev
```

Then go to http://localhost:3000 and login with:
- **Email:** `admin@example.com`
- **Password:** `admin123`

## Troubleshooting

### Error: "Cannot connect to database"
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env` file
- Make sure database exists

### Error: "Admin user already exists"
- The admin is already created
- Use the displayed credentials to login
- Or delete existing admin and run seed again

### Error: "Unknown file extension .ts"
- Run: `npm install` (to install tsx)
- Or use: `npm run seed:admin:js` (JavaScript version)

### Still can't login?
1. Check database connection:
   ```bash
   npm run db:studio
   ```
   Look for the `users` table and verify admin exists

2. Verify `.env` file has:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/employee_attendance?schema=public"
   NEXTAUTH_SECRET="your-secret-here"
   ```

3. Check admin user in database:
   ```sql
   SELECT email, name, role FROM users WHERE role = 'ADMIN';
   ```

