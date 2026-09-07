import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  DataTable,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@plug-atlas/ui'
import type { Column } from '@plug-atlas/ui'
import { useAnnouncements } from '../../../services/hooks/useAnnouncement'
import { useSites } from '../../../services/hooks/useSite'
import type { Announcement } from '../../../services/types/announcement'
import { useSiteAccess } from '../../../hooks/useSiteAccess'
import { TablePagination } from '../../../components/elements/Pagination'

const PAGE_SIZE = 10
const ALL_SITES = 'all'

export default function AnnouncementHistory() {
  const access = useSiteAccess()
  const { data: sites } = useSites()

  /** 접근 권한이 있는 공원만 필터 선택지로 준다 */
  const selectableSites = useMemo(
    () => (sites ?? []).filter((site) => access.canAccessSite(site.id)),
    [sites, access],
  )

  /**
   * 비관리자는 "전체" 를 고를 수 없다.
   * 서버가 siteId 없이 부르면 전 공원 이력을 돌려주기 때문이다.
   */
  const [siteFilter, setSiteFilter] = useState<string>(ALL_SITES)
  const [page, setPage] = useState(1)

  // 권한 있는 공원이 정해지면 비관리자의 기본 선택을 첫 공원으로 맞춘다
  useEffect(() => {
    if (access.isAdmin) return
    if (siteFilter === ALL_SITES && selectableSites.length > 0) {
      setSiteFilter(String(selectableSites[0]!.id))
    }
  }, [access.isAdmin, siteFilter, selectableSites])

  const siteId = siteFilter === ALL_SITES ? undefined : Number(siteFilter)

  // 비관리자인데 아직 공원이 안 정해졌으면 조회를 미룬다(전체 조회 방지)
  const ready = access.isAdmin || siteId != null

  const { announcements, totalElements, totalPages, isLoading, mutate } = useAnnouncements(
    { page, size: PAGE_SIZE, siteId },
    { revalidateOnFocus: false, enabled: ready },
  )

  useEffect(() => {
    setPage(1)
  }, [siteFilter])

  const columns: Column<Announcement>[] = [
    {
      key: 'createdAt',
      header: '송출 시각',
      cell: (value) => (
        <span className="whitespace-nowrap text-sm">
          {String(value).replace('T', ' ').slice(0, 19)}
        </span>
      ),
    },
    {
      key: 'site',
      header: '공원',
      cell: (value) => {
        const site = value as Announcement['site']
        return <span className="whitespace-nowrap text-sm">{site?.name ?? '-'}</span>
      },
    },
    {
      key: 'message',
      header: '메시지',
      cell: (value) => (
        <span className="whitespace-pre-wrap text-sm">{String(value).trim()}</span>
      ),
    },
    {
      key: 'userId',
      header: '송출자',
      cell: (value) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">{String(value)}</span>
      ),
    },
  ]

  if (!access.hasAnyAccess) {
    return (
      <Alert>
        <AlertDescription>
          {access.isUnresolved
            ? '공원 접근 권한 정보를 확인할 수 없습니다. 관리자에게 권한 설정을 문의하세요.'
            : '접근 권한이 있는 공원이 없습니다. 관리자에게 문의하세요.'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">안내방송 송출 이력</h1>
          <p className="text-sm text-muted-foreground">
            공원별 안내방송 송출 기록입니다. 총 {totalElements}건
          </p>
        </div>
        <Badge variant="outline" className="shrink-0">
          실제 데이터
        </Badge>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="site-filter" className="text-xs text-muted-foreground">
            공원
          </Label>
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger id="site-filter" className="w-56">
              <SelectValue placeholder="공원 선택" />
            </SelectTrigger>
            <SelectContent>
              {access.isAdmin && <SelectItem value={ALL_SITES}>전체</SelectItem>}
              {selectableSites.map((site) => (
                <SelectItem key={site.id} value={String(site.id)}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={() => mutate()} disabled={isLoading}>
          <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/*
        ⚠️ 이 공원 필터는 화면 편의일 뿐 보안 경계가 아니다.
        GET /announcements 에 인증이 걸려 있지 않아(POST 는 403) 누구나 전 공원
        이력을 직접 조회할 수 있다. 실제 차단은 백엔드에서 해야 한다.
      */}

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">불러오는 중…</p>
        ) : announcements.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">송출 이력이 없습니다.</p>
        ) : (
          <DataTable data={announcements} columns={columns} />
        )}
      </div>

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  )
}
