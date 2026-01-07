import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Chatbot from '@/components/Chatbot'
import { Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

export default async function EmployeeDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role === 'ADMIN') {
    redirect('/login')
  }

  const userId = session.user.id

  // Fetch employee statistics
  const [totalAttendance, totalLeaves, pendingLeaves, todayAttendance] = await Promise.all([
    prisma.attendance.count({ where: { userId } }),
    prisma.leave.count({ where: { userId } }),
    prisma.leave.count({ where: { userId, status: 'PENDING' } }),
    prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    })
  ])

  // Fetch recent attendance
  const recentAttendance = await prisma.attendance.findMany({
    where: { userId },
    include: {
      tasks: true
    },
    orderBy: { date: 'desc' },
    take: 5
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {session.user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Attendance</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAttendance}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today's Status</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {todayAttendance ? 'Logged' : 'Not Logged'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Leaves</p>
                <p className="text-2xl font-semibold text-gray-900">{totalLeaves}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Leaves</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingLeaves}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Attendance</h2>
            <a
              href="/employee/attendance"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View All →
            </a>
          </div>
          {recentAttendance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No attendance records yet. <a href="/employee/attendance" className="text-indigo-600 hover:underline">Log your first attendance</a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours Worked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAttendance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.hoursWorked} hours
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {record.tasks.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {record.tasks.map((task) => (
                              <li key={task.id}>{task.description}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">No tasks</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Chatbot />
    </div>
  )
}

