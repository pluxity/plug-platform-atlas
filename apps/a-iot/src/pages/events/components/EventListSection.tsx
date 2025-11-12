import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, DatePicker, Button, Badge } from '@plug-atlas/ui';
import { useInfiniteEvents, useSites } from '../../../services/hooks';
import { statusOptions, levelOptions, sensorTypeOptions, formatDate, startOfDay, endOfDay } from '../utils/timeUtils.ts';
import EventList from './EventList.tsx';
import { type EventStatus, type EventLevel, type SensorType } from '../../../services/types';
import { type DateRange } from 'react-day-picker';
import { X, XIcon } from 'lucide-react';

export default function EventListSection() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [listStatusFilter, setListStatusFilter] = useState('all');
    const [listLevelFilter, setListLevelFilter] = useState('all');
    const [listSensorTypeFilter, setListSensorTypeFilter] = useState('all');
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

    const hasActiveFilters = dateRange !== undefined || listStatusFilter !== 'all' || listLevelFilter !== 'all' || listSensorTypeFilter !== 'all' || listSiteFilter !== 'all';

    const activeFiltersCount =
        (dateRange !== undefined ? 1 : 0) +
        (listStatusFilter !== 'all' ? 1 : 0) +
        (listLevelFilter !== 'all' ? 1 : 0) +
        (listSensorTypeFilter !== 'all' ? 1 : 0) +
        (listSiteFilter !== 'all' ? 1 : 0);

    const handleResetFilters = () => {
        setDateRange(undefined);
        setListStatusFilter('all');
        setListLevelFilter('all');
        setListSensorTypeFilter('all');
        setListSiteFilter('all');
    };

    const handleRemoveDateFilter = () => {
        setDateRange(undefined);
    };

    const handleRemoveStatusFilter = () => {
        setListStatusFilter('all');
    };

    const handleRemoveLevelFilter = () => {
        setListLevelFilter('all');
    };

    const handleRemoveSensorTypeFilter = () => {
        setListSensorTypeFilter('all');
    };

    const handleRemoveSiteFilter = () => {
        setListSiteFilter('all');
    };

    const baseParams = useMemo(() => ({
        ...(from && { from }),
        ...(to && { to }),
        ...(listStatusFilter !== 'all' && { status: listStatusFilter as EventStatus }),
        ...(listLevelFilter !== 'all' && { level: listLevelFilter as EventLevel }),
        ...(listSensorTypeFilter !== 'all' && { sensorType: listSensorTypeFilter as SensorType }),
        ...(listSiteFilter !== 'all' && { siteId: parseInt(listSiteFilter) })
    }), [from, to, listStatusFilter, listLevelFilter, listSensorTypeFilter, listSiteFilter]);

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
                        <SelectTrigger className="w-28">
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

                    <Select value={listLevelFilter} onValueChange={setListLevelFilter}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="심각도" />
                        </SelectTrigger>
                        <SelectContent>
                            {levelOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={listSensorTypeFilter} onValueChange={setListSensorTypeFilter}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="센서" />
                        </SelectTrigger>
                        <SelectContent>
                            {sensorTypeOptions.map((option) => (
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
                </div>
            </div>

            {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">적용된 필터:</span>

                    {dateRange && (
                        <Badge variant="secondary" className="gap-1">
                            {dateRange.from && formatDate(dateRange.from, 'yyyy-MM-dd')}
                            {dateRange.to && ` ~ ${formatDate(dateRange.to, 'yyyy-MM-dd')}`}
                            <Button
                                onClick={handleRemoveDateFilter}
                                className="rounded-full h-4 w-4 !p-0 text-xs"
                                variant="ghost"
                                aria-label="날짜 필터 제거"
                            >
                                <XIcon className="size-3" />
                            </Button>
                        </Badge>
                    )}

                    {listStatusFilter !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            {statusOptions.find(o => o.value === listStatusFilter)?.label}
                            <Button
                                onClick={handleRemoveStatusFilter}
                                className="rounded-full h-4 w-4 !p-0 text-xs"
                                variant="ghost"
                                aria-label="상태 필터 제거"
                            >
                                <XIcon className="size-3" />
                            </Button>
                        </Badge>
                    )}

                    {listLevelFilter !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            {levelOptions.find(o => o.value === listLevelFilter)?.label}
                            <Button
                                onClick={handleRemoveLevelFilter}
                                className="rounded-full h-4 w-4 !p-0 text-xs"
                                variant="ghost"
                                aria-label="심각도 필터 제거"
                            >
                                <XIcon className="size-3" />
                            </Button>
                        </Badge>
                    )}

                    {listSensorTypeFilter !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            {sensorTypeOptions.find(o => o.value === listSensorTypeFilter)?.label}
                            <Button
                                onClick={handleRemoveSensorTypeFilter}
                                className="rounded-full h-4 w-4 !p-0 text-xs"
                                variant="ghost"
                                aria-label="센서 타입 필터 제거"
                            >
                                <XIcon className="size-3" />
                            </Button>
                        </Badge>
                    )}

                    {listSiteFilter !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            {sites?.find(s => s.id.toString() === listSiteFilter)?.name}
                            <Button
                                onClick={handleRemoveSiteFilter}
                                className="rounded-full h-4 w-4 !p-0 text-xs"
                                variant="ghost"
                                aria-label="공원 필터 제거"
                            >
                                <XIcon className="size-3" />
                            </Button>
                        </Badge>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="ml-auto"
                    >
                        모두 지우기
                    </Button>
                </div>
            )}

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