import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import type { CompletionStats } from '../types'

interface Props {
  stats: CompletionStats
  onNewSession: () => void
  onHome: () => void
}

function formatDuration(startedAt: string, finishedAt: string): string {
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime()
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds}s`
}

export default function SessionComplete({ stats, onNewSession, onHome }: Props) {
  const modeLabel = stats.mode === 'compra' ? 'Día de Compra' : 'Salida a Venta'
  const duration = formatDuration(stats.startedAt, stats.finishedAt)

  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#F97316', '#FB923C', '#22C55E', '#FBBF24', '#ffffff'],
        scalar: 1.1,
      })
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="screen-enter flex flex-col items-center justify-between h-full bg-bg px-6 pb-safe pb-8 pt-safe pt-12">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* Check animation */}
        <div className="check-pop w-28 h-28 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mb-4">
          <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white text-center">¡Todo listo!</h1>
        <p className="text-muted text-center text-base">
          Completaste el checklist de<br />
          <span className="text-primary font-semibold">{modeLabel}</span>
        </p>

        {/* Stats */}
        <div className="w-full max-w-xs bg-surface rounded-2xl border border-card-border p-4 mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
            <p className="text-muted text-xs mt-0.5">artículos</p>
          </div>
          <div className="border-x border-card-border">
            <p className="text-2xl font-bold text-primary">{duration}</p>
            <p className="text-muted text-xs mt-0.5">tiempo</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalSkips}</p>
            <p className="text-muted text-xs mt-0.5">vueltas extra</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs flex flex-col gap-3 mt-8">
        <button
          onClick={onNewSession}
          className="w-full py-4 rounded-2xl bg-primary active:bg-primary-dark text-white font-bold text-lg transition-all active:scale-95"
        >
          Nueva sesión
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 rounded-2xl bg-surface border border-card-border text-white font-semibold text-base transition-all active:scale-95 active:bg-card"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  )
}
