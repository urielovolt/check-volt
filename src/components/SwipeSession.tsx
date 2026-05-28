import { useState, useCallback, useEffect } from 'react'
import type { SessionMode, CompletionStats } from '../types'
import { useSession } from '../hooks/useSession'
import { getItemById } from '../data/items'
import { useHaptic } from '../hooks/useHaptic'
import SwipeCard from './SwipeCard'

interface Props {
  mode: SessionMode
  onComplete: (stats: CompletionStats) => void
  onBack: () => void
}

export default function SwipeSession({ mode, onComplete, onBack }: Props) {
  const {
    session,
    currentItemId,
    nextItemId,
    isComplete,
    canUndo,
    confirmItem,
    skipItem,
    undoLastAction,
    resetSession,
    getCompletionStats,
  } = useSession(mode)

  const [cardKey, setCardKey] = useState(0)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const haptic = useHaptic()

  const handleSwipe = useCallback((direction: 'confirm' | 'skip') => {
    if (!currentItemId) return
    if (direction === 'confirm') confirmItem(currentItemId)
    else skipItem(currentItemId)
    setCardKey(k => k + 1)
  }, [currentItemId, confirmItem, skipItem])

  const handleUndo = useCallback(() => {
    haptic.undo()
    undoLastAction()
    setCardKey(k => k + 1)
  }, [undoLastAction, haptic])

  useEffect(() => {
    if (isComplete) onComplete(getCompletionStats())
  }, [isComplete, onComplete, getCompletionStats])

  const confirmedCount = session.confirmed.length
  const totalItems = session.totalItems
  const progress = totalItems > 0 ? (confirmedCount / totalItems) * 100 : 0

  const modeLabel = mode === 'compra' ? 'Día de Compra' : 'Salir a Venta'
  const currentItem = currentItemId ? getItemById(currentItemId, mode) : null
  const nextItem = nextItemId ? getItemById(nextItemId, mode) : null

  const pendingCount = session.pending.length
  const isOnSecondRound = confirmedCount > 0 && pendingCount > 0 && pendingCount < totalItems

  return (
    <div className="screen-enter flex flex-col h-full bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-3 pb-3 border-b border-card-border">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface text-muted active:bg-card transition-colors"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-white font-semibold text-sm">{modeLabel}</p>
          <p className="text-muted text-xs">{confirmedCount} / {totalItems} confirmados</p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface text-muted active:bg-card transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-surface mx-0">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Second round badge */}
      {isOnSecondRound && (
        <div className="flex justify-center pt-3">
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
            Vuelta {Math.floor(session.history.length / totalItems) + 1} · {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Card stack area */}
      <div className="flex-1 relative flex items-center justify-center">
        {nextItem && (
          <SwipeCard
            key={`next-${nextItem.id}-${cardKey}`}
            item={nextItem}
            onSwipe={handleSwipe}
            isNext
            mode={mode}
          />
        )}
        {currentItem && (
          <SwipeCard
            key={`current-${currentItem.id}-${cardKey}`}
            item={currentItem}
            onSwipe={handleSwipe}
            mode={mode}
          />
        )}
        {!currentItem && !isComplete && (
          <div className="text-muted text-center p-8">Cargando...</div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between px-8 pb-safe pb-6 pt-4">
        {/* Confirm button */}
        <button
          onClick={() => { haptic.confirm(); handleSwipe('confirm') }}
          className="w-14 h-14 rounded-full bg-success flex items-center justify-center active:opacity-80 transition-all active:scale-90 shadow-lg"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Undo button */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="w-10 h-10 rounded-full bg-surface border border-card-border flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        {/* Skip button */}
        <button
          onClick={() => { haptic.skip(); handleSwipe('skip') }}
          className="w-14 h-14 rounded-full bg-surface border border-card-border flex items-center justify-center active:bg-card transition-all active:scale-90 shadow-lg"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div
          className="absolute inset-0 bg-black/70 flex items-end justify-center z-50"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-surface rounded-t-3xl p-6 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-lg text-center mb-2">¿Reiniciar sesión?</h3>
            <p className="text-muted text-sm text-center mb-6">
              Se perderá el progreso actual y comenzará una nueva sesión con todos los artículos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-card text-white font-semibold active:opacity-70"
              >
                Cancelar
              </button>
              <button
                onClick={() => { resetSession(); setShowResetConfirm(false); setCardKey(k => k + 1) }}
                className="flex-1 py-3 rounded-2xl bg-danger text-white font-semibold active:opacity-70"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
