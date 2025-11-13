import { useCallback } from 'react';
import type { PermissionCheckboxItem } from '../types/permissionCheckbox';

/**
 * Permission Checkbox 선택 관리
 */
export function usePermissionCheckbox() {
  const isSelected = useCallback(
    (permissions: PermissionCheckboxItem[], resourceType: string, resourceId: string) => {
      const permission = permissions?.find(p => p.resourceType === resourceType);
      return permission?.resourceIds.includes(resourceId);
    },
    []
  ); 

  const handleCheckboxChange = useCallback(
    (
      permissions: PermissionCheckboxItem[], 
      onChange: (value: PermissionCheckboxItem[]) => void, 
      resourceType: string, 
      resourceId: string, 
      checked: boolean
    ) => {
      const newPermissions = [...permissions];
      const existingPermissionIndex = newPermissions.findIndex(p => p.resourceType === resourceType);
      
      if (checked) {
        if (existingPermissionIndex >= 0) {
          const permission = newPermissions[existingPermissionIndex]; 
          if (permission && !permission.resourceIds.includes(resourceId)) {
            newPermissions[existingPermissionIndex] = {
              ...permission,
              resourceIds: [...permission.resourceIds, resourceId]
            };
          }
        } else {
          newPermissions.push({ resourceType, resourceIds: [resourceId] });
        }
      } else {
        if (existingPermissionIndex >= 0) {
          const permission = newPermissions[existingPermissionIndex]; 
          if (permission) {
            const newResourceIds = permission.resourceIds.filter((id: string) => id !== resourceId);
            if (newResourceIds.length === 0) {
              newPermissions.splice(existingPermissionIndex, 1);
            } else {
              newPermissions[existingPermissionIndex] = {
                ...permission,
                resourceIds: newResourceIds
              };
            }
          }
        }
      }
      
      onChange(newPermissions);
    },
    []
  );

  return {
    isSelected,
    handleCheckboxChange,
  };
}

