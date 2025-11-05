import React, { useState, useMemo } from 'react';
import { Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@plug-atlas/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@plug-atlas/ui';
import { Badge } from '@plug-atlas/ui';
import { useEvents, useEventsTimeSeries, useEventActionHistories, useSites } from '../../services/hooks';
import type { Event, EventStatus, EventCollectInterval } from '../../services/types';

const formatDate = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'yyyyMMddHHmmss':
      return `${year}${month}${day}${hour}${minute}${second}`;
    case 'yyyyMMddHHmm':
      return `${year}${month}${day}${hour}${minute}`;
    default:
      return date.toString();
  }
};

const subtractDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

const startOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const endOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

const timeRangeOptions = [
  { label: '오늘', value: 'today' },
  { label: '어제', value: 'yesterday' },
  { label: '최근 7일', value: '7days' },
  { label: '최근 30일', value: '30days' },
];

const statusOptions = [
  { label: '전체', value: '' },
  { label: '대기중', value: 'PENDING' },
  { label: '진행중', value: 'WORKING' },
  { label: '완료', value: 'COMPLETED' },
];

const intervalOptions = [
  { label: '시간별', value: 'HOUR' },
  { label: '일별', value: 'DAY' },
  { label: '주별', value: 'WEEK' },
  { label: '월별', value: 'MONTH' },
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { icon: Clock, color: 'text-yellow-600 bg-yellow-50', text: '대기중' };
    case 'WORKING':
      return { icon: TrendingUp, color: 'text-blue-600 bg-blue-50', text: '진행중' };
    case 'COMPLETED':
      return { icon: CheckCircle, color: 'text-green-600 bg-green-50', text: '완료' };
    default:
      return { icon: AlertTriangle, color: 'text-gray-600 bg-gray-50', text: '알 수 없음' };
  }
};

const getTimeRange = (range: string) => {
  const now = new Date();
  let fromDate: Date;
  let toDate: Date;

  switch (range) {
    case 'today':
      fromDate = startOfDay(now);
      toDate = endOfDay(now);
      break;
    case 'yesterday':
      const yesterday = subtractDays(now, 1);
      fromDate = startOfDay(yesterday);
      toDate = endOfDay(yesterday);
      break;
    case '7days':
      fromDate = startOfDay(subtractDays(now, 7));
      toDate = endOfDay(now);
      break;
    case '30days':
      fromDate = startOfDay(subtractDays(now, 30));
      toDate = endOfDay(now);
      break;
    default:
      fromDate = startOfDay(now);
      toDate = endOfDay(now);
  }

  return {
    from: formatDate(fromDate, 'yyyyMMddHHmmss'),
    to: formatDate(toDate, 'yyyyMMddHHmmss'),
    fromForSeries: formatDate(fromDate, 'yyyyMMddHHmm'),
    toForSeries: formatDate(toDate, 'yyyyMMddHHmm'),
  };
};

const ChartCard: React.FC<{ title: string; value: number; icon: React.ElementType; color: string }> = ({
  title,
  value,
  icon: Icon,
  color
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
    </CardContent>
  </Card>
);

const EventDetailModal: React.FC<{ event: Event }> = ({ event }) => {
  const { data: histories, isLoading } = useEventActionHistories(event.eventId);
  const statusInfo = getStatusInfo(event.status);

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
          이벤트 상세 정보 #{event.eventId}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">상태</label>
            <div className="mt-1">
              <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">디바이스 ID</label>
            <p className="mt-1 text-sm">{event.deviceId || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">이벤트명</label>
            <p className="mt-1 text-sm">{event.eventName || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">발생 시간</label>
            <p className="mt-1 text-sm">{event.occurredAt || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">최소값</label>
            <p className="mt-1 text-sm">{event.minValue !== undefined ? event.minValue : 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">최대값</label>
            <p className="mt-1 text-sm">{event.maxValue !== undefined ? event.maxValue : 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-500">가이드 메시지</label>
            <p className="mt-1 text-sm">{event.guideMessage || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">조치 이력</h4>
          {isLoading ? (
            <p className="text-sm text-gray-500">로딩 중...</p>
          ) : histories && histories.length > 0 ? (
            <div className="space-y-2">
              {histories.map((history) => (
                <div key={history.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm">{history.content}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{history.author || '작성자 없음'}</span>
                    <span>{history.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">조치 이력이 없습니다.</p>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default function Events() {
  const [timeRange, setTimeRange] = useState('today');
  const [statusFilter, setStatusFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [interval, setInterval] = useState<EventCollectInterval>('HOUR');

  const { data: sites } = useSites();

  const { from, to, fromForSeries, toForSeries } = useMemo(() => getTimeRange(timeRange), [timeRange]);

  const { data: events, isLoading: eventsLoading, error: eventsError } = useEvents({
    from,
    to,
    ...(statusFilter && { status: statusFilter as EventStatus }),
    ...(siteFilter && { siteId: parseInt(siteFilter) })
  });

  const { data: timeSeriesData, isLoading: timeSeriesLoading } = useEventsTimeSeries({
    interval,
    from: fromForSeries,
    to: toForSeries
  });

  const stats = useMemo(() => {
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
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm mt-2">{eventsError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">이벤트 조치 이력</h1>
        <p className="text-gray-600">이벤트 발생 및 조치 이력을 조회합니다.</p>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="사이트 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">전체 사이트</SelectItem>
            {sites?.map((site) => (
              <SelectItem key={site.id} value={site.id.toString()}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={interval} onValueChange={(value) => setInterval(value as EventCollectInterval)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {intervalOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">통계 및 차트</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <ChartCard
              title="전체 이벤트"
              value={stats.total}
              icon={Calendar}
              color="text-blue-600"
            />
            <ChartCard
              title="대기 중"
              value={stats.pending}
              icon={Clock}
              color="text-yellow-600"
            />
            <ChartCard
              title="진행 중"
              value={stats.working}
              icon={TrendingUp}
              color="text-blue-600"
            />
            <ChartCard
              title="완료"
              value={stats.completed}
              icon={CheckCircle}
              color="text-green-600"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                시간별 이벤트 발생 추이
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeSeriesLoading ? (
                <p className="text-center text-gray-500 py-8">차트 데이터 로딩 중...</p>
              ) : timeSeriesData && timeSeriesData.length > 0 ? (
                <div className="space-y-2">
                  {timeSeriesData.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {item.meta?.targetId || `데이터 ${index + 1}`}
                      </span>
                      <span className="text-sm font-medium">
                        {item.timestamps ? item.timestamps.length : 0}건
                      </span>
                    </div>
                  ))}
                  {timeSeriesData.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      ... 외 {timeSeriesData.length - 5}개 데이터
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">차트 데이터가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">이벤트 목록</h2>
          
          <Card>
            <CardContent className="p-0">
              {eventsLoading ? (
                <p className="text-center text-gray-500 py-8">이벤트 로딩 중...</p>
              ) : events && events.length > 0 ? (
                <div className="divide-y">
                  {events.map((event) => {
                    const statusInfo = getStatusInfo(event.status);
                    return (
                      <Dialog key={event.eventId}>
                        <DialogTrigger asChild>
                          <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
                                <div>
                                  <p className="font-medium">{event.eventName || `이벤트 #${event.eventId}`}</p>
                                  <p className="text-sm text-gray-500">
                                    디바이스: {event.deviceId}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={statusInfo.color}>
                                  {statusInfo.text}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {event.occurredAt}
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <EventDetailModal event={event} />
                      </Dialog>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">이벤트가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}