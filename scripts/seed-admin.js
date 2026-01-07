// JavaScript version of seed-admin script (fallback if TypeScript doesn't work)
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

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
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message)
    
    if (error.code === 'P2002') {
      console.error('This email is already in use. Please use a different email.')
    } else if (error.code === 'P1001') {
      console.error('Cannot connect to database.')
      console.error('Please check your DATABASE_URL in .env file.')
    } else {
      console.error('Full error:', error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

