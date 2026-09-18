import { useState } from 'react'
import { Badge, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui'
import { useLedBroadcasts } from '@/services/hooks/useLed'

export default function LedBroadcastHistory({ sites, isAdmin }: { sites: { id: number; name: string }[]; isAdmin: boolean }) {
  const [page, setPage] = useState(1)
  const [siteFilter, setSiteFilter] = useState('all')
  const selected = sites.some(site => String(site.id) === siteFilter) ? siteFilter : isAdmin ? 'all' : String(sites[0]?.id ?? '')
  const siteId = selected && selected !== 'all' ? Number(selected) : undefined
  const enabled = isAdmin || siteId != null
  const { data, error, isLoading, mutate } = useLedBroadcasts(page, siteId, enabled)
  return <section className="space-y-3 rounded-md border p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">전광판 송출 이력</h2><Button size="sm" variant="outline" disabled={!enabled} onClick={() => void mutate()}>이력 새로고침</Button></div>
    <Select value={selected} onValueChange={value => { setSiteFilter(value); setPage(1) }}><SelectTrigger aria-label="송출 이력 공원" className="w-48"><SelectValue placeholder="공원 선택" /></SelectTrigger><SelectContent>{isAdmin && <SelectItem value="all">전체 공원</SelectItem>}{sites.map(site => <SelectItem key={site.id} value={String(site.id)}>{site.name}</SelectItem>)}</SelectContent></Select>
    {!enabled && <p className="text-sm text-muted-foreground">조회 가능한 공원이 없습니다.</p>}
    {error ? <p role="alert" className="text-sm text-destructive">송출 이력을 불러오지 못했습니다.</p> : isLoading ? <p role="status">이력을 불러오는 중…</p> : <>
      {!data?.content.length ? <p className="text-sm text-muted-foreground">송출 이력이 없습니다.</p> : <ul className="divide-y">{data.content.map(item => <li key={item.id} className="space-y-1 py-3 text-sm">
        <div className="flex flex-wrap items-center gap-2"><Badge variant={item.success ? 'default' : 'destructive'}>{item.success ? '성공' : '실패'}</Badge><span>{item.displayName} · {item.siteName ?? '공원 미매핑'}</span><span className="text-xs text-muted-foreground">{item.broadcastAt} · {item.userName || item.userId}</span></div>
        <p className="whitespace-pre-wrap">{item.message}</p>{item.failureReason && <p className="text-destructive">{item.failureReason}</p>}
      </li>)}</ul>}
      <div className="flex items-center justify-end gap-3 text-sm"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>이전</Button><span>{page} 페이지</span><Button size="sm" variant="outline" disabled={!data || data.last} onClick={() => setPage(value => value + 1)}>다음</Button></div>
    </>}
  </section>
}
