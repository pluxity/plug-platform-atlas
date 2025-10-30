import useSWR, { type SWRConfiguration } from 'swr';
import { useApiClient, useResourceTypes } from '@plug-atlas/api-hooks';
import type { PermissionResourcesData } from '../types/permission';

type DataResponse<T> = { data: T };

/**
 * Permission Resources Data 조회
 */
export function usePermissionResources(
  options?: SWRConfiguration<PermissionResourcesData, Error>
) {
  const client = useApiClient();
  const { data: resourceTypes } = useResourceTypes();

  return useSWR<PermissionResourcesData>(
    resourceTypes ? 'permission-resources' : null,
    async () => {
      if (!resourceTypes) return {};

      const data: PermissionResourcesData = {};

      await Promise.all(
        resourceTypes.map(async (resourceType) => {
          try {
            if (resourceType.endpoint) {
              const response = await client.get<DataResponse<Array<{ id: number; name: string }>>>(resourceType.endpoint);
              const list = response.data || [];
              
              data[resourceType.key] = list.map((item) => ({
                id: String(item.id),
                name: item.name || '',
              }));
            }
          } catch (err) {
            console.error(`Failed to fetch resource data for ${resourceType.key}:`, err);
            data[resourceType.key] = [];
          }
        })
      );

      return data;
    },
    options
  );
}

