import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../lib/Utils'

// eslint-disable-next-line no-unused-vars
const StatsCard = ({ title, value, change, trend, icon: Icon, color }) => {
  return (
        <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-card-foreground">{value}</p>
        </div>
        <div className={cn('rounded-lg bg-secondary p-2.5', color)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
        <span className={cn(
          'text-sm font-medium',
          trend === 'up' ? 'text-success' : 'text-destructive'
        )}>
          {change}
        </span>
        <span className="text-sm text-muted-foreground">vs ayer</span>
      </div>
    </div>
  )
}

export default StatsCard
