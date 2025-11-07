import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, DatePicker, Button } from '@plug-atlas/ui';
import { useInfiniteEvents, useSites } from '../../../services/hooks';
import { statusOptions, formatDate, startOfDay, endOfDay } from '../utils/timeUtils.ts';
import EventList from './EventList.tsx';
import type { EventStatus } from '../../../services/types';
import { type DateRange } from 'react-day-picker';
import { X } from 'lucide-react';

export default function EventListSection() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [listStatusFilter, setListStatusFilter] = useState('all');
    const [listSiteFilter, setListSiteFilter] = useState('all');

    const { data: sites } = useSites();

    const { from, to } = useMemo(() => {
        if (!dateRange?.from || !dateRange?.to) {
            return { from: undefined, to: undefined };
        }
        return {
            from: formatDate(startOfDay(dateRange.from), 'yyyyMMddHHmmss'),
            to: formatDate(endOfDay(dateRange.to), 'yyyyMMddHHmmss')
        };
    }, [dateRange]);

    const hasActiveFilters = dateRange !== undefined || listStatusFilter !== 'all' || listSiteFilter !== 'all';

    const handleResetFilters = () => {
        setDateRange(undefined);
        setListStatusFilter('all');
        setListSiteFilter('all');
    };

    const baseParams = useMemo(() => ({
        ...(from && { from }),
        ...(to && { to }),
        ...(listStatusFilter !== 'all' && { status: listStatusFilter as EventStatus }),
        ...(listSiteFilter !== 'all' && { siteId: parseInt(listSiteFilter) })
    }), [from, to, listStatusFilter, listSiteFilter]);

    const { events, isLoading, hasMore, loadMore, mutate } = useInfiniteEvents(baseParams, 10);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">이벤트 목록</h2>
                <div className="flex gap-2">
                    <DatePicker
                        mode="range"
                        value={dateRange}
                        onChange={setDateRange}
                        placeholder="날짜 범위 선택"
                    />

                    <Select value={listStatusFilter} onValueChange={setListStatusFilter}>
                        <SelectTrigger className="w-24">
                            <SelectValue placeholder="상태" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={listSiteFilter} onValueChange={setListSiteFilter}>
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

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetFilters}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <X className="h-4 w-4 mr-1" />
                            필터 초기화
                        </Button>
                    )}
                </div>
            </div>

            <EventList
                events={events}
                isLoading={isLoading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onRefresh={() => mutate()}
            />
        </div>
    );
}