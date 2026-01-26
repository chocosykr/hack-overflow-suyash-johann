'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Search, User, Megaphone } from 'lucide-react'
import { cn } from '../lib/utils' // Standard shadcn utility

const navItems = [
  { href: '/dashboard/student', label: 'Feed', icon: Home },
  { href: '/dashboard/search', label: 'Lost & Found', icon: Search },
  { href: '/dashboard/create', label: 'Report', icon: PlusCircle }, // Center button
  { href: '/dashboard/notices', label: 'Notices', icon: Megaphone },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <>
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r bg-white z-50">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Hostel<span className="text-black">Mate</span></h1>
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
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          {/* Add a Logout Button here later */}
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="flex flex-col">
              <span className="font-medium text-black">Student User</span>
              <span className="text-xs">Block A, Room 302</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isCenter = item.href === '/dashboard/create'

            if (isCenter) {
              return (
                <Link key={item.href} href={item.href}>
                  <div className="flex flex-col items-center justify-center -mt-6">
                    <div className="bg-blue-600 rounded-full p-4 shadow-lg text-white transform transition-transform active:scale-95">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-medium mt-1 text-gray-600">Report</span>
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
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}