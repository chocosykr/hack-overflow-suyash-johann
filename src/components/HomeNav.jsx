import React, { useState } from 'react';
import { Menu, X, User, Bell } from 'lucide-react';

export default function HomeNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Smart<span className="text-blue-600">Hostel</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Log out</a>
            
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              <button className="p-2 text-gray-400 hover:text-blue-600">
                <Bell size={20} />
              </button>
              <div className="flex items-center space-x-2 p-1 pr-3 rounded-full bg-gray-50 border border-gray-200">
                <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                  <User size={16} />
                </div>
                <span className="text-xs font-semibold text-gray-700">Student</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-1">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Issues</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Lost & Found</a>
        </div>
      )}
    </nav>
  );
}