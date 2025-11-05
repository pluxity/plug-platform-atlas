import useSWR, { SWRConfiguration } from 'swr';
import { useApiClient } from "@plug-atlas/api-hooks";
import {DeviceType} from "../types/deviceType.ts";

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