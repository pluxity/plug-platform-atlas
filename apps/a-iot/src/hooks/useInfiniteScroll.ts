import { useEffect, useRef, useState } from 'react'

export function useInfiniteScroll({ hasMore, loading, error, onLoadMore }: {
  hasMore: boolean; loading: boolean; error: unknown; onLoadMore: () => Promise<unknown>
}) {
  const root = useRef<HTMLDivElement>(null)
  const pending = useRef(false)
  const [requesting, setRequesting] = useState(false)
  const lastRequest = useRef(0)
  const lastScrollTop = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [hasMore, loading, error, onLoadMore])
  const loadNext = async () => {
    if (!hasMore || loading || error || pending.current || Date.now() - lastRequest.current < 1000) return
    pending.current = true
    lastRequest.current = Date.now()
    setRequesting(true)
    try { await onLoadMore() } catch { /* Query owns error reporting. */ }
    finally { pending.current = false; setRequesting(false) }
  }
  const schedule = (down: boolean) => {
    clearTimeout(timer.current)
    const element = root.current
    if (!down || !element || element.scrollHeight - element.scrollTop - element.clientHeight > 100) return
    timer.current = setTimeout(() => { void loadNext() }, 150)
  }
  return {
    root, requesting,
    onScroll: () => {
      const top = root.current?.scrollTop ?? 0
      schedule(top > lastScrollTop.current)
      lastScrollTop.current = top
    },
    onWheel: (event: { deltaY: number }) => schedule(event.deltaY > 0),
  }
}
