
import useSWR, { SWRConfiguration } from 'swr';
import { useApiClient } from "@plug-atlas/api-hooks";

export interface DeviceProfile {
    id: number;
    fieldKey: string;
    description: string;
    fieldUnit: string;
    fieldType: string;
}

export interface DeviceType {
    id: number;
    objectId: string;
    description: string;
    version: string;
    profiles: DeviceProfile[];
}

type ApiResponse<T> = { data: T }

export const useDeviceTypes = (options?: SWRConfiguration<DeviceType[], Error>) => {
    const client = useApiClient();

    return useSWR<DeviceType[]>(
        'device-types',
        async () => {
            const response = await client.get<ApiResponse<DeviceType[]>>('device-types');
            return response.data || [];
        },
        options
    );
};