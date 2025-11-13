import { useState, useMemo, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { DatePicker, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@plug-atlas/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui';
import { useEventsTimeSeries, useSites } from '../../../services/hooks';
import { intervalOptions } from '../utils/timeUtils.ts';
import EventTimeSeries from './EventTimeSeries.tsx';
import type { EventCollectInterval } from '../../../services/types';
import { type DateRange } from 'react-day-picker';
import { formatDate, startOfDay, endOfDay } from '../utils/timeUtils';

interface StatisticsSectionProps {
    eventStats: {
        total: number;
        pending: number;
        working: number;
        completed: number;
    };
}
export default function StatisticsSection({ }: StatisticsSectionProps) {
    const today = new Date();
    const [interval, setInterval] = useState<EventCollectInterval>('HOUR');
    const [chartSiteFilter, setChartSiteFilter] = useState('all');

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [selectedMonth, setSelectedMonth] = useState<string>((today.getMonth() + 1).toString());
    const [selectedWeekYear, setSelectedWeekYear] = useState<string>(today.getFullYear().toString());
    const [selectedYear, setSelectedYear] = useState<string>(today.getFullYear().toString());

    const { data: sites } = useSites();

    useEffect(() => {
        if (interval === 'DAY' && !dateRange) {
            const today = new Date();
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            setDateRange({
                from: sevenDaysAgo,
                to: today
            });
        }
    }, [interval]);

    const dayRangeExceeded = useMemo(() => {
        if (interval !== 'DAY' || !dateRange?.from || !dateRange?.to) return false;
        const diffInMs = dateRange.to.getTime() - dateRange.from.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays > 7;
    }, [interval, dateRange]);

    const { fromForSeries, toForSeries } = useMemo(() => {
        switch (interval) {
            case 'HOUR':
                if (!selectedDate) {
                    return {
                        fromForSeries: formatDate(startOfDay(today), 'yyyyMMddHHmm'),
                        toForSeries: formatDate(endOfDay(today), 'yyyyMMddHHmm')
                    };
                }
                return {
                    fromForSeries: formatDate(startOfDay(selectedDate), 'yyyyMMddHHmm'),
                    toForSeries: formatDate(endOfDay(selectedDate), 'yyyyMMddHHmm')
                };

            case 'DAY':
                if (!dateRange?.from || !dateRange?.to) {
                    return {
                        fromForSeries: formatDate(startOfDay(today), 'yyyyMMddHHmm'),
                        toForSeries: formatDate(endOfDay(today), 'yyyyMMddHHmm')
                    };
                }
                return {
                    fromForSeries: formatDate(startOfDay(dateRange.from), 'yyyyMMddHHmm'),
                    toForSeries: formatDate(endOfDay(dateRange.to), 'yyyyMMddHHmm')
                };

            case 'WEEK':
                const weekYear = parseInt(selectedWeekYear);
                const month = parseInt(selectedMonth);
                const firstDayOfMonth = new Date(weekYear, month - 1, 1);
                const lastDayOfMonth = new Date(weekYear, month, 0);
                return {
                    fromForSeries: formatDate(startOfDay(firstDayOfMonth), 'yyyyMMddHHmm'),
                    toForSeries: formatDate(endOfDay(lastDayOfMonth), 'yyyyMMddHHmm')
                };

            case 'MONTH':
                const year = parseInt(selectedYear);
                const firstDayOfYear = new Date(year, 0, 1);
                const lastDayOfYear = new Date(year, 11, 31);
                return {
                    fromForSeries: formatDate(startOfDay(firstDayOfYear), 'yyyyMMddHHmm'),
                    toForSeries: formatDate(endOfDay(lastDayOfYear), 'yyyyMMddHHmm')
                };

            default:
                return {
                    fromForSeries: formatDate(startOfDay(today), 'yyyyMMddHHmm'),
                    toForSeries: formatDate(endOfDay(today), 'yyyyMMddHHmm')
                };
        }
    }, [interval, selectedDate, dateRange, selectedMonth, selectedWeekYear, selectedYear]);

    const { data: timeSeriesData, isLoading: timeSeriesLoading } = useEventsTimeSeries({
        interval,
        from: fromForSeries,
        to: toForSeries,
        ...(chartSiteFilter !== 'all' && { siteId: parseInt(chartSiteFilter) })
    });

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            years.push(i.toString());
        }
        return years;
    }, []);

    const monthOptions = [
        { value: '1', label: '1월' },
        { value: '2', label: '2월' },
        { value: '3', label: '3월' },
        { value: '4', label: '4월' },
        { value: '5', label: '5월' },
        { value: '6', label: '6월' },
        { value: '7', label: '7월' },
        { value: '8', label: '8월' },
        { value: '9', label: '9월' },
        { value: '10', label: '10월' },
        { value: '11', label: '11월' },
        { value: '12', label: '12월' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    통계 및 차트
                </h2>
                <div className="flex gap-2">
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

                    {interval === 'HOUR' && (
                        <DatePicker
                            mode="single"
                            value={selectedDate}
                            onChange={setSelectedDate}
                            placeholder="날짜 선택"
                        />
                    )}

                    {interval === 'DAY' && (
                        <div className="flex items-center gap-2">
                            <DatePicker
                                mode="range"
                                value={dateRange}
                                onChange={setDateRange}
                                placeholder="날짜 범위 선택 (최대 7일)"
                            />
                            {dayRangeExceeded && (
                                <TooltipProvider>
                                    <Tooltip open={dayRangeExceeded}>
                                        <TooltipTrigger asChild>
                                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            <p>최대 7일까지 선택 가능합니다</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    )}

                    {interval === 'WEEK' && (
                        <>
                            <Select value={selectedWeekYear} onValueChange={setSelectedWeekYear}>
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}년
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    {interval === 'MONTH' && (
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {yearOptions.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}년
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

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
                </div>
            </div>

            <EventTimeSeries
                data={timeSeriesData || null}
                isLoading={timeSeriesLoading}
                interval={interval}
            />
        </div>
    );
}