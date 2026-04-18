'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface DayData {
  date: string
  count: number
  level: number // 0-4 for intensity
}

interface StreakHeatmapProps {
  data: DayData[]
  className?: string
}

export function StreakHeatmap({ data, className }: StreakHeatmapProps) {
  const getWeekday = (dateString: string) => {
    const date = new Date(dateString)
    return date.getDay()
  }

  const getMonthDay = (dateString: string) => {
    const date = new Date(dateString)
    return date.getDate()
  }

  const getIntensityColor = (level: number) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800',
      'bg-green-100 dark:bg-green-900/20',
      'bg-green-300 dark:bg-green-800/40',
      'bg-green-500 dark:bg-green-700/60',
      'bg-green-700 dark:bg-green-600/80',
    ]
    return colors[level] || colors[0]
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Group data by weeks
  const weeks: DayData[][] = []
  let currentWeek: DayData[] = []

  data.forEach((day, index) => {
    currentWeek.push(day)
    
    if (index % 7 === 6 || index === data.length - 1) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    weeks.push([...currentWeek])
  }

  // Fill remaining days to complete the grid
  while (weeks.length < 6) {
    weeks.push([])
  }

  // Ensure each week has 7 days
  weeks.forEach(week => {
    while (week.length < 7) {
      week.push({ date: '', count: 0, level: 0 })
    }
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Learning Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-muted-foreground px-8">
            {months.map((month, index) => (
              <span key={index} className="w-8 text-center">{month}</span>
            ))}
          </div>

          {/* Weekday labels */}
          <div className="flex space-x-1 text-xs text-muted-foreground">
            <div className="w-8"></div>
            {weekdays.map((day, index) => (
              <div key={index} className="w-8 text-center">{day}</div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex space-x-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "w-8 h-8 rounded-sm border border-border flex items-center justify-center text-xs",
                      getIntensityColor(day.level),
                      day.date ? "cursor-pointer hover:ring-2 hover:ring-ring" : ""
                    )}
                    title={day.date ? `${day.date}: ${day.count} tasks completed` : ''}
                  >
                    {day.date ? getMonthDay(day.date) : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4">
            <div className="flex items-center space-x-2">
              <span>Less</span>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn("w-3 h-3 rounded-sm border border-border", getIntensityColor(level))}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-foreground">
                {data.reduce((sum, day) => sum + day.count, 0)} total
              </span>
              <span className="text-muted-foreground ml-2">
                ({data.filter(day => day.count > 0).length} active days)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
