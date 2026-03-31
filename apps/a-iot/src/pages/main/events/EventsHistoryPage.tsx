import { useState, useMemo } from 'react';
import { useEvents } from '../../../services/hooks';
import EventStatisticsSection from "./components/StatisticsSection.tsx";
import EventListSection from "./components/EventListSection.tsx";
import CctvEventSection from "./components/CctvEventSection.tsx";
import { formatDate, startOfDay, endOfDay, subtractDays } from './utils/timeUtils';
import type { EventStatus } from '../../../services/types';

type TabKey = 'iot' | 'ai-edge'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'iot', label: 'IoT 이벤트' },
  { key: 'ai-edge', label: 'AI EDGE 이벤트' },
]

export default function EventsHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('iot')
  const [globalStatusFilter] = useState('all');
  const [globalSiteFilter] = useState('all');

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
    <div className="flex flex-col h-[calc(100vh-11rem)]">
      {/* 탭 버튼 */}
      <div className="flex gap-1 shrink-0 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 min-h-0">
        {activeTab === 'iot' && (
          <div className="flex flex-col h-full gap-4">
            <div className="shrink-0">
              <EventStatisticsSection eventStats={eventStats} />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <EventListSection />
            </div>
          </div>
        )}

        {activeTab === 'ai-edge' && (
          <CctvEventSection />
        )}
      </div>
    </div>
  );
}
