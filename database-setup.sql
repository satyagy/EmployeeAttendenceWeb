-- ============================================
-- Employee Attendance System Database Setup
-- ============================================
-- Run this script in your PostgreSQL database to create all required tables
-- Make sure you're connected to the 'employee_attendance' database

-- Create UserRole enum type
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYEE', 'MANAGER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Create attendance table
CREATE TABLE IF NOT EXISTS "attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- Create leaves table
CREATE TABLE IF NOT EXISTS "leaves" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaves_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
DO $$ 
BEGIN
    -- Attendance foreign keys
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'attendance_userId_fkey'
    ) THEN
        ALTER TABLE "attendance" ADD CONSTRAINT "attendance_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Tasks foreign keys
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tasks_attendanceId_fkey'
    ) THEN
        ALTER TABLE "tasks" ADD CONSTRAINT "tasks_attendanceId_fkey" 
        FOREIGN KEY ("attendanceId") REFERENCES "attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tasks_userId_fkey'
    ) THEN
        ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Leaves foreign keys
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'leaves_userId_fkey'
    ) THEN
        ALTER TABLE "leaves" ADD CONSTRAINT "leaves_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "attendance_userId_idx" ON "attendance"("userId");
CREATE INDEX IF NOT EXISTS "attendance_date_idx" ON "attendance"("date");
CREATE INDEX IF NOT EXISTS "tasks_attendanceId_idx" ON "tasks"("attendanceId");
CREATE INDEX IF NOT EXISTS "tasks_userId_idx" ON "tasks"("userId");
CREATE INDEX IF NOT EXISTS "leaves_userId_idx" ON "leaves"("userId");
CREATE INDEX IF NOT EXISTS "leaves_status_idx" ON "leaves"("status");

-- ============================================
-- Database Setup Complete!
-- ============================================
-- Next step: Run the seed-admin script or use create-admin-user.sql
-- to create the initial admin user.

