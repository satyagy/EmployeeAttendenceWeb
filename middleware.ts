import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isEmployee = token?.role === 'EMPLOYEE' || token?.role === 'MANAGER'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isEmployeeRoute = req.nextUrl.pathname.startsWith('/employee')

    // Redirect admins away from employee routes
    if (isAdmin && isEmployeeRoute) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // Redirect employees away from admin routes
    if (isEmployee && isAdminRoute) {
      return NextResponse.redirect(new URL('/employee/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page
        if (req.nextUrl.pathname === '/login') {
          return true
        }
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/employee/:path*',
    '/api/employees/:path*',
    '/api/attendance/:path*',
    '/api/leaves/:path*',
    '/api/chatbot/:path*'
  ]
}

