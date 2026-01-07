# Database Schema Documentation

## Overview

The Employee Attendance System uses PostgreSQL with the following tables:

1. **users** - Stores all user accounts (Admin, Manager, Employee)
2. **attendance** - Tracks daily attendance records
3. **tasks** - Records tasks performed on specific dates
4. **leaves** - Manages leave requests

## Database Tables

### 1. Users Table

Stores all user accounts with authentication and role information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier (CUID) |
| email | TEXT | UNIQUE, NOT NULL | User email (used for login) |
| password | TEXT | NOT NULL | Bcrypt hashed password |
| name | TEXT | NOT NULL | User's full name |
| role | UserRole | NOT NULL, DEFAULT 'EMPLOYEE' | User role: ADMIN, MANAGER, or EMPLOYEE |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW | Account creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- One-to-Many with `attendance`
- One-to-Many with `tasks`
- One-to-Many with `leaves`

**Indexes:**
- Primary key on `id`
- Unique index on `email`

---

### 2. Attendance Table

Tracks daily attendance records with hours worked.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier (CUID) |
| userId | TEXT | FOREIGN KEY, NOT NULL | Reference to users.id |
| date | TIMESTAMP | NOT NULL, DEFAULT NOW | Date of attendance |
| hoursWorked | FLOAT | NOT NULL | Number of hours worked |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `users` (via userId)
- One-to-Many with `tasks` (via attendanceId)

**Indexes:**
- Primary key on `id`
- Index on `userId` (for faster queries)
- Index on `date` (for date range queries)

**Business Rules:**
- One attendance record per user per day
- Hours worked must be between 0 and 24

---

### 3. Tasks Table

Records tasks performed on specific dates, linked to attendance records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier (CUID) |
| attendanceId | TEXT | FOREIGN KEY, NOT NULL | Reference to attendance.id |
| userId | TEXT | FOREIGN KEY, NOT NULL | Reference to users.id |
| description | TEXT | NOT NULL | Task description |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `attendance` (via attendanceId)
- Many-to-One with `users` (via userId)

**Indexes:**
- Primary key on `id`
- Index on `attendanceId` (for faster lookups)
- Index on `userId` (for user-specific queries)

**Business Rules:**
- Tasks are linked to attendance records
- Multiple tasks can be associated with one attendance record

---

### 4. Leaves Table

Manages leave requests with approval workflow.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier (CUID) |
| userId | TEXT | FOREIGN KEY, NOT NULL | Reference to users.id |
| startDate | TIMESTAMP | NOT NULL | Leave start date |
| endDate | TIMESTAMP | NOT NULL | Leave end date |
| reason | TEXT | NOT NULL | Reason for leave |
| status | TEXT | NOT NULL, DEFAULT 'PENDING' | Status: PENDING, APPROVED, REJECTED |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW | Request creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `users` (via userId)

**Indexes:**
- Primary key on `id`
- Index on `userId` (for user-specific queries)
- Index on `status` (for filtering by status)

**Business Rules:**
- endDate must be >= startDate
- Status can only be: PENDING, APPROVED, or REJECTED
- Only admins can change status from PENDING

---

## Enum Types

### UserRole

Defines the possible roles for users:

- **ADMIN**: Full system access, can manage all employees and approve leaves
- **MANAGER**: Can view team data and approve leaves for their team
- **EMPLOYEE**: Can log attendance, add tasks, and request leaves

---

## Entity Relationship Diagram (Text)

```
┌─────────────┐
│    users    │
├─────────────┤
│ id (PK)     │◄─────┐
│ email       │      │
│ password    │      │
│ name        │      │
│ role        │      │
│ createdAt   │      │
│ updatedAt   │      │
└─────────────┘      │
                     │
        ┌────────────┼────────────┐
        │            │            │
        │            │            │
┌───────▼───────┐ ┌──▼──────┐ ┌───▼──────┐
│  attendance   │ │  tasks  │ │  leaves │
├───────────────┤ ├─────────┤ ├─────────┤
│ id (PK)       │ │ id (PK) │ │ id (PK) │
│ userId (FK)   ├─┤userId(FK)│ │userId(FK)│
│ date          │ │attendance│ │startDate│
│ hoursWorked   │ │Id (FK)  │ │endDate  │
│ createdAt     │ │desc     │ │reason   │
│ updatedAt     │ │createdAt│ │status   │
└───────────────┘ │updatedAt│ │createdAt│
                  └─────────┘ │updatedAt│
                              └─────────┘
```

