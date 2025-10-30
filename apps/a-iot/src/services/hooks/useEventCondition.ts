import useSWR, { SWRConfiguration, mutate } from 'swr';
import { useApiClient } from "@plug-atlas/api-hooks";
import { EventCondition } from '../types';

type ApiResponse<T> = { data: T };

export const useEventConditions = (
    objectId?: string,
    options?: SWRConfiguration<EventCondition[], Error>
) => {
    const client = useApiClient();

    return useSWR<EventCondition[]>(
        objectId ? `event-conditions-${objectId}` : null,
        async () => {
            const response = await client.get<ApiResponse<EventCondition[]>>(
                `event-conditions?objectId=${objectId}`
            );
            return response?.data || [];
        },
        options
    );
};

export const useEventConditionMutations = () => {
    const client = useApiClient();

    const createEventConditions = async (request: {
        conditions: Array<{
            fieldKey: string;
            level: "NORMAL" | "WARNING" | "CAUTION" | "DANGER" | "DISCONNECTED";
            activate: boolean;
            notificationEnabled: boolean;
            booleanValue?: boolean;
            conditionType?: "SINGLE" | "RANGE";
            operator?: "GE" | "LE" | "BETWEEN";
            thresholdValue?: number;
            leftValue?: number;
            rightValue?: number;
        }>;
        objectId: string;
    }) => {
        const response = await client.post<ApiResponse<EventCondition[]>>(
            'event-conditions',
            request
        );

        await mutate(`event-conditions-${request.objectId}`);

        return response;
    };

    const updateEventConditions = async (request: { conditions: EventCondition[]; objectId: string }) => {
        const response = await client.put<ApiResponse<EventCondition[]>>(
            'event-conditions',
            request
        );

        await mutate(`event-conditions-${request.objectId}`);

        return response;
    };

    const deleteEventCondition = async (id: number, objectId?: string) => {
        await client.delete(`event-conditions/${id}`);

        if (objectId) {
            await mutate(`event-conditions-${objectId}`);
        }
        await mutate(`event-condition-${id}`);
    };

    return {
        createEventConditions,
        updateEventConditions,
        deleteEventCondition,
    };
};