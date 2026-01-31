'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Search, User, Bell, LogOut, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { logoutAction } from '../app/actions/auth'

export default function DashboardNav({ role, userId }) {
  const pathname = usePathname()

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
      {/* DESKTOP SIDEBAR - Enhanced Design */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/50 z-50 shadow-xl">
        
        {/* Header with Gradient Background */}
        <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Hostel<span className="text-blue-100">Mate</span>
            </h1>
            {role === 'STAFF' && (
              <span className="text-[10px] bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full uppercase font-bold shadow-md">
                Staff
              </span>
            )}
          </div>
          <p className="text-xs text-blue-100 mt-2 font-medium">Issue Tracking System</p>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]" 
                    : "text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.01]"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                )}
                
                <div className="flex items-center gap-3 z-10">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-gray-100 group-hover:bg-blue-50"
                  )}>
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      isActive ? "text-white" : "text-gray-600 group-hover:text-blue-600"
                    )} />
                  </div>
                  <span>{item.name}</span>
                </div>
                
                {/* Chevron indicator */}
                <ChevronRight className={cn(
                  "w-4 h-4 transition-all",
                  isActive 
                    ? "text-white opacity-100 translate-x-0" 
                    : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                )} />
              </Link>
            )
          })}
        </nav>

        {/* Profile & Logout Section - Enhanced */}
        <div className="p-4 border-t border-blue-100 bg-white/50 backdrop-blur-sm space-y-3">
          
          {/* User Profile Card */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              {role === 'STAFF' ? 'S' : 'U'}
            </div>
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="font-bold text-gray-900 truncate text-sm">User Session</span>
              <span className="text-xs text-gray-600 truncate font-medium">{role} Mode</span>
            </div>
          </div>
          
          {/* Logout Button */}
          <form action={logoutAction}>
            <button className="flex w-full items-center justify-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30 group">
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV - Enhanced */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50 pb-safe shadow-[0_-2px_20px_rgba(0,0,0,0.08)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isCenter = item.href === '/homepage/create'

            if (isCenter) {
              return (
                <Link key={item.href} href={item.href} className="relative flex-1 flex justify-center">
                  <div className="flex flex-col items-center justify-center -mt-10">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full p-4 shadow-2xl shadow-blue-500/40 text-white transform transition-all active:scale-95 border-4 border-white hover:shadow-blue-500/60 hover:scale-105">
                      <PlusCircle className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 uppercase tracking-tight">
                      Report
                    </span>
                  </div>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center h-full space-y-1 transition-all duration-200 relative",
                  isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute top-0 w-1 h-1 rounded-full bg-blue-600 animate-pulse"></div>
                )}
                
                <div className={cn(
                  "p-2 rounded-lg transition-all",
                  isActive && "bg-blue-50 scale-110"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "fill-current"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-semibold",
                  isActive && "text-blue-600"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}