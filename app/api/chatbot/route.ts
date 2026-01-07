import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, role, conversationHistory } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build system prompt based on user role
    let systemPrompt = ''
    if (role === 'ADMIN') {
      systemPrompt = `You are an AI assistant for an Employee Attendance System. The user is an ADMIN with full access to:
- Manage employee accounts and roles
- View all attendance records
- Approve/reject leave requests
- Access all system features

Provide helpful, professional responses about:
- Employee management
- Attendance tracking
- Leave approval processes
- System administration
- Data analytics and reports

Be concise and actionable in your responses.`
    } else if (role === 'MANAGER') {
      systemPrompt = `You are an AI assistant for an Employee Attendance System. The user is a MANAGER with access to:
- View team attendance records
- Approve leave requests for their team
- View team performance data

Provide helpful, professional responses about:
- Team attendance tracking
- Leave management
- Performance insights
- Best practices for attendance

Be concise and actionable in your responses.`
    } else {
      systemPrompt = `You are an AI assistant for an Employee Attendance System. The user is an EMPLOYEE with access to:
- Log daily attendance and hours worked
- Add tasks performed
- Request leaves
- View their own attendance history

Provide helpful, professional responses about:
- How to log attendance
- How to add tasks
- How to request leaves
- Viewing attendance history
- Company attendance policies

Be friendly, concise, and actionable in your responses.`
    }

    // Format conversation history for OpenAI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-10).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error('Chatbot error:', error)
    
    // Fallback response if OpenAI API fails
    return NextResponse.json({
      response: 'I apologize, but I\'m having trouble connecting right now. Please try again later or contact support for assistance.'
    })
  }
}

