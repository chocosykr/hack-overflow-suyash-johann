"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from ".//ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Building2 } from "lucide-react";

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

  if (loading) return <p className="text-center">Loading announcements...</p>;

  if (notices.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">
        <p className="text-gray-500">No new announcements at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {notices.map((notice) => (
        <Card key={notice.id} className={notice.targetHostel ? 'border-l-4 border-l-blue-500' : ''}>
          {/* ... Rest of your existing Card UI code from the original NoticesPage ... */}
          <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <CardTitle className="text-lg font-semibold leading-none">
                                {notice.title}
                              </CardTitle>
                              {notice.targetHostelId && (
                                <Badge variant="secondary" className="mt-2 text-xs font-normal">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  Hostel Specific
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center bg-gray-100 px-2 py-1 rounded">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(notice.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {notice.content}
                          </p>
                        </CardContent>
                        
                        <CardFooter className="pt-0 pb-4">
                          <p className="text-xs text-muted-foreground italic">
                            Posted by Administration
                          </p>
                        </CardFooter>
        </Card>
      ))}
    </div>
  );
}