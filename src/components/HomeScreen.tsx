import { useEffect, useState } from 'react'
import type { SessionMode } from '../types'
import { hasActiveSession } from '../hooks/useSession'

interface Props {
  onStart: (mode: SessionMode) => void
}

export default function HomeScreen({ onStart }: Props) {
  const [activeCompra, setActiveCompra] = useState(false)
  const [activeVenta, setActiveVenta] = useState(false)

  useEffect(() => {
    setActiveCompra(hasActiveSession('compra'))
    setActiveVenta(hasActiveSession('venta'))
  }, [])

  return (
    <div className="flex flex-col items-center justify-between h-full bg-bg px-6 py-safe">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 -mt-8">
        {/* Logo */}
        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl mb-2">
          <svg width="96" height="96" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoBg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1E1E1E"/>
                <stop offset="100%" stopColor="#080808"/>
              </linearGradient>
              <radialGradient id="logoOrb" cx="50%" cy="42%" r="55%">
                <stop offset="0%" stopColor="#FB923C"/>
                <stop offset="100%" stopColor="#C2410C"/>
              </radialGradient>
            </defs>
            <rect width="512" height="512" rx="108" fill="url(#logoBg)"/>
            <circle cx="256" cy="244" r="168" fill="url(#logoOrb)"/>
            <ellipse cx="210" cy="175" rx="80" ry="50" fill="white" opacity="0.12"/>
            <path d="M148 248 L228 328 L372 168"
                  stroke="white" strokeWidth="52"
                  strokeLinecap="round" strokeLinejoin="round"
                  fill="none"/>
            <g transform="translate(342,360) scale(0.9)" opacity="0.92">
              <polygon points="28,0 8,46 22,46 0,88 46,38 32,38 54,0" fill="white"/>
            </g>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Check Volt</h1>
        <p className="text-muted text-sm">Crepería María</p>
      </div>

      {/* Mode buttons */}
      <div className="w-full max-w-sm flex flex-col gap-4 mb-12">
        <button
          onClick={() => onStart('compra')}
          className="w-full rounded-2xl bg-primary active:bg-primary-dark transition-all duration-150 active:scale-95 overflow-hidden"
        >
          <div className="px-6 py-5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">Día de Compra</span>
              <span className="text-2xl">🛒</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-orange-200 opacity-90">29 productos</span>
              {activeCompra && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                  Sesión activa
                </span>
              )}
            </div>
          </div>
        </button>

        <button
          onClick={() => onStart('venta')}
          className="w-full rounded-2xl bg-surface border border-card-border active:bg-card transition-all duration-150 active:scale-95 overflow-hidden"
        >
          <div className="px-6 py-5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">Salir a Venta</span>
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted">42 artículos</span>
              {activeVenta && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                  Sesión activa
                </span>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-1 pb-4">
        <p className="text-muted text-xs text-center">
          Desliza ← para confirmar · Desliza → para dejar pendiente
        </p>
        <p className="text-xs" style={{ color: '#3f3f3f' }}>
          Desarrollado por{' '}
          <span className="font-semibold" style={{ color: '#4a4a4a' }}>@urielovolt</span>
        </p>
      </div>
    </div>
  )
}
