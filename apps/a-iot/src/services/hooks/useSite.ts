import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { useApiClient } from "@plug-atlas/api-hooks";
import type { Site, SiteCreateRequest, SiteUpdateRequest } from '../types/site.ts';

type ApiResponse<T> = { data: T }

export const useSites = (options?: SWRConfiguration<Site[], Error>) => {
    const client = useApiClient();

    return useSWR<Site[]>(
        'sites',
        async () => {
            const response = await client.get<ApiResponse<Site[]>>('sites');
            return response.data || [];
        },
        options
    );
};

export const useCreateSite = () => {
    const client = useApiClient();

    return useSWRMutation(
        'sites',
        async (_key: string, { arg }: { arg: SiteCreateRequest }) => {
            const response = await client.post<ApiResponse<Site>>('sites', arg);
            return response?.data || null;
        }
    );
};

export const useUpdateSite = () => {
    const client = useApiClient();

    return useSWRMutation(
        'sites',
        async (_key: string, { arg }: { arg: { id: number; data: SiteUpdateRequest } }) => {
            const response = await client.put<ApiResponse<Site>>(`sites/${arg.id}`, arg.data);
            return response?.data || null;
        }
    );
};

export const useDeleteSite = (options?: SWRMutationConfiguration<void, Error, string, number>) => {
    const client = useApiClient();

    return useSWRMutation(
        'sites',
        async (_key: string, { arg }: { arg: number }) => {
            await client.delete(`sites/${arg}`);
        },
        options
    );
};

export const useSite = (id: number, options?: SWRConfiguration<Site, Error>) => {
    const client = useApiClient();

    return useSWR<Site>(
        id ? [`sites`, id] : null,
        async () => {
            const response = await client.get<ApiResponse<Site>>(`sites/${id}`);
            return response.data;
        },
        options
    );
};