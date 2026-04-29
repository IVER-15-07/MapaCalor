// src/components/StatsCard.jsx
import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../lib/Utils'

const Card = ({ title, value, change, trend, icon: Icon, color }) => {
  // En un NOC (Network Operations Center), que las incidencias suban ('up') suele ser malo (rojo),
  // y que bajen ('down') suele ser bueno (verde).
  const isUp = trend === 'up'
  const trendColor = isUp ? 'text-rose-500' : 'text-emerald-500'
  const TrendIcon = isUp ? TrendingUp : TrendingDown

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      {/* Parte superior: Título e Ícono principal */}
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
          {title}
        </h3>
        {/* El contenedor del ícono usa una ligera opacidad del color principal (bg-secondary) */}
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-secondary", color)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Parte inferior: Valor grande y Porcentaje */}
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground tracking-tight">
          {value}
        </span>
        
        {/* Indicador de tendencia (verde o rojo dependiendo si sube o baja) */}
        <div className={cn("flex items-center gap-1 text-xs font-semibold", trendColor)}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>{change}</span>
          <span className="font-normal text-muted-foreground ml-1 hidden sm:inline">
            vs ayer
          </span>
        </div>
      </div>
    </div>
  )
}

export default Card