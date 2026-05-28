import { useState, useEffect, useCallback } from 'react'
import type { Session, SessionMode, CompletionStats } from '../types'
import { getItemsByMode } from '../data/items'

const STORAGE_KEY = (mode: SessionMode) => `checkvolt_session_${mode}`

function createNewSession(mode: SessionMode): Session {
  const items = getItemsByMode(mode)
  return {
    id: crypto.randomUUID(),
    mode,
    startedAt: new Date().toISOString(),
    pending: items.map(i => i.id),
    confirmed: [],
    history: [],
    totalItems: items.length,
  }
}

function loadSession(mode: SessionMode): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(mode))
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function hasActiveSession(mode: SessionMode): boolean {
  const session = loadSession(mode)
  if (!session) return false
  return session.pending.length > 0
}

export function useSession(mode: SessionMode) {
  const [session, setSession] = useState<Session>(() => {
    const saved = loadSession(mode)
    return saved ?? createNewSession(mode)
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY(mode), JSON.stringify(session))
  }, [session, mode])

  const confirmItem = useCallback((itemId: string) => {
    setSession(prev => ({
      ...prev,
      pending: prev.pending.slice(1),
      confirmed: [...prev.confirmed, itemId],
      history: [...prev.history, { itemId, action: 'confirm', timestamp: new Date().toISOString() }],
    }))
  }, [])

  const skipItem = useCallback((itemId: string) => {
    setSession(prev => ({
      ...prev,
      pending: [...prev.pending.slice(1), itemId],
      history: [...prev.history, { itemId, action: 'skip', timestamp: new Date().toISOString() }],
    }))
  }, [])

  const undoLastAction = useCallback(() => {
    setSession(prev => {
      if (prev.history.length === 0) return prev
      const last = prev.history[prev.history.length - 1]
      const newHistory = prev.history.slice(0, -1)

      if (last.action === 'confirm') {
        return {
          ...prev,
          pending: [last.itemId, ...prev.pending],
          confirmed: prev.confirmed.filter(id => id !== last.itemId),
          history: newHistory,
        }
      } else {
        return {
          ...prev,
          pending: [last.itemId, ...prev.pending.filter(id => id !== last.itemId)],
          history: newHistory,
        }
      }
    })
  }, [])

  const resetSession = useCallback(() => {
    const fresh = createNewSession(mode)
    setSession(fresh)
    localStorage.removeItem(STORAGE_KEY(mode))
  }, [mode])

  const getCompletionStats = useCallback((): CompletionStats => {
    const skips = session.history.filter(h => h.action === 'skip').length
    return {
      mode,
      totalItems: session.totalItems,
      startedAt: session.startedAt,
      finishedAt: new Date().toISOString(),
      totalSkips: skips,
    }
  }, [session, mode])

  const isComplete = session.pending.length === 0
  const currentItemId = session.pending[0] ?? null
  const nextItemId = session.pending[1] ?? null
  const canUndo = session.history.length > 0

  return {
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
  }
}
