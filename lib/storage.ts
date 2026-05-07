import type { HistoryEntry, Hook } from '@/types'

const HISTORY_KEY = 'hooklab_history'
const FAVORITES_KEY = 'hooklab_favorites'
const MAX_HISTORY = 20

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function getHistory(): HistoryEntry[] {
  return read<HistoryEntry[]>(HISTORY_KEY, [])
}

export function addToHistory(entry: HistoryEntry): void {
  const existing = getHistory().filter((e) => e.id !== entry.id)
  const updated = [entry, ...existing].slice(0, MAX_HISTORY)
  write(HISTORY_KEY, updated)
}

export function deleteFromHistory(id: string): void {
  write(HISTORY_KEY, getHistory().filter((e) => e.id !== id))
}

export function getFavorites(): Hook[] {
  return read<Hook[]>(FAVORITES_KEY, [])
}

export function addFavorite(hook: Hook): void {
  const existing = getFavorites()
  if (existing.some((h) => h.id === hook.id)) return
  write(FAVORITES_KEY, [...existing, { ...hook, isFavorite: true }])
}

export function removeFavorite(hookId: string): void {
  write(FAVORITES_KEY, getFavorites().filter((h) => h.id !== hookId))
}

export function isFavorited(hookId: string): boolean {
  return getFavorites().some((h) => h.id === hookId)
}
