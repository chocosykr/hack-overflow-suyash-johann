"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Building2, Bell, Loader2, AlertCircle, Megaphone } from "lucide-react";

export default function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Loading State - Enhanced
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-orange-600" />
          </div>
          <Loader2 className="w-20 h-20 text-orange-500 animate-spin absolute -inset-2" />
        </div>
        <p className="text-gray-600 font-medium">Loading announcements...</p>
      </div>
    );
  }

  // Empty State - Enhanced
  if (notices.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Announcements</h3>
        <p className="text-gray-500">Check back later for new notices and updates</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {notices.map((notice, index) => {
        const isHostelSpecific = notice.targetHostelId;
        const isRecent = (new Date() - new Date(notice.createdAt)) < 7 * 24 * 60 * 60 * 1000; // 7 days
        
        return (
          <Card 
            key={notice.id} 
            className={`
              transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
              ${isHostelSpecific 
                ? 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-white' 
                : 'border-l-4 border-l-orange-500 bg-white'
              }
              ${isRecent ? 'ring-2 ring-orange-200 ring-offset-2' : ''}
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  {/* Title with Icon */}
                  <div className="flex items-start gap-3">
                    <div className={`
                      p-2 rounded-lg mt-0.5
                      ${isHostelSpecific 
                        ? 'bg-blue-100' 
                        : 'bg-orange-100'
                      }
                    `}>
                      <Megaphone className={`
                        w-4 h-4
                        ${isHostelSpecific ? 'text-blue-600' : 'text-orange-600'}
                      `} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 leading-tight mb-2">
                        {notice.title}
                      </CardTitle>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isRecent && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 text-xs font-bold px-2 py-0.5">
                            🆕 New
                          </Badge>
                        )}
                        
                        {isHostelSpecific && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 text-xs font-semibold px-2.5 py-0.5">
                            <Building2 className="w-3 h-3 mr-1" />
                            Hostel Specific
                          </Badge>
                        )}
                        
                        {!isHostelSpecific && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs font-semibold px-2.5 py-0.5">
                            📢 All Hostels
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Date Badge */}
                <div className="flex-shrink-0">
                  <div className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg text-center">
                    <Calendar className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    <span className="text-xs font-bold text-gray-700 block">
                      {new Date(notice.createdAt).toLocaleDateString('en-GB', { 
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              {/* Content */}
              <div className={`
                p-4 rounded-xl border-l-2
                ${isHostelSpecific 
                  ? 'bg-blue-50/50 border-l-blue-300' 
                  : 'bg-orange-50/50 border-l-orange-300'
                }
              `}>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 pb-4 flex items-center justify-between border-t bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Posted by <span className="font-bold text-gray-900">Administration</span>
                </p>
              </div>
              
              {/* Time Ago */}
              <p className="text-xs text-gray-500 italic">
                {getTimeAgo(notice.createdAt)}
              </p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

// Helper function to show "time ago"
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hour" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minute" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  
  return "Just now";
}