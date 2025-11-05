import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@plug-atlas/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui';
import { useEventsTimeSeries, useSites } from '../../../services/hooks';
import {getTimeRange, intervalOptions, timeRangeOptions} from '../utils/timeUtils';
import EventTimeSeries from './EventTimeSeries';
import type { EventCollectInterval } from '../../../services/types';

interface StatisticsSectionProps {
    eventStats: {
        total: number;
        pending: number;
        working: number;
        completed: number;
    };
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; color: string }> = ({
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

export default function StatisticsSection({ eventStats }: StatisticsSectionProps) {
    const [chartTimeRange, setChartTimeRange] = useState('today');
    const [chartSiteFilter, setChartSiteFilter] = useState('all');
    const [interval, setInterval] = useState<EventCollectInterval>('HOUR');

    const { data: sites } = useSites();

    const { fromForSeries, toForSeries } = useMemo(() => getTimeRange(chartTimeRange), [chartTimeRange]);

    const { data: timeSeriesData, isLoading: timeSeriesLoading } = useEventsTimeSeries({
        interval,
        from: fromForSeries,
        to: toForSeries,
        ...(chartSiteFilter !== 'all' && { siteId: parseInt(chartSiteFilter) })
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    통계 및 차트
                </h2>
                <div className="flex gap-2">
                    <Select value={chartTimeRange} onValueChange={setChartTimeRange}>
                        <SelectTrigger className="w-32">
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

                    <Select value={chartSiteFilter} onValueChange={setChartSiteFilter}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="공원" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체 공원</SelectItem>
                            {sites?.map((site) => (
                                <SelectItem key={site.id} value={site.id.toString()}>
                                    {site.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={interval} onValueChange={(value) => setInterval(value as EventCollectInterval)}>
                        <SelectTrigger className="w-24">
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
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="전체 이벤트"
                    value={eventStats.total}
                    icon={Calendar}
                    color="text-blue-600"
                />
                <StatCard
                    title="대기 중"
                    value={eventStats.pending}
                    icon={Clock}
                    color="text-yellow-600"
                />
                <StatCard
                    title="진행 중"
                    value={eventStats.working}
                    icon={TrendingUp}
                    color="text-blue-600"
                />
                <StatCard
                    title="완료"
                    value={eventStats.completed}
                    icon={CheckCircle}
                    color="text-green-600"
                />
            </div>

            <EventTimeSeries
                data={timeSeriesData || []}
                isLoading={timeSeriesLoading}
            />
        </div>
    );
}