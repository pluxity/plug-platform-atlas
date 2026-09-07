import { useMemo } from 'react'
import { Badge, Checkbox, Label } from '@plug-atlas/ui'
import type { LedPanel, LedPanelStatus } from '../../../../../services/types/led'

const STATUS_META: Record<LedPanelStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  ONLINE: { label: '정상', variant: 'default' },
  OFFLINE: { label: '오프라인', variant: 'destructive' },
  UNKNOWN: { label: '알 수 없음', variant: 'secondary' },
}

interface LedTargetSelectorProps {
  panels: LedPanel[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
  disabled?: boolean
}

/**
 * 송출 대상 선택 — 공원 단위 일괄 선택과 개별 전광판 선택을 함께 제공한다.
 *
 * 넘겨받는 panels 는 이미 권한 필터를 거친 목록이다(접근 가능한 공원만).
 * 이 컴포넌트는 권한을 다시 판단하지 않는다.
 */
export function LedTargetSelector({
  panels,
  selectedIds,
  onChange,
  disabled = false,
}: LedTargetSelectorProps) {
  const groups = useMemo(() => groupBySite(panels), [panels])
  const selected = useMemo(() => new Set(selectedIds), [selectedIds])

  const toggleOne = (panelId: number) => {
    const next = new Set(selected)
    if (next.has(panelId)) next.delete(panelId)
    else next.add(panelId)
    onChange([...next])
  }

  const toggleSite = (sitePanels: LedPanel[], allSelected: boolean) => {
    const next = new Set(selected)
    for (const panel of sitePanels) {
      if (allSelected) next.delete(panel.id)
      else next.add(panel.id)
    }
    onChange([...next])
  }

  if (panels.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        선택할 수 있는 전광판이 없습니다.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {groups.map(({ siteId, siteName, sitePanels }) => {
        const selectedCount = sitePanels.filter((p) => selected.has(p.id)).length
        const allSelected = selectedCount === sitePanels.length

        return (
          <div key={siteId} className="rounded-md border">
            <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
              {/*
                부분 선택에 Radix 의 indeterminate 를 쓰지 않는다.
                이 Checkbox 의 Indicator 는 indeterminate 에서도 체크 아이콘을 그려서
                전체 선택과 구분이 안 된다. 대신 옆의 "2/4" 개수로 표시한다.
              */}
              <Checkbox
                id={`site-${siteId}`}
                disabled={disabled}
                checked={allSelected}
                onCheckedChange={() => toggleSite(sitePanels, allSelected)}
              />
              <Label htmlFor={`site-${siteId}`} className="flex-1 cursor-pointer font-semibold">
                {siteName}
              </Label>
              <span
                className={
                  selectedCount > 0
                    ? 'text-xs font-medium text-primary'
                    : 'text-xs text-muted-foreground'
                }
              >
                {selectedCount}/{sitePanels.length}
              </span>
            </div>

            <ul className="divide-y">
              {sitePanels.map((panel) => {
                const status = STATUS_META[panel.status]
                return (
                  <li key={panel.id} className="flex items-center gap-2 px-3 py-2">
                    <Checkbox
                      id={`panel-${panel.id}`}
                      disabled={disabled}
                      checked={selected.has(panel.id)}
                      onCheckedChange={() => toggleOne(panel.id)}
                    />
                    <Label
                      htmlFor={`panel-${panel.id}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      <span className="text-sm">{panel.name}</span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {panel.deviceCode}
                      </span>
                    </Label>
                    <Badge variant={status.variant} className="shrink-0">
                      {status.label}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function groupBySite(panels: LedPanel[]) {
  const map = new Map<number, { siteId: number; siteName: string; sitePanels: LedPanel[] }>()

  for (const panel of panels) {
    const existing = map.get(panel.siteId)
    if (existing) existing.sitePanels.push(panel)
    else map.set(panel.siteId, { siteId: panel.siteId, siteName: panel.siteName, sitePanels: [panel] })
  }

  return [...map.values()].sort((a, b) => a.siteName.localeCompare(b.siteName))
}
