// src/components/StatsCard.jsx
import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../lib/Utils'

const Card = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,

  size = 'md',
  showIcon = true,
  showTrend = true,
  header,           // 👈 opcional arriba
  className = '',
}) => {

  const isUp = trend === 'up'
  
  const TrendIcon = isUp ? TrendingUp : TrendingDown


  const sizeStyles = {
    sm: 'p-3 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg',
  }
  return (
    <div className={cn(
      "flex flex-col justify-between rounded-xl border border-border bg-card shadow-sm",
      sizeStyles[size],
      className
    )}>

      {/* 🔥 HEADER OPCIONAL */}
      {header && (
        <span className="text-xs uppercase text-muted-foreground mb-1">
          {header}
        </span>
      )}

      {/* 🔹 TOP */}
      <div className="flex items-start justify-between">

        <h3 className="text-muted-foreground">
          {title}
        </h3>

        {/* 🔥 ICONO OPCIONAL */}
        {showIcon && Icon && (
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-secondary", color)}>
            <Icon className="h-4 w-4" />
          </div>
        )}

      </div>

      {/* 🔹 VALUE */}
      {value && (
        <div className="mt-2 flex items-baseline gap-3">

          <span className="text-2xl font-bold text-foreground">
            {value}
          </span>

          {/* 🔥 TREND OPCIONAL */}
          {showTrend && change && (
            <span className="text-xs text-muted-foreground">
              {change}
            </span>
          )}

        </div>
      )}

    </div>
  )
}

export default Card