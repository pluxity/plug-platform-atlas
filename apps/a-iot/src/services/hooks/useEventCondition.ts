import useSWR, { SWRConfiguration, mutate } from 'swr';
import { useApiClient } from "@plug-atlas/api-hooks";
import { EventCondition, EventConditionRequest } from '../types';


export interface EventConditionResponse {
    data: EventCondition;
}

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

export const useEventConditionDetail = (
    id?: number,
    options?: SWRConfiguration<EventCondition, Error>
) => {
    const client = useApiClient();

    return useSWR<EventCondition>(
        id ? `event-condition-${id}` : null,
        async () => {
            const response = await client.get<EventConditionResponse>(
                `event-conditions/${id}`
            );
            return response.data;
        },
        options
    );
};

export const useEventConditionMutations = () => {
    const client = useApiClient();

    const createEventConditions = async (request: EventConditionRequest) => {
        const response = await client.post<ApiResponse<EventCondition[]>>(
            'event-conditions',
            request
        );

        await mutate(`event-conditions-${request.objectId}`);

        return response;
    };

    const updateEventConditions = async (request: {
        conditions: ({
            activate: boolean;
            booleanValue?: false | true | undefined;
            conditionType: "SINGLE" | "RANGE";
            fieldKey: string;
            leftValue?: number | undefined;
            level: "NORMAL" | "WARNING" | "CAUTION" | "DANGER" | "DISCONNECTED";
            notificationEnabled: boolean;
            objectId: string;
            operator: "GE" | "LE" | "BETWEEN";
            order: number;
            rightValue?: number | undefined;
            thresholdValue?: number | undefined
        } | {
            activate: boolean;
            booleanValue?: false | true | undefined;
            conditionType: "SINGLE" | "RANGE";
            fieldKey: string;
            leftValue?: number | undefined;
            level: "NORMAL" | "WARNING" | "CAUTION" | "DANGER" | "DISCONNECTED";
            notificationEnabled: boolean;
            operator: "GE" | "LE" | "BETWEEN";
            order: number;
            rightValue?: number | undefined;
            thresholdValue?: number | undefined
        })[];
        objectId: string
    }) => {
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

export const useEventCondition = (objectId?: string) => {
    const { data: conditions, error, mutate: refetch, isLoading } = useEventConditions(objectId);
    const mutations = useEventConditionMutations();

    return {
        conditions,
        isLoading,
        error,
        refetch,
        ...mutations,

        getConditionByObjectId: (objectId: string) => conditions?.find(c => c.objectId === objectId),
        getConditionsByFieldKey: (fieldKey: string) =>
            conditions?.filter(c => c.fieldKey === fieldKey) || [],
        // getActiveConditions: () =>
        //     conditions?.filter(c => c.activate) || [],
        // getConditionsByLevel: (level: EventCondition['level']) =>
        //     conditions?.filter(c => c.level === level) || [],
    };
};

export const isRangeCondition = (condition: EventCondition): boolean => {
    return condition.conditionType === 'RANGE';
};

export const isSingleCondition = (condition: EventCondition): boolean => {
    return condition.conditionType === 'SINGLE';
};

export const createDefaultCondition = (objectId: string, fieldKey: string): Omit<EventCondition, 'id'> => ({
    objectId,
    fieldKey,
    level: 'NORMAL',
    conditionType: 'SINGLE',
    operator: 'GE',
    thresholdValue: 0.1,
    notificationEnabled: true,
    order: 0,
    activate: true,
});