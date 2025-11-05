import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui';
import { useEvents, useSites } from '../../../services/hooks';
import {getTimeRange, statusOptions, timeRangeOptions} from '../utils/timeUtils';
import EventList from './EventList';
import type { EventStatus } from '../../../services/types';

export default function EventListSection() {
    const [listTimeRange, setListTimeRange] = useState('today');
    const [listStatusFilter, setListStatusFilter] = useState('all');
    const [listSiteFilter, setListSiteFilter] = useState('all');

    const { data: sites } = useSites();

    const { from, to } = useMemo(() => getTimeRange(listTimeRange), [listTimeRange]);

    const { data: events, isLoading: eventsLoading } = useEvents({
        from,
        to,
        ...(listStatusFilter !== 'all' && { status: listStatusFilter as EventStatus }),
        ...(listSiteFilter !== 'all' && { siteId: parseInt(listSiteFilter) })
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">이벤트 목록</h2>
                <div className="flex gap-2">
                    <Select value={listTimeRange} onValueChange={setListTimeRange}>
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
                </div>
            </div>

            <EventList
                events={events || []}
                isLoading={eventsLoading}
            />
        </div>
    );
}