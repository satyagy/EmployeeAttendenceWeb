'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Chatbot from '@/components/Chatbot'
import { Plus, X } from 'lucide-react'

interface AttendanceRecord {
  id: string
  date: string
  hoursWorked: number
  tasks: Array<{ id: string; description: string }>
}

export default function AttendancePage() {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hoursWorked: '',
    tasks: ['']
  })

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/attendance')
      const data = await response.json()
      if (response.ok) {
        setAttendance(data.attendance.map((a: any) => ({
          ...a,
          date: new Date(a.date).toISOString().split('T')[0]
        })))
      }
    } catch (err) {
      console.error('Error fetching attendance:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const tasks = formData.tasks.filter(task => task.trim() !== '')
      
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          hoursWorked: parseFloat(formData.hoursWorked),
          tasks
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to log attendance')
      }

      setShowForm(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        hoursWorked: '',
        tasks: ['']
      })
      fetchAttendance()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTaskField = () => {
    setFormData({ ...formData, tasks: [...formData.tasks, ''] })
  }

  const removeTaskField = (index: number) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter((_, i) => i !== index)
    })
  }

  const updateTask = (index: number, value: string) => {
    const newTasks = [...formData.tasks]
    newTasks[index] = value
    setFormData({ ...formData, tasks: newTasks })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Logging</h1>
            <p className="mt-2 text-gray-600">Log your daily attendance and tasks</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Log Attendance</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Log New Attendance</h2>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="24"
                    step="0.5"
                    value={formData.hoursWorked}
                    onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 8.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tasks Performed
                  </label>
                  {formData.tasks.map((task, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => updateTask(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Describe the task..."
                      />
                      {formData.tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTaskField(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTaskField}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
                  >
                    + Add Another Task
                  </button>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Logging...' : 'Log Attendance'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setError('')
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Attendance History</h2>
          </div>
          {attendance.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No attendance records yet. Click "Log Attendance" to get started.
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
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.hoursWorked} hours
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {record.tasks.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {record.tasks.map((task) => (
                              <li key={task.id}>{task.description}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">No tasks logged</span>
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

