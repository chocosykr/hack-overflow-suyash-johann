'use client'

import { Card, CardContent } from "./ui/card"
import { Wifi, Droplets, Zap, Utensils, AlertTriangle } from "lucide-react"
import { Badge } from "./ui/badge"

export default function HostelPulse() {
  // MOCK DATA: In a real app, this comes from an IoT API
  const services = [
    { 
      name: "WiFi", 
      status: "Online", 
      icon: Wifi, 
      color: "text-green-600", 
      bg: "bg-gradient-to-br from-green-50 to-emerald-100",
      ring: "ring-green-200",
      glow: "shadow-green-200/50"
    },
    { 
      name: "Water", 
      status: "Flowing", 
      icon: Droplets, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-50 to-cyan-100",
      ring: "ring-blue-200",
      glow: "shadow-blue-200/50"
    },
    { 
      name: "Power", 
      status: "Stable", 
      icon: Zap, 
      color: "text-yellow-600", 
      bg: "bg-gradient-to-br from-yellow-50 to-amber-100",
      ring: "ring-yellow-200",
      glow: "shadow-yellow-200/50"
    },
  ]

  const nextMeal = {
    type: "Lunch",
    time: "12:30 PM",
    menu: "Rajma Chawal & Curd",
    status: "Serving Now"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      
      {/* 1. SERVICES STATUS - Enhanced with glassmorphism */}
      <Card className="lg:col-span-2 shadow-lg border-none bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <CardContent className="p-6 flex items-center justify-around h-full relative z-10">
          {services.map((s, index) => (
            <div 
              key={s.name} 
              className="flex flex-col items-center gap-3 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon with gradient background and hover effect */}
              <div className={`
                relative p-4 rounded-2xl ${s.bg} 
                ring-2 ${s.ring} ring-offset-2
                shadow-lg ${s.glow}
                transition-all duration-300
                group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3
              `}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
                
                {/* Pulse effect indicator */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 ${s.bg} rounded-full animate-ping`}></div>
                <div className={`absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full`}></div>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800 mb-0.5">{s.name}</p>
                <Badge 
                  variant="outline" 
                  className={`text-[10px] px-2 py-0.5 font-semibold ${s.color} bg-white border-current`}
                >
                  {s.status}
                </Badge>
              </div>
            </div>
          ))}
          
          {/* Elegant Vertical Divider */}
          <div className="hidden lg:flex flex-col items-center gap-1">
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* SOS Button - More prominent */}
          <div className="flex flex-col items-center gap-3 cursor-pointer group">
            <div className="
              relative p-4 rounded-2xl 
              bg-gradient-to-br from-red-50 to-pink-100
              ring-2 ring-red-200 ring-offset-2
              shadow-lg shadow-red-200/50
              transition-all duration-300
              group-hover:scale-110 group-hover:shadow-xl
              animate-pulse
            ">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              
              {/* Animated ripple effect */}
              <div className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping"></div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-bold text-red-600 mb-0.5">SOS</p>
              <Badge 
                variant="outline" 
                className="text-[10px] px-2 py-0.5 font-semibold text-red-600 bg-white border-red-400"
              >
                Emergency
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. MESS MENU - Enhanced card */}
      <Card className="shadow-lg border-none bg-gradient-to-br from-white to-orange-50/50 overflow-hidden relative">
        {/* Decorative left accent bar with gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600"></div>
        
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
        
        <CardContent className="p-5 flex items-start gap-4 relative z-10">
          {/* Icon with enhanced styling */}
          <div className="
            p-3 rounded-xl
            bg-gradient-to-br from-orange-100 to-orange-200
            ring-2 ring-orange-200 ring-offset-2
            shadow-md shadow-orange-200/50
            flex-shrink-0
          ">
            <Utensils className="w-6 h-6 text-orange-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header with meal type and status */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="font-bold text-base text-gray-900">{nextMeal.type}</h3>
                <p className="text-xs text-orange-600 font-semibold">{nextMeal.time}</p>
              </div>
              <Badge 
                className="text-[10px] px-2.5 py-1 font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none shadow-sm"
              >
                ✓ {nextMeal.status}
              </Badge>
            </div>
            
            {/* Menu */}
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              {nextMeal.menu}
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}