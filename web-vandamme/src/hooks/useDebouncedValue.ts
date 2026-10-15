import { useEffect, useState } from 'react'

// Returns `value`, but only after it has stopped changing for `delayMs`.
//
// Example with delayMs = 300, the user types "abc" quickly:
//   value:     "a" → "ab" → "abc" ............ (300ms pass)
//   returned:  ""  →  ""  →  ""   ............ "abc"
//
// How: every change of `value` starts a 300ms timer. If `value` changes again
// before the timer fires, the cleanup cancels the old timer and a new one starts.
// Only the last timer gets to fire and update the returned value.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
