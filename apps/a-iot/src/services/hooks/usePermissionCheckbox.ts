import { useCallback } from 'react';
import type { PermissionCheckboxItem } from '../types/permissonCheckbox';

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
            permission.resourceIds.push(resourceId);
          }
        } else {
          newPermissions.push({ resourceType, resourceIds: [resourceId] });
        }
      } else {
        if (existingPermissionIndex >= 0) {
          const permission = newPermissions[existingPermissionIndex]; 
          if (permission) {
            permission.resourceIds = permission.resourceIds.filter((id: string) => id !== resourceId);
            if (permission.resourceIds.length === 0) {
              newPermissions.splice(existingPermissionIndex, 1);
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

