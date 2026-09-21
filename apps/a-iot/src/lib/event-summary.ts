export const EVENT_SUMMARY_KEY = 'dashboard/event-summary'

export function countEventSummary(data: Partial<Record<'ACTIVE' | 'IN_PROGRESS' | 'RESOLVED', unknown[]>>) {
  const count = (status: 'ACTIVE' | 'IN_PROGRESS' | 'RESOLVED') => {
    const events = data[status]
    if (events == null) return 0
    if (!Array.isArray(events)) throw new Error('이벤트 현황 응답 형식이 올바르지 않습니다.')
    return events.length
  }
  const active = count('ACTIVE')
  const inProgress = count('IN_PROGRESS')
  const resolved = count('RESOLVED')
  return { active, inProgress, resolved, total: active + inProgress + resolved }
}
