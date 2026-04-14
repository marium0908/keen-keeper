import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';

// UI Components
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';

// Data and Helpers
import { getTimeline } from '@/lib/storage';

/**
 * Stats Page - Shows analytics about friend interactions.
 */
export default function Stats() {
  const [timeline, setTimeline] = useState([]);

  // Load timeline data on mount
  useEffect(() => {
    const stored = getTimeline();
    setTimeline(stored);
  }, []);

  // Group interactions by type for the chart
  const typeCounts = timeline.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1;
    return acc;
  }, {});

  // Format data for Recharts
  const chartData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  
  // Colors from Figma design: Purple, Dark Green, Green, Amber
  const COLORS = {
    'Text': '#a855f7',
    'Call': '#1a4731',
    'Video': '#22c55e',
    'Meetup': '#f59e0b'
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 max-w-5xl space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-[#1a4731]">Friendship Analytics</h1>
        <p className="text-muted-foreground">Visualizing how you connect with your friends.</p>
      </div>

      <Card className="border border-muted/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
        <CardHeader className="pb-0">
          <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Interactions by Type
          </CardDescription>
        </CardHeader>
        
        <CardContent className="h-[500px] flex flex-col items-center justify-center">
          {chartData.length > 0 ? (
            <>
              {/* Donut Chart */}
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Custom Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
                {chartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[entry.name] || '#cbd5e1' }} />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <p className="font-medium">No data to display yet.</p>
              <p className="text-sm">Log some interactions on a friend's page to see stats!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
