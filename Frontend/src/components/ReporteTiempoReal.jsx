/**
 * Componente: Reporte en Tiempo Real
 * Muestra estado actual, modo crítico/normal y reportes en vivo
 */

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Zap, Clock } from 'lucide-react'
import { cn } from '../../lib/Utils'

export function ReporteTiempoReal({ stats, realtimeData, onAddReport }) {
  const { currentIncidents, isCritical, mode, percentToLimit, limitThreshold } = stats || {}

  return (
    <div className="space-y-6">
      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Modo Actual */}
        <div className={cn(
          'rounded-lg border-2 p-4 transition-all',
          isCritical 
            ? 'border-destructive bg-destructive/10' 
            : 'border-success bg-success/10'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Estado del Sistema</p>
              <p className={cn(
                'text-2xl font-bold',
                isCritical ? 'text-destructive' : 'text-success'
              )}>
                {mode}
              </p>
            </div>
            {isCritical ? (
              <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
            ) : (
              <CheckCircle className="h-8 w-8 text-success" />
            )}
          </div>
        </div>

        {/* Incidentes Actuales */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Incidentes Hoy</p>
              <p className="text-2xl font-bold text-foreground">{currentIncidents}</p>
            </div>
            <Zap className="h-8 w-8 text-warning" />
          </div>
        </div>

        {/* Límite Crítico */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Límite Crítico</p>
              <p className="text-2xl font-bold text-foreground">{limitThreshold}</p>
            </div>
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        {/* Porcentaje */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Proximidad</p>
              <p className={cn(
                'text-2xl font-bold',
                percentToLimit > 75 ? 'text-destructive' : 'text-warning'
              )}>
                {percentToLimit}%
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
              <div 
                className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground"
                style={{ 
                  background: `conic-gradient(from 0deg, var(--color-primary) ${percentToLimit}%, var(--color-secondary) 0deg)`
                }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Progreso a Modo Crítico</span>
            <span className={cn(
              'font-semibold',
              percentToLimit > 75 ? 'text-destructive' : 'text-warning'
            )}>
              {currentIncidents} / {limitThreshold}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all rounded-full',
                percentToLimit > 75 ? 'bg-destructive' : 'bg-warning'
              )}
              style={{ width: `${percentToLimit}%` }}
            />
          </div>
        </div>
      </div>

      {/* Reportes en Vivo */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <h3 className="text-lg font-semibold text-foreground">Reportes en Vivo</h3>
        </div>
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {realtimeData && realtimeData.length > 0 ? (
            realtimeData.map((report) => (
              <div key={report.id} className="p-4 hover:bg-secondary/50 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{report.tipo || 'Incidente'}</p>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        report.status === 'crítico'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-success/20 text-success'
                      )}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.zona || 'Sin zona'}</p>
                    <p className="text-xs text-muted-foreground mt-1">{report.timestamp}</p>
                  </div>
                  {report.coordenadas && (
                    <div className="text-xs text-muted-foreground text-right">
                      <p>{report.coordenadas}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Sin reportes en tiempo real
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
