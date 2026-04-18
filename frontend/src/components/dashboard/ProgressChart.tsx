'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BarChart3, TrendingUp } from 'lucide-react'

interface ProgressChartProps {
  data: {
    day: string
    hours: number
    tasks: number
  }[]
  className?: string
}

export function ProgressChart({ data, className }: ProgressChartProps) {
  const maxHours = Math.max(...data.map(d => d.hours))
  const maxTasks = Math.max(...data.map(d => d.tasks))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Hours Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">Learning Hours</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="mr-1">This week: 14h</span>
                <TrendingUp className="h-3 w-3 text-green-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              {data.map((day, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 text-xs text-muted-foreground text-right">
                    {day.day.substring(5)}
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-secondary rounded-full relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${(day.hours / maxHours) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-xs text-muted-foreground text-left">
                    {day.hours}h
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">Tasks Completed</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="mr-1">This week: 12</span>
                <TrendingUp className="h-3 w-3 text-green-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              {data.map((day, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 text-xs text-muted-foreground text-right">
                    {day.day.substring(5)}
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-secondary rounded-full relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${(day.tasks / maxTasks) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-xs text-muted-foreground text-left">
                    {day.tasks}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Line */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Weekly Goal</span>
              <span className="text-sm font-medium text-foreground">21h / 15 tasks</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: '67%' }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
