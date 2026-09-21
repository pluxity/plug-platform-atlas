import { useEffect, useState } from 'react'
import { getRecentEventRange } from '../../lib/event-date-range'

export function useRecentEventRange() {
  const [range, setRange] = useState(() => getRecentEventRange())
  useEffect(() => {
    const update = () => {
      const next = getRecentEventRange()
      setRange(previous => previous.from === next.from ? previous : next)
    }
    const timer = window.setInterval(update, 30_000)
    window.addEventListener('focus', update)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', update)
    }
  }, [])
  return range
}
