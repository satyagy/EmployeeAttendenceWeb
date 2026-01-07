import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Chatbot from '@/components/Chatbot'
import EmployeeManagement from '@/components/EmployeeManagement'

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const employees = await prisma.user.findMany({
    where: { role: { not: 'ADMIN' } },
    include: {
      _count: {
        select: {
          attendance: true,
          leaves: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const leaves = await prisma.leave.findMany({
    where: { status: 'PENDING' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-2 text-gray-600">Manage employees, roles, and leave requests</p>
        </div>
        <EmployeeManagement employees={employees} pendingLeaves={leaves} />
      </div>
      <Chatbot />
    </div>
  )
}

