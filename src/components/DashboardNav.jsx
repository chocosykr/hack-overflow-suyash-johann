'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Search, User, Bell, LogOut } from 'lucide-react'
import { cn } from '../lib/utils' // Ensure this path matches your project
import { logoutAction } from '../app/actions/auth'

export default function DashboardNav({ role, userId }) {
  const pathname = usePathname()

  // Dynamic Home Link based on Role (The logic from Code A)
  const homeLink = role === 'STAFF' ? '/homepage/staff' : '/homepage/student'

  const navItems = [
    { name: 'Home', href: homeLink, icon: Home },
    { name: 'Lost & Found', href: '/homepage/search', icon: Search },
    { name: 'Report', href: '/homepage/create', icon: PlusCircle },
    { name: 'Notices', href: '/homepage/notices', icon: Bell },
    { name: 'Profile', href: '/homepage/profile', icon: User },
  ]

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r bg-white z-50">
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
            Hostel<span className="text-black">Mate</span>
          </h1>
          {role === 'STAFF' && (
            <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full uppercase font-bold">
              Staff
            </span>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Profile & Logout Section */}
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {role === 'STAFF' ? 'S' : 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-black truncate">User Session</span>
              <span className="text-xs truncate">{role} Mode</span>
            </div>
          </div>
          
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isCenter = item.href === '/homepage/create'

            if (isCenter) {
              return (
                <Link key={item.href} href={item.href} className="relative">
                  <div className="flex flex-col items-center justify-center -mt-8">
                    <div className="bg-blue-600 rounded-full p-4 shadow-lg text-white transform transition-transform active:scale-95 border-4 border-white">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-blue-600 uppercase tracking-tighter">Report</span>
                  </div>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1",
                  isActive ? "text-blue-600" : "text-gray-400"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}