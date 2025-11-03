export interface PermissionResourceItem {
  id: string;
  name: string;
}

export type PermissionResourcesData = Record<string, PermissionResourceItem[]>;

