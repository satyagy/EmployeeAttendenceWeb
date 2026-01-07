import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'
import { config } from 'dotenv'
import { resolve } from 'path'

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('========================================')
  console.log('Admin User Creation Script')
  console.log('========================================\n')

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log(`Email: ${existingAdmin.email}`)
      console.log(`Name: ${existingAdmin.name}`)
      
      const answer = await question('\nDo you want to create another admin? (y/n): ')
      if (answer.toLowerCase() !== 'y') {
        console.log('Exiting...')
        return
      }
    }

    // Get admin details
    console.log('\nEnter admin user details:')
    const email = await question('Email (default: admin@example.com): ') || 'admin@example.com'
    const password = await question('Password (default: admin123): ') || 'admin123'
    const name = await question('Name (default: Admin User): ') || 'Admin User'

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log(`\n❌ Error: User with email ${email} already exists!`)
      return
    }

    // Hash password
    console.log('\nHashing password...')
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
    console.log('\n⚠️  Please save these credentials and change the password after first login!')
    
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
    rl.close()
    await prisma.$disconnect()
  }
}

main()

