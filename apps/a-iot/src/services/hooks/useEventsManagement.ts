import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { useApiClient } from '@plug-atlas/api-hooks';
import {
    Event,
    EventsQueryParams,
    EventStatusUpdateRequest,
    TimeSeriesData,
    TimeSeriesQueryParams
} from '../types/eventManagement';

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
            const response = await client.get<ApiResponse<Event[]>>(`events${queryString ? `?${queryString}` : ''}`);
            return response.data || [];
        },
        options
    );
};

export const useEventsTimeSeries = (
    params: TimeSeriesQueryParams,
    options?: SWRConfiguration<TimeSeriesData[], Error>
) => {
    const client = useApiClient();

    const queryString = new URLSearchParams({
        interval: params.interval,
        from: params.from,
        to: params.to
    }).toString();

    return useSWR<TimeSeriesData[]>(
        `events-time-series?${queryString}`,
        async () => {
            const response = await client.get<ApiResponse<TimeSeriesData[]>>(`events/time-series?${queryString}`);
            return response.data || [];
        },
        options
    );
};

export const useUpdateEventStatus = (options?: SWRMutationConfiguration<void, Error, string, { eventId: number; status: EventStatusUpdateRequest }>) => {
    const client = useApiClient();

    return useSWRMutation(
        'events-update-status',
        async (_key: string, { arg }: { arg: { eventId: number; status: EventStatusUpdateRequest } }) => {
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