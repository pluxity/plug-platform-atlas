import useSWR, { SWRConfiguration } from 'swr';
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { useApiClient } from '@plug-atlas/api-hooks';
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

    const getKey = (pageIndex: number, previousPageData: PaginatedEventsResponse | null) => {
        if (previousPageData && !previousPageData.hasNext) return null;

        const params: EventsQueryParams = {
            ...baseParams,
            size: pageSize,
        };

        if (pageIndex > 0 && previousPageData?.nextCursor) {
            params.lastId = previousPageData.nextCursor;
            if (previousPageData?.nextStatus) {
                params.lastStatus = previousPageData.nextStatus;
            }
        }

        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = String(value);
                }
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        return `events?${queryString}`;
    };

    const result = useSWRInfinite<PaginatedEventsResponse>(
        getKey,
        async (key: string) => {
            const response = await client.get<ApiResponse<PaginatedEventsResponse>>(key);
            return response.data || { content: [], nextCursor: null, nextStatus: null, hasNext: false };
        },
        options
    );

    const events = result.data?.flatMap(page => page.content) || [];
    const hasMore = result.data?.[result.data.length - 1]?.hasNext || false;

    return {
        ...result,
        events,
        hasMore,
        loadMore: () => result.setSize(result.size + 1),
    };
};

export const useEventsTimeSeries = (
    params: TimeSeriesQueryParams,
    options?: SWRConfiguration<TimeSeriesData | null, Error>
) => {
    const client = useApiClient();

    const queryString = new URLSearchParams({
        interval: params.interval,
        from: params.from,
        to: params.to
    }).toString();

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
    options?: SWRConfiguration<Event, Error>
) => {
    const client = useApiClient();

    return useSWR<Event>(
        id ? [`events`, id] : null,
        async () => {
            const response = await client.get<ApiResponse<Event>>(`events/${id}`);
            return response.data;
        },
        options
    );
};