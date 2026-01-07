# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database:
```sql
CREATE DATABASE employee_attendance;
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/employee_attendance?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
OPENAI_API_KEY="sk-your-openai-api-key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin User"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Create Admin User

```bash
npm run seed:admin
```

### 6. Start Development Server

```bash
npm run dev
```

### 7. Access the Application

- Open [http://localhost:3000](http://localhost:3000)
- Login with admin credentials
- Start managing employees!

## Creating Your First Employee

1. Login as admin
2. Navigate to "Employees" in the navbar
3. Click "Add Employee"
4. Fill in the details:
   - Name
   - Email
   - Password
   - Role (Employee, Manager, or Admin)
5. Click "Create"

The employee can now login with their credentials!

## Testing the Chatbot

1. Login as any user (admin or employee)
2. Click the chatbot icon in the bottom right
3. Ask questions like:
   - "How do I log attendance?"
   - "How do I request a leave?"
   - "What features are available to me?"

The chatbot will provide role-specific responses.

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run: `npm run db:generate`

### "Database connection error"
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists

### "NEXTAUTH_SECRET is missing"
Add it to your `.env` file

### Chatbot not responding
- Verify OPENAI_API_KEY is set
- Check API key has credits
- Review browser console for errors

