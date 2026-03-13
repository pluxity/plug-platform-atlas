import { useState, useMemo } from 'react';
import { useEvents } from '../../../services/hooks';
import EventStatisticsSection from "./components/StatisticsSection.tsx";
import EventListSection from "./components/EventListSection.tsx";
import { formatDate, startOfDay, endOfDay, subtractDays } from './utils/timeUtils';
import type { EventStatus } from '../../../services/types';

export default function EventsHistoryPage() {
  const [globalStatusFilter] = useState('all');
  const [globalSiteFilter] = useState('all');

  // 통계도 최근 6개월 기준
  const sixMonthsRange = useMemo(() => ({
    from: formatDate(startOfDay(subtractDays(new Date(), 180)), 'yyyyMMddHHmmss'),
    to: formatDate(endOfDay(new Date()), 'yyyyMMddHHmmss'),
  }), []);

  const { data: events, error: eventsError } = useEvents({
    from: sixMonthsRange.from,
    to: sixMonthsRange.to,
    ...(globalStatusFilter !== 'all' && { status: globalStatusFilter as EventStatus }),
    ...(globalSiteFilter !== 'all' && { siteId: parseInt(globalSiteFilter) })
  });

  const eventStats = useMemo(() => {
    if (!events) return { total: 0, pending: 0, working: 0, completed: 0 };

    return {
      total: events.length,
      pending: events.filter(e => e.status === 'ACTIVE').length,
      working: events.filter(e => e.status === 'IN_PROGRESS').length,
      completed: events.filter(e => e.status === 'RESOLVED').length,
    };
  }, [events]);

  if (eventsError) {
    return (
        <div className="text-center text-red-600">
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm mt-2">{eventsError.message}</p>
        </div>

    );
  }

  return (
      <div className="flex flex-col gap-16">
        <EventStatisticsSection eventStats={eventStats} />
        <EventListSection  />
      </div>
  );
}