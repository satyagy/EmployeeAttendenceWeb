import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date, hoursWorked, tasks } = await req.json()

    if (!date || hoursWorked === undefined) {
      return NextResponse.json(
        { error: 'Date and hours worked are required' },
        { status: 400 }
      )
    }

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      }
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already logged for this date' },
        { status: 400 }
      )
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        hoursWorked: parseFloat(hoursWorked),
        tasks: {
          create: tasks?.map((task: string) => ({
            userId: session.user.id,
            description: task
          })) || []
        }
      },
      include: {
        tasks: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ attendance }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Admins can view all, employees can only view their own
    const queryUserId = session.user.role === 'ADMIN' && userId 
      ? userId 
      : session.user.id

    const where: any = { userId: queryUserId }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        tasks: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ attendance })
  } catch (error: any) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}

