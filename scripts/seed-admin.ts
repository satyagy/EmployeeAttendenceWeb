import { config } from 'dotenv'
import { resolve } from 'path'

import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') })

// Validate DATABASE_URL before creating PrismaClient
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set in .env file!')
  console.error('\nPlease create a .env file with:')
  console.error('DATABASE_URL="postgresql://username:password@localhost:5432/employee_attendance?schema=public"')
  process.exit(1)
}

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin User'

  console.log('========================================')
  console.log('Creating Admin User')
  console.log('========================================')
  console.log(`Email: ${email}`)
  console.log(`Name: ${name}`)
  console.log('========================================\n')

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log(`Email: ${existingAdmin.email}`)
      console.log(`Name: ${existingAdmin.name}`)
      console.log(`Role: ${existingAdmin.role}`)
      console.log('\nYou can login with these credentials.')
      return
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    console.log('Creating admin user...')
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN'
      }
    })

    console.log('\n✅ Admin user created successfully!')
    console.log('========================================')
    console.log('Login Credentials:')
    console.log('========================================')
    console.log(`Email:    ${admin.email}`)
    console.log(`Password: ${password}`)
    console.log(`Name:     ${admin.name}`)
    console.log(`Role:     ${admin.role}`)
    console.log('========================================')
    console.log('\n⚠️  Please save these credentials!')
    console.log('You can now login at http://localhost:3000')
    
  } catch (error: any) {
    console.error('\n❌ Error creating admin user:', error.message)
    
    if (error.code === 'P2002') {
      console.error('This email is already in use. Please use a different email.')
    } else if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      console.error('\n⚠️  Cannot connect to database!')
      console.error('Please check:')
      console.error('1. PostgreSQL is running')
      console.error('2. DATABASE_URL in .env file is correct')
      console.error('3. Database "employee_attendance" exists')
      console.error('\nExample DATABASE_URL:')
      console.error('DATABASE_URL="postgresql://username:password@localhost:5432/employee_attendance?schema=public"')
    } else if (error.message?.includes('PrismaClient')) {
      console.error('\n⚠️  Prisma Client initialization error!')
      console.error('Please run: npm run db:generate')
    } else {
      console.error('Full error:', error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

