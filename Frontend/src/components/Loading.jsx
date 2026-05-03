import React from 'react'
import { Loader2, X } from 'lucide-react'

const Loading = ({
  text = 'Cargando...',
  fullScreen = false,
  onCancel
}) => {
  return (
    <div
      className={`
        flex items-center justify-center
        ${fullScreen ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : 'w-full py-10'}
      `}
    >
      <div className="flex flex-col items-center gap-4">

        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <p className="text-sm text-muted-foreground">{text}</p>

        {/* 🔥 BOTÓN PARA NO QUEDAR BLOQUEADO */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs hover:bg-secondary"
          >
            <X className="h-3 w-3" />
            Cancelar
          </button>
        )}

      </div>
    </div>
  )
}

export default Loading