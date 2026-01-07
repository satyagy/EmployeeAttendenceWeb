# Employee Attendance System

A modern, responsive employee attendance management system built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Features include role-based access control, attendance logging, task tracking, leave management, and an AI-powered chatbot.

## Features

### 🔐 Authentication & Authorization
- Secure login system for Admin and Employees
- Role-based access control (Admin, Manager, Employee)
- Protected routes with NextAuth.js

### 👨‍💼 Admin Features
- **Employee Management**: Create, edit, and delete employee accounts
- **Role Assignment**: Assign roles (Admin, Manager, Employee) to users
- **Leave Approval**: Review and approve/reject leave requests
- **Dashboard**: View system-wide statistics and analytics
- **Full System Control**: Complete administrative access

### 👷 Employee Features
- **Attendance Logging**: Log daily hours worked
- **Task Tracking**: Record tasks performed on specific dates
- **Leave Requests**: Submit and track leave requests
- **Personal Dashboard**: View attendance history and statistics

### 🤖 AI Chatbot
- Available to all users
- Role-based responses based on user permissions
- Helps with attendance logging, leave requests, and system navigation
- Powered by OpenAI GPT-3.5

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI API
- **UI Components**: Lucide React Icons

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- OpenAI API key (for chatbot functionality)

## Installation

1. **Clone the repository**
   ```bash
   cd EmployeeAttendenceWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/employee_attendance?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

   # OpenAI API for Chatbot
   OPENAI_API_KEY="your-openai-api-key-here"

   # Admin User (for seeding)
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="admin123"
   ADMIN_NAME="Admin User"
   ```

   **Important**: 
   - Generate a secure `NEXTAUTH_SECRET` (you can use `openssl rand -base64 32`)
   - Replace database credentials with your PostgreSQL connection string
   - Add your OpenAI API key for chatbot functionality

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to database
   npm run db:push
   ```

5. **Seed initial admin user**
   ```bash
   npx ts-node scripts/seed-admin.ts
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

After seeding, you can login with:
- **Email**: admin@example.com (or your ADMIN_EMAIL)
- **Password**: admin123 (or your ADMIN_PASSWORD)

**⚠️ Important**: Change the default password after first login!

## Project Structure

```
EmployeeAttendenceWeb/
├── app/
│   ├── admin/              # Admin dashboard and pages
│   ├── employee/           # Employee dashboard and pages
│   ├── api/                # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── employees/     # Employee CRUD operations
│   │   ├── attendance/    # Attendance logging
│   │   ├── leaves/        # Leave management
│   │   └── chatbot/       # AI chatbot endpoint
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── Navbar.tsx
│   ├── Chatbot.tsx
│   └── EmployeeManagement.tsx
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # NextAuth configuration
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/
│   └── seed-admin.ts     # Admin user seeding script
└── types/                # TypeScript type definitions
```

## Database Schema

The system uses the following main models:

- **User**: Stores user accounts with roles (ADMIN, MANAGER, EMPLOYEE)
- **Attendance**: Tracks daily attendance records with hours worked
- **Task**: Records tasks performed on specific dates
- **Leave**: Manages leave requests with approval workflow

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth authentication

### Employees
- `GET /api/employees` - Get all employees (Admin) or own profile
- `POST /api/employees` - Create new employee (Admin only)
- `PUT /api/employees/[id]` - Update employee (Admin only)
- `DELETE /api/employees/[id]` - Delete employee (Admin only)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Log new attendance record

### Leaves
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `PATCH /api/leaves/[id]` - Update leave status (Admin only)

### Chatbot
- `POST /api/chatbot` - Get AI chatbot response

## Usage Guide

### For Admins

1. **Login** with admin credentials
2. **Navigate to Employees** to manage employee accounts
3. **Create Employee Accounts**: Click "Add Employee" to create new users
4. **Assign Roles**: Set role as Employee, Manager, or Admin
5. **Review Leaves**: Go to "Pending Leaves" tab to approve/reject requests
6. **View Dashboard**: See system-wide statistics

### For Employees

1. **Login** with employee credentials
2. **Log Attendance**: 
   - Go to "Log Attendance"
   - Select date, enter hours worked
   - Add tasks performed
   - Submit
3. **Request Leave**:
   - Go to "Leaves"
   - Click "Request Leave"
   - Fill in dates and reason
   - Submit for approval
4. **View History**: Check attendance and leave history on dashboard

### AI Chatbot

- Click the chatbot icon (bottom right)
- Ask questions about:
  - How to log attendance
  - How to request leaves
  - System features
  - Best practices
- Responses are tailored to your role

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Making Changes

1. **Database Schema**: Edit `prisma/schema.prisma`, then run `npm run db:push`
2. **API Routes**: Modify files in `app/api/`
3. **Pages**: Edit files in `app/admin/` or `app/employee/`
4. **Components**: Update files in `components/`

## Production Deployment

1. Set up a PostgreSQL database (e.g., on Railway, Supabase, or AWS RDS)
2. Update `DATABASE_URL` in production environment
3. Set secure `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
4. Add `OPENAI_API_KEY` for chatbot
5. Build the application: `npm run build`
6. Deploy to Vercel, Railway, or your preferred platform

## Security Considerations

- Passwords are hashed using bcrypt
- Authentication is handled by NextAuth.js
- Role-based access control on all routes
- SQL injection protection via Prisma ORM
- Environment variables for sensitive data

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Ensure database exists

### Authentication Errors
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies if needed

### Chatbot Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits
- Review API rate limits

## License

This project is open source and available for use.

## Support

For issues or questions, please check the codebase or create an issue in the repository.
