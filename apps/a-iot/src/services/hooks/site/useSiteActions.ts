import useSWR from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { useApiClient } from '@plug-atlas/api-hooks';
import { Site, SiteCreateRequest, SiteUpdateRequest } from '../../types/site/site';

interface ApiResponse<T> {
    data: T;
}

export function useSites() {
    const client = useApiClient();

    return useSWR('sites', async () => {
        const response = await client.get<ApiResponse<Site[]>>('sites');
        return response?.data || [];
    });
}

export function useCreateSite(options?: SWRMutationConfiguration<Site | null, Error, string, SiteCreateRequest>) {
    const client = useApiClient();

    return useSWRMutation(
        'sites',
        async (_key: string, { arg }: { arg: SiteCreateRequest }) => {
            const response = await client.post<ApiResponse<Site>>('sites', arg);
            return response?.data || null;
        },
        options
    );
}

export function useUpdateSite(options?: SWRMutationConfiguration<Site | null, Error, string, { id: number; data: SiteUpdateRequest }>) {
    const client = useApiClient();

    return useSWRMutation(
        'sites',
        async (_key: string, { arg }: { arg: { id: number; data: SiteUpdateRequest } }) => {
            const response = await client.patch<ApiResponse<Site>>(`sites/${arg.id}`, arg.data);
            return response?.data || null;
        },
        options
    );
}

export function useDeleteSite(options?: SWRMutationConfiguration<void, Error, string, number>) {
    const client = useApiClient();

    return useSWRMutation(
        'sites',
        async (_key: string, { arg }: { arg: number }) => {
            await client.delete(`sites/${arg}`);
        },
        options
    );
}