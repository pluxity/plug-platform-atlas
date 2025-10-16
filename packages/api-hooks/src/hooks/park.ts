import useSWR from 'swr';
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation';
import {useApiClient} from '../client';
import type { Site, SiteRequest, SiteUpdateRequest, SiteCreateRequest } from '@plug-atlas/types';

type ApiResponse<T> = { data: T }

export const useSites = (options? : SWRConfiguration<Site[], Error>) => {
    const client = useApiClient();

    return useSWR<Site[]>('sites', async () => {
        const response = await client.get<ApiResponse<Site[]>>('/sites');
        return response.data || [];
    });
};

export const useCreateSite = (options? : SWRConfiguration<SiteRequest, Error>) => {
    const apiClient = useApiClient();

    return useSWRMutation('sites', async (_key: string, {arg}: { arg: SiteCreateRequest }) => {
        const response = await apiClient.post<ApiResponse<Site>>('/sites', arg);
        return response;
    });
};

export const useUpdateSite = () => {
    const apiClient = useApiClient();

    return useSWRMutation('sites', async (_key: string, {arg}: { arg: { id: number; data: SiteUpdateRequest } }) => {
        const response = await apiClient.put<ApiResponse<Site>>(`/sites/${arg.id}`, arg.data);
        return response.data.data;
    });
};

// Site 삭제
export const useDeleteSite = () => {
    const apiClient = useApiClient();

    return useSWRMutation('sites', async (_key: string, {arg: id}: { arg: number }) => {
        await apiClient.delete(`/sites/${id}`);
    });
};

// Site 단일 조회 (필요한 경우)
export const useSite = (id: number) => {
    const apiClient = useApiClient();

    return useSWR<Site>(
        id ? [`sites`, id] : null,
        async () => {
            const response = await apiClient.get<ApiResponse<Site>>(`/sites/${id}`);
            return response.data.data;
        }
    );
};