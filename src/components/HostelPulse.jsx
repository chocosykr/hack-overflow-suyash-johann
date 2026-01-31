'use client'

import { Card, CardContent } from "./ui/card"
import { Wifi, Droplets, Zap, Utensils, AlertTriangle } from "lucide-react"
import { Badge } from "./ui/badge"

export default function HostelPulse() {
  // MOCK DATA: In a real app, this comes from an IoT API
  const services = [
    { name: "WiFi", status: "Online", icon: Wifi, color: "text-green-600", bg: "bg-green-100" },
    { name: "Water", status: "Flowing", icon: Droplets, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Power", status: "Stable", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-100" },
  ]

  const nextMeal = {
    type: "Lunch (12:30 PM)",
    menu: "Rajma Chawal & Curd",
    status: "Serving Now"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* 1. SERVICES STATUS */}
      <Card className="md:col-span-2 shadow-sm border-none bg-gradient-to-r from-slate-50 to-white">
        <CardContent className="p-4 flex items-center justify-around h-full">
          {services.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-600">{s.name}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{s.status}</p>
              </div>
            </div>
          ))}
          
          {/* Vertical Divider */}
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* SOS Trigger */}
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="p-3 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
             <div className="text-center">
                <p className="text-xs font-bold text-red-600">SOS</p>
                <p className="text-[10px] text-red-400">Emergency</p>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. MESS MENU */}
      <Card className="shadow-sm border-l-4 border-l-orange-400">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
             <Utensils className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <h3 className="font-semibold text-sm text-gray-900">{nextMeal.type}</h3>
               <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-green-100 text-green-700">
                 {nextMeal.status}
               </Badge>
            </div>
            <p className="text-sm text-gray-600 font-medium">{nextMeal.menu}</p>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}