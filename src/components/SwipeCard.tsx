import { useRef, useState, useCallback } from 'react'
import type { CheckItem } from '../types'
import { CATEGORY_COLORS } from '../data/items'

type SwipeDirection = 'confirm' | 'skip' | null

interface Props {
  item: CheckItem
  onSwipe: (direction: 'confirm' | 'skip') => void
  isNext?: boolean
  mode: 'compra' | 'venta'
}

const THRESHOLD = 90

export default function SwipeCard({ item, onSwipe, isNext = false, mode }: Props) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [exitDir, setExitDir] = useState<SwipeDirection>(null)
  const startX = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isNext) return
    startX.current = e.clientX
    setIsDragging(true)
    cardRef.current?.setPointerCapture(e.pointerId)
  }, [isNext])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    setDragX(e.clientX - startX.current)
  }, [isDragging])

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    if (dragX < -THRESHOLD) {
      setExitDir('confirm')
      setTimeout(() => onSwipe('confirm'), 300)
    } else if (dragX > THRESHOLD) {
      setExitDir('skip')
      setTimeout(() => onSwipe('skip'), 300)
    } else {
      setDragX(0)
    }
  }, [isDragging, dragX, onSwipe])

  const categoryColor = CATEGORY_COLORS[item.category] ?? '#6B7280'
  const rotation = isDragging ? dragX * 0.08 : 0
  const confirmOpacity = Math.min(1, Math.max(0, -dragX / THRESHOLD))
  const skipOpacity = Math.min(1, Math.max(0, dragX / THRESHOLD))

  const getTransformStyle = () => {
    if (exitDir === 'confirm') return { transform: 'translateX(-130vw) rotate(-25deg)', opacity: 0, transition: 'transform 0.35s ease-in, opacity 0.35s ease-in' }
    if (exitDir === 'skip') return { transform: 'translateX(130vw) rotate(25deg)', opacity: 0, transition: 'transform 0.35s ease-in, opacity 0.35s ease-in' }
    if (isNext) return { transform: 'scale(0.92)', opacity: 0.7, transition: 'none' }
    return {
      transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
      transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  }

  const confirmLabel = mode === 'compra' ? '✓ Comprado' : '✓ Listo'
  const skipLabel = mode === 'compra' ? '✗ Pendiente' : '✗ Falta'

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 m-auto w-[85vw] max-w-sm rounded-3xl shadow-2xl swipe-card ${!isNext ? 'card-enter' : ''}`}
      style={{
        height: 'min(460px, 70vh)',
        background: 'linear-gradient(160deg, #2A2A2A 0%, #1E1E1E 100%)',
        border: '1px solid #333',
        ...getTransformStyle(),
        zIndex: isNext ? 1 : 2,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Category badge */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
        >
          {item.category}
        </span>
      </div>

      {/* Confirm overlay — izquierda */}
      <div
        className="absolute inset-0 rounded-3xl flex items-center justify-end pr-8 pointer-events-none"
        style={{
          background: `linear-gradient(225deg, rgba(34,197,94,${confirmOpacity * 0.35}) 0%, transparent 60%)`,
          opacity: confirmOpacity,
        }}
      >
        <div className="border-4 border-success text-success font-black text-xl px-4 py-2 rounded-xl rotate-[15deg]">
          {confirmLabel}
        </div>
      </div>

      {/* Skip overlay — derecha */}
      <div
        className="absolute inset-0 rounded-3xl flex items-center justify-start pl-8 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(239,68,68,${skipOpacity * 0.35}) 0%, transparent 60%)`,
          opacity: skipOpacity,
        }}
      >
        <div className="border-4 border-danger text-danger font-black text-xl px-4 py-2 rounded-xl rotate-[-15deg]">
          {skipLabel}
        </div>
      </div>

      {/* Item content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center select-none">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl"
          style={{ backgroundColor: `${categoryColor}18` }}
        >
          {getCategoryEmoji(item.category)}
        </div>
        <h2 className="text-2xl font-bold text-white leading-tight mb-2">
          {item.name}
        </h2>
        <p className="text-muted text-sm">{item.category}</p>
      </div>

      {/* Bottom drag hint */}
      {!isNext && dragX === 0 && !isDragging && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
          <span className="text-muted text-xs opacity-60">← Listo</span>
          <span className="text-muted text-xs opacity-60">Pendiente →</span>
        </div>
      )}
    </div>
  )
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'Ingredientes': '🛍️',
    'Empaque': '📦',
    'Higiene': '🧤',
    'Equipo': '⚙️',
    'Utensilios': '🔪',
    'Misceláneos': '🔧',
    'Vestimenta': '👕',
  }
  return map[category] ?? '📋'
}
