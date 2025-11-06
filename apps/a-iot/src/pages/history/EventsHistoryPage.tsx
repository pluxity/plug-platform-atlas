import { useState, useMemo } from 'react';
import { useEvents } from '../../services/hooks';
import { getTimeRange } from "./utils/timeUtils";
import EventStatisticsSection from "./components/StatisticsSection.tsx";
import EventListSection from "./components/EventListSection";
import type { EventStatus } from '../../services/types';

export default function EventsHistoryPage() {
  const [globalTimeRange] = useState('today');
  const [globalStatusFilter] = useState('all');
  const [globalSiteFilter] = useState('all');

  const { from, to } = useMemo(() => getTimeRange(globalTimeRange), [globalTimeRange]);

  const { data: events, error: eventsError } = useEvents({
    from,
    to,
    ...(globalStatusFilter !== 'all' && { status: globalStatusFilter as EventStatus }),
    ...(globalSiteFilter !== 'all' && { siteId: parseInt(globalSiteFilter) })
  });

  const eventStats = useMemo(() => {
    if (!events) return { total: 0, pending: 0, working: 0, completed: 0 };

    return {
      total: events.length,
      pending: events.filter(e => e.status === 'PENDING').length,
      working: events.filter(e => e.status === 'WORKING').length,
      completed: events.filter(e => e.status === 'COMPLETED').length,
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
      <div className="flex flex-col gap-8">
        <EventStatisticsSection eventStats={eventStats} />
        <EventListSection  />
      </div>
  );
}