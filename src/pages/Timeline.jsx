import React, { useState, useEffect } from 'react';
import { Clock, Filter, Trash2, Users, Phone, MessageSquare, Video } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Data and Helpers
import { getTimeline, clearTimeline } from '@/lib/storage';
import { cn } from '@/lib/utils';

// Helper to show the right icon for each interaction
const InteractionIcon = ({ type, size = 24 }) => {
  const iconClass = cn("object-contain", size === 24 ? "h-6 w-6" : "h-7 w-7");
  
  switch (type) {
    case 'Call': 
      return (
        <div className="flex items-center justify-center">
          <img 
            src="/assets/call.png" 
            alt="Call" 
            className={iconClass} 
            referrerPolicy="no-referrer" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <Phone className="hidden text-primary" size={size - 4} />
        </div>
      );
    case 'Text': 
      return (
        <div className="flex items-center justify-center">
          <img 
            src="/assets/text.png" 
            alt="Text" 
            className={iconClass} 
            referrerPolicy="no-referrer" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <MessageSquare className="hidden text-primary" size={size - 4} />
        </div>
      );
    case 'Video': 
      return (
        <div className="flex items-center justify-center">
          <img 
            src="/assets/video.png" 
            alt="Video" 
            className={iconClass} 
            referrerPolicy="no-referrer" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <Video className="hidden text-primary" size={size - 4} />
        </div>
      );
    case 'Meetup': 
      return <Users size={size} className="text-[#f59e0b] fill-[#f59e0b]/10" />;
    default: 
      return null;
  }
};

// Timeline Page - Shows a list of all interactions
export default function Timeline() {
  const [timeline, setTimeline] = useState([]);
  const [filter, setFilter] = useState('All');

  // Load timeline on mount
  useEffect(() => {
    const stored = getTimeline();
    setTimeline(stored);
  }, []);

  // Filter the timeline based on user selection
  const filteredTimeline = filter === 'All' 
    ? timeline 
    : timeline.filter(entry => entry.type === filter);

  /**
   * Clears the entire history
   */
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your entire timeline? This cannot be undone.')) {
      clearTimeline();
      setTimeline([]);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl space-y-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-[#1a4731]">Timeline</h1>
        
        <div className="flex items-center gap-4">
          {/* Simple Filter Dropdown */}
          <div className="relative w-full max-w-xs">
            <select 
              className="w-full h-10 px-4 rounded-md border border-muted/30 bg-background text-[13px] font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Interactions</option>
              <option value="Call">Calls</option>
              <option value="Text">Texts</option>
              <option value="Video">Videos</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <Filter size={14} />
            </div>
          </div>

          {/* Clear Button */}
          {timeline.length > 0 && (
            <Button variant="ghost" size="icon" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {filteredTimeline.map((entry, index) => (
          <div
            key={entry.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <Card className="border border-muted/10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all rounded-md overflow-hidden">
              <CardContent className="p-4 flex items-center gap-6">
                <div className="flex items-center justify-center shrink-0">
                  <InteractionIcon type={entry.type} size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] text-muted-foreground truncate">
                    <span className="font-bold text-[#1a4731]">{entry.type}</span> with {entry.friendName}
                  </h3>
                  <p className="text-[13px] font-medium text-muted-foreground/70">
                    {entry.date}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Empty State */}
        {filteredTimeline.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Clock size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-primary">No interactions found</h3>
              <p className="text-sm text-muted-foreground">Try changing your filter or log a new check-in.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
