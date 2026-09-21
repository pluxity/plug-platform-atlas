import { Button } from '@plug-atlas/ui'
import { useState } from 'react'
import { useMicEvents } from '@/services/hooks/useMic'

export default function MicEvents({ vendorMicId }: { vendorMicId: string }) {
  const [page, setPage] = useState(1)
  const { data, error, isLoading, mutate } = useMicEvents(vendorMicId, page, 3)
  if (error) return <p role="alert" className="text-sm text-destructive">MIC 이벤트를 불러오지 못했습니다. <Button variant="link" onClick={() => void mutate()}>다시 시도</Button></p>
  if (isLoading) return <p role="status" className="text-sm text-muted-foreground">이벤트를 불러오는 중…</p>
  return <section className="space-y-2">
    <h3 className="font-medium">감지 이벤트</h3>
    <p className="text-xs text-muted-foreground">AI EDGE가 판단해 전달한 이벤트입니다.</p>
    {!data?.content.length ? <p className="text-sm text-muted-foreground">감지 이벤트가 없습니다.</p> : (
      <ul className="divide-y text-sm">{data.content.map(event => (
        <li key={event.id} className="space-y-1 py-2">
          <p>{event.labelNameKo || event.labelNameEn || event.labelId}</p>
          <p className="text-xs text-muted-foreground">발생 시각 · {event.occurredAt.replace('T', ' ')}</p>
          <p className="text-xs text-muted-foreground">장비 · {event.micName || event.micId}</p>
        </li>
      ))}</ul>
    )}
    <nav aria-label="감지 이벤트 페이지" className="flex items-center gap-3">
      <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>이전</Button>
      <span className="text-xs">{page} 페이지</span>
      <Button size="sm" variant="outline" disabled={!data || data.last} onClick={() => setPage(p => p + 1)}>다음</Button>
    </nav>
  </section>
}
