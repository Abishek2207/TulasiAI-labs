'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  iconColor = 'text-blue-500',
  className 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-500'
      case 'decrease': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconColor)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn("text-xs", getChangeColor())}>
            <span className="flex items-center">
              {changeType === 'increase' && <span>↑</span>}
              {changeType === 'decrease' && <span>↓</span>}
              <span className="ml-1">{change}</span>
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
