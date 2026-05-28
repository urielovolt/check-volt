import { useState, useCallback } from 'react'
import type { SessionMode, CompletionStats } from './types'
import HomeScreen from './components/HomeScreen'
import SwipeSession from './components/SwipeSession'
import SessionComplete from './components/SessionComplete'

type AppView = 'home' | 'session' | 'complete'

interface AppState {
  view: AppView
  mode: SessionMode | null
  stats: CompletionStats | null
}

export default function App() {
  const [state, setState] = useState<AppState>({ view: 'home', mode: null, stats: null })
  const [sessionKey, setSessionKey] = useState(0)

  const handleStart = useCallback((mode: SessionMode) => {
    setState({ view: 'session', mode, stats: null })
  }, [])

  const handleComplete = useCallback((stats: CompletionStats) => {
    setState(prev => ({ ...prev, view: 'complete', stats }))
  }, [])

  const handleNewSession = useCallback(() => {
    if (!state.mode) return
    localStorage.removeItem(`checkvolt_session_${state.mode}`)
    setSessionKey(k => k + 1)
    setState({ view: 'session', mode: state.mode, stats: null })
  }, [state.mode])

  const handleHome = useCallback(() => {
    setState({ view: 'home', mode: null, stats: null })
  }, [])

  return (
    <div className="h-full w-full bg-bg overflow-hidden">
      {state.view === 'home' && (
        <HomeScreen onStart={handleStart} />
      )}

      {state.view === 'session' && state.mode && (
        <SwipeSession
          key={sessionKey}
          mode={state.mode}
          onComplete={handleComplete}
          onBack={handleHome}
        />
      )}

      {state.view === 'complete' && state.stats && (
        <SessionComplete
          stats={state.stats}
          onNewSession={handleNewSession}
          onHome={handleHome}
        />
      )}
    </div>
  )
}
