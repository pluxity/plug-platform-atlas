import useSWR, { SWRConfiguration } from 'swr';
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { useApiClient } from '@plug-atlas/api-hooks';
import { fetchEvent } from '../../lib/fetch-event';
import { getEventPageKey, flattenEventPages, createEventPageLoader } from '../../lib/event-page';
import { useCallback, useRef } from 'react';
import {
    Event,
    EventsQueryParams,
    EventStatusRequest,
    TimeSeriesData,
    TimeSeriesQueryParams,
    PaginatedEventsResponse
} from '../types';

type ApiResponse<T> = { data: T };

export const useEvents = (
    params?: EventsQueryParams,
    options?: SWRConfiguration<Event[], Error>
) => {
    const client = useApiClient();

    const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString() : '';

    const key = params ? `events?${queryString}` : 'events';

    return useSWR<Event[]>(
        key,
        async () => {
            const response = await client.get<ApiResponse<PaginatedEventsResponse>>(`events${queryString ? `?${queryString}` : ''}`);
            return response.data?.content || [];
        },
        options
    );
};

export const useInfiniteEvents = (
    baseParams?: Omit<EventsQueryParams, 'lastId' | 'lastStatus'>,
    pageSize: number = 10,
    options?: SWRInfiniteConfiguration<PaginatedEventsResponse, Error>
) => {
    const client = useApiClient();

    const getKey = (pageIndex: number, previousPage: PaginatedEventsResponse | null) =>
        getEventPageKey(baseParams, pageSize, pageIndex, previousPage);

    const result = useSWRInfinite<PaginatedEventsResponse>(
        getKey,
        async (key: string) => {
            const response = await client.get<ApiResponse<PaginatedEventsResponse>>(key);
            return response.data || { content: [], nextCursor: null, nextStatus: null, hasNext: false };
        },
        options
    );

    const events = flattenEventPages(result.data);
    const lastPage = result.data?.[result.data.length - 1];
    const hasMore = !!lastPage?.hasNext && lastPage.nextCursor != null;
    const pagingState = useRef({ result, hasMore, lastPage });
    pagingState.current = { result, hasMore, lastPage };
    const pageLoader = useRef(createEventPageLoader());
    const scopeKey = getKey(0, null);
    const loadMore = useCallback((): Promise<unknown> => {
        const { result: current, hasMore: more, lastPage: page } = pagingState.current;
        if (!more || current.isValidating || current.error || !current.data || current.size > current.data.length) return Promise.resolve();
        const cursor = `${scopeKey}:${page?.nextStatus}:${page?.nextCursor}`;
        return pageLoader.current(cursor, () => current.setSize(current.data!.length + 1));
    }, [scopeKey]);

    return {
        ...result,
        events,
        hasMore,
        loadMore,
    };
};

export const useEventsTimeSeries = (
    params: TimeSeriesQueryParams,
    options?: SWRConfiguration<TimeSeriesData | null, Error>
) => {
    const client = useApiClient();

    const queryEntries: Record<string, string> = {
        interval: params.interval,
        from: params.from,
        to: params.to,
    };
    if (params.siteId != null) {
        queryEntries.siteId = String(params.siteId);
    }
    const queryString = new URLSearchParams(queryEntries).toString();

    return useSWR<TimeSeriesData | null>(
        `events-time-series?${queryString}`,
        async () => {
            const response = await client.get<ApiResponse<TimeSeriesData>>(`events/time-series?${queryString}`);
            return response.data || null;
        },
        options
    );
};

export const useUpdateEventStatus = (options?: SWRMutationConfiguration<void, Error, string, { eventId: number; status: EventStatusRequest }>) => {
    const client = useApiClient();

    return useSWRMutation(
        'events-update-status',
        async (_key: string, { arg }: { arg: { eventId: number; status: EventStatusRequest } }) => {
            const queryString = new URLSearchParams({
                result: arg.status.result
            }).toString();

            await client.put<void>(`events/${arg.eventId}/status?${queryString}`);
        },
        options
    );
};

export const useEvent = (
    id: number,
    options?: SWRConfiguration<Event, Error>,
    scope?: Pick<EventsQueryParams, 'sourceType' | 'siteId'>
) => {
    const client = useApiClient();

    return useSWR<Event>(
        id ? ['event-detail', id, scope?.sourceType ?? null, scope?.siteId ?? null] : null,
        () => fetchEvent(client, id, scope),
        options
    );
};
