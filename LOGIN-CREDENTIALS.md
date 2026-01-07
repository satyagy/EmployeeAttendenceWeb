# Login Credentials Guide

## Default Admin Credentials

After running the setup, you can login with:

**Email:** `admin@example.com`  
**Password:** `admin123`

## How to Set Up Login Credentials

### Option 1: Using the Seed Script (Recommended)

1. Make sure your `.env` file has:
   ```env
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="admin123"
   ADMIN_NAME="Admin User"
   ```

2. Run the seed script:
   ```bash
   npm run seed:admin
   ```

3. Login with the credentials from your `.env` file

### Option 2: Interactive Admin Creation

1. Run the interactive script:
   ```bash
   npm run create:admin
   ```

2. Follow the prompts to enter:
   - Email (or press Enter for default: admin@example.com)
   - Password (or press Enter for default: admin123)
   - Name (or press Enter for default: Admin User)

3. The script will display your login credentials

### Option 3: Manual SQL (Advanced)

If the scripts don't work, you can manually create the admin user:

1. Connect to your PostgreSQL database
2. Run the SQL commands in `create-admin-user.sql`
3. **Important**: You need to generate a bcrypt hash for the password first

## Troubleshooting Login Issues

### Issue: "Invalid email or password"

**Possible causes:**

1. **Admin user doesn't exist**
   - Solution: Run `npm run seed:admin` or `npm run create:admin`

2. **Database tables don't exist**
   - Solution: Run `npm run db:push` to create tables

3. **Wrong credentials**
   - Check your `.env` file for `ADMIN_EMAIL` and `ADMIN_PASSWORD`
   - Or use the default: `admin@example.com` / `admin123`

4. **Database connection issue**
   - Check your `DATABASE_URL` in `.env`
   - Make sure PostgreSQL is running
   - Verify the database exists

### Issue: "Cannot connect to database"

1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows
   # Check Services panel
   ```

2. Verify DATABASE_URL format:
   ```
   postgresql://username:password@localhost:5432/employee_attendance?schema=public
   ```

3. Test connection:
   ```bash
   psql "postgresql://username:password@localhost:5432/employee_attendance"
   ```

### Issue: "NEXTAUTH_SECRET is missing"

1. Generate a secret:
   ```bash
   openssl rand -base64 32
   ```

2. Add to `.env`:
   ```env
   NEXTAUTH_SECRET="your-generated-secret-here"
   ```

3. Restart the development server

## Verify Admin User Exists

You can check if the admin user exists using Prisma Studio:

```bash
npm run db:studio
```

This opens a web interface where you can:
- View all users
- Check if admin user exists
- See the email and role

Or use SQL:
```sql
SELECT email, name, role FROM users WHERE role = 'ADMIN';
```

## Creating Additional Users

After logging in as admin:

1. Go to "Employees" in the navbar
2. Click "Add Employee"
3. Fill in the details
4. The new user can login with their email and password

## Changing Admin Password

Currently, password changes must be done through the database or by creating a new admin user. A password change feature can be added to the admin dashboard if needed.

