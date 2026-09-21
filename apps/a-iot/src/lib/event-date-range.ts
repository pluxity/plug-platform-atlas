import { endOfDay, format, startOfDay, subDays } from 'date-fns'

export function getRecentEventRange(now = new Date()) {
  return {
    from: format(startOfDay(subDays(now, 6)), 'yyyyMMddHHmmss'),
    to: format(endOfDay(now), 'yyyyMMddHHmmss'),
  }
}
