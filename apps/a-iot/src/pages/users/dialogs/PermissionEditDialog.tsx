import { Dialog, DialogContent, DialogHeader, DialogTitle, Form, FormLabel, FormField, FormItem, FormControl, FormMessage, Input, Button, toast, Label, Checkbox, Spinner } from '@plug-atlas/ui';
import { useUpdatePermission, useResourceTypes } from '@plug-atlas/api-hooks';
import { PermissionGroupUpdateRequest, PermissionGroupUpdateRequestSchema, ResourceTypeResponse, PermissionGroupResponse } from '@plug-atlas/types';
import { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePermissionResources, usePermissionCheckbox } from '../../../services/hooks';
import type { PermissionResourceItem } from '../../../services/types';

interface PermissionEditDialogProps{
    permission: PermissionGroupResponse | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PermissionEditDialog({ isOpen, permission, onClose, onSuccess }: PermissionEditDialogProps) {
    const { trigger: updatePermission, isMutating: isUpdating } = useUpdatePermission();
    const { data: resourceTypes } = useResourceTypes();
    const { data: resourceData = {} } = usePermissionResources();

    const { isSelected, handleCheckboxChange } = usePermissionCheckbox();

    const editPermissionForm = useForm<PermissionGroupUpdateRequest>({
        resolver: zodResolver(PermissionGroupUpdateRequestSchema),
        mode: 'onChange'
    });
    

    useEffect(() => {
        if (permission) {
            editPermissionForm.reset({
                name: permission.name,
                description: permission.description,
                permissions: permission.permissions || []
            });
        }
    }, [permission]);

    const resetPermissionEditForm = useCallback(() => {
        editPermissionForm.reset();
        onClose();
    }, [editPermissionForm, onClose]);

    const submitEditPermissionForm = useCallback(async (data: PermissionGroupUpdateRequest) => {
        if (!permission) return;

        try {
            await updatePermission({
                id: permission.id,
                data: data
            });
            toast.success('권한 수정 성공');
            onSuccess();
            resetPermissionEditForm();
        } catch (error) {
            toast.error('권한 수정 실패');
            console.error(error);
        }
    }, [updatePermission, onSuccess, resetPermissionEditForm, permission]);
    
    if (!permission) return null;

    return(
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetPermissionEditForm();
            }
        }}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>권한 수정</DialogTitle>
                </DialogHeader>
                <Form onSubmit={editPermissionForm.handleSubmit(submitEditPermissionForm)} className="space-y-4">
                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="name">권한 이름</FormLabel>
                            <FormControl>
                                <Input 
                                    id="name" 
                                    type="text" 
                                    placeholder="권한 이름을 입력해주세요." 
                                    {...editPermissionForm.register('name')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {editPermissionForm.formState.errors.name?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="description">권한 설명</FormLabel>
                            <FormControl>
                                <Input 
                                    id="description" 
                                    type="text" 
                                    placeholder="권한 설명을 입력해주세요." 
                                    {...editPermissionForm.register('description')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {editPermissionForm.formState.errors.description?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel>권한 목록</FormLabel>
                            <Controller
                              name="permissions"
                              control={editPermissionForm.control}
                              render={({ field }) => {
                                return (
                                  <FormControl>
                                    <div className="flex flex-col gap-6 max-h-96 overflow-y-auto border rounded-lg p-4">
                                    {resourceTypes?.map((resourceType: ResourceTypeResponse) => {
                                          const resources = resourceData[resourceType.key] || [];

                                          return (
                                            <div key={resourceType.key} className="flex flex-col gap-2">
                                              <div className="font-semibold">{resourceType.name}</div>
                                              <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                {resources.length > 0 ? (
                                                  resources.map((resource: PermissionResourceItem) => {
                                                    const checkboxId = `${resourceType.key}-${resource.id}`;
                                                    const checked = isSelected(field.value || [], resourceType.key, resource.id);

                                                    return (
                                                      <div key={resource.id} className="flex items-center gap-2">
                                                        <Checkbox 
                                                          id={checkboxId}
                                                          checked={checked}
                                                          onCheckedChange={(isChecked) => 
                                                            handleCheckboxChange(field.value || [], field.onChange, resourceType.key, resource.id, !!isChecked)
                                                          }
                                                        />
                                                        <Label htmlFor={checkboxId}>{resource.name}</Label>
                                                      </div>
                                                    );
                                                  })
                                                ) : (
                                                  <div className="text-gray-500 text-sm">사용 가능한 리소스가 없습니다.</div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </FormControl>
                                );
                              }}
                            />
                            <FormMessage className="text-sm text-error-600">
                                {editPermissionForm.formState.errors.permissions?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={resetPermissionEditForm}>
                            취소
                        </Button>
                        <Button type="submit" variant="default" className="flex-1" disabled={isUpdating || !editPermissionForm.formState.isValid}>
                            {isUpdating ? <Spinner size="sm" /> : '수정'}
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}