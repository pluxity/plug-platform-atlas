import { useEffect, useRef, useState } from 'react'

/** Page the device table to fit its available height without an inner scrollbar. */
export function useDevicePageSize() {
  const listRef = useRef<HTMLDivElement>(null)
  const [pageSize, setPageSize] = useState(5)
  useEffect(() => {
    const element = listRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setPageSize(Math.max(1, Math.min(10, Math.floor((entry.contentRect.height - 48) / 64))))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return { listRef, pageSize }
}
