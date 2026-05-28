export type SessionMode = 'compra' | 'venta'

export interface CheckItem {
  id: string
  name: string
  category: string
}

export interface HistoryEntry {
  itemId: string
  action: 'confirm' | 'skip'
  timestamp: string
}

export interface Session {
  id: string
  mode: SessionMode
  startedAt: string
  pending: string[]
  confirmed: string[]
  history: HistoryEntry[]
  totalItems: number
}

export interface CompletionStats {
  mode: SessionMode
  totalItems: number
  startedAt: string
  finishedAt: string
  totalSkips: number
}