---

## Database Setup

### Using Prisma (Recommended)

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### Using SQL Script

1. Create the database:
   ```sql
   CREATE DATABASE employee_attendance;
   ```

2. Run the SQL script:
   ```bash
   psql -U your_username -d employee_attendance -f database-setup.sql
   ```

---

## Sample Queries

### Get all employees with their attendance count
```sql
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  COUNT(a.id) as attendance_count
FROM users u
LEFT JOIN attendance a ON u.id = a."userId"
WHERE u.role != 'ADMIN'
GROUP BY u.id, u.name, u.email, u.role;
```

### Get today's attendance
```sql
SELECT 
  u.name,
  a."hoursWorked",
  a.date
FROM attendance a
JOIN users u ON a."userId" = u.id
WHERE DATE(a.date) = CURRENT_DATE;
```

### Get pending leave requests
```sql
SELECT 
  u.name,
  u.email,
  l."startDate",
  l."endDate",
  l.reason
FROM leaves l
JOIN users u ON l."userId" = u.id
WHERE l.status = 'PENDING'
ORDER BY l."createdAt" DESC;
```

### Get user's attendance with tasks
```sql
SELECT 
  a.date,
  a."hoursWorked",
  array_agg(t.description) as tasks
FROM attendance a
LEFT JOIN tasks t ON a.id = t."attendanceId"
WHERE a."userId" = 'user-id-here'
GROUP BY a.id, a.date, a."hoursWorked"
ORDER BY a.date DESC;
```

---

## Data Integrity

### Foreign Key Constraints

- `attendance.userId` → `users.id` (CASCADE DELETE)
- `tasks.attendanceId` → `attendance.id` (CASCADE DELETE)
- `tasks.userId` → `users.id` (CASCADE DELETE)
- `leaves.userId` → `users.id` (CASCADE DELETE)

### Unique Constraints

- `users.email` must be unique

### Default Values

- `users.role` defaults to 'EMPLOYEE'
- `leaves.status` defaults to 'PENDING'
- All `createdAt` fields default to current timestamp

---

## Performance Considerations

### Indexes

The following indexes are created for optimal query performance:

1. **users.email** - Unique index for fast login lookups
2. **attendance.userId** - Index for user-specific attendance queries
3. **attendance.date** - Index for date range queries
4. **tasks.attendanceId** - Index for joining with attendance
5. **tasks.userId** - Index for user-specific task queries
6. **leaves.userId** - Index for user-specific leave queries
7. **leaves.status** - Index for filtering by status

### Query Optimization Tips

- Use date indexes when filtering by date ranges
- Use userId indexes when querying user-specific data
- Consider pagination for large result sets
- Use SELECT only needed columns

---

## Security Considerations

1. **Passwords**: Stored as bcrypt hashes (10 rounds)
2. **SQL Injection**: Prevented by Prisma ORM
3. **Access Control**: Enforced at application level
4. **Data Validation**: Handled by Prisma schema and API routes

---

## Backup and Maintenance

### Backup Database
```bash
pg_dump -U username employee_attendance > backup.sql
```

### Restore Database
```bash
psql -U username employee_attendance < backup.sql
```

### Vacuum and Analyze
```sql
VACUUM ANALYZE;
```

---

## Migration Notes

When modifying the schema:

1. Update `prisma/schema.prisma`
2. Run `npm run db:push` (development)
3. Or create migrations: `npx prisma migrate dev` (production)
4. Regenerate Prisma Client: `npm run db:generate`

