import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { useApiClient } from '@plug-atlas/api-hooks';
import { ActionHistory, ActionHistoryRequest } from '../types';

type ApiResponse<T> = { data: T };

export const useEventActionHistories = (
    eventId: number,
    options?: SWRConfiguration<ActionHistory[], Error>
) => {
    const client = useApiClient();

    return useSWR<ActionHistory[]>(
        eventId ? `events/action-histories` : null,
        async () => {
            const response = await client.get<ApiResponse<ActionHistory[]>>(`events/${eventId}/action-histories`);
            return response.data || [];
        },
        options
    );
};

export const useCreateActionHistory = (eventId: number) => {
    const client = useApiClient();

    return useSWRMutation(
        `events/${eventId}/action-histories`,
        async (_key: string, { arg }: { arg: ActionHistoryRequest }) => {
            const payload = {
                ...arg,
                fileIds: typeof arg?.fileIds === 'number' ? [arg.fileIds] : arg.fileIds
            };

            const response = await client.post<ApiResponse<ActionHistory>>(`events/${eventId}/action-histories`, payload);
            return response?.data || null;
        }
    );
};

export const useUpdateActionHistory = (eventId: number) => {
    const client = useApiClient();

    return useSWRMutation(
        `events/${eventId}/action-histories`,
        async (_key: string, { arg }: { arg: { id: number; data: ActionHistoryRequest } }) => {
            const payload = {
                ...arg.data,
                fileIds: typeof arg.data.fileIds === 'number' ? [arg.data.fileIds] : arg.data.fileIds
            };

            const response = await client.put<ApiResponse<ActionHistory>>(
                `events/${eventId}/action-histories/${arg.id}`,
                payload
            );
            return response?.data || null;
        }
    );
};

export const useDeleteActionHistory = (
    eventId: number,
    options?: SWRMutationConfiguration<void, Error, string, number>
) => {
    const client = useApiClient();

    return useSWRMutation(
        `events/${eventId}/action-histories`,
        async (_key: string, { arg }: { arg: number }) => {
            await client.delete(`events/${eventId}/action-histories/${arg}`);
        },
        options
    );
};