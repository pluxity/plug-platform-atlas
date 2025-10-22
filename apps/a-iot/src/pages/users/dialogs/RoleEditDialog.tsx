import { useEffect, useCallback } from 'react';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, toast, Checkbox, Label, Dialog, DialogContent, DialogHeader, DialogTitle } from '@plug-atlas/ui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleUpdateRequest, RoleResponse, RoleUpdateRequestSchema } from '@plug-atlas/types';
import { useUpdateRole, usePermissions } from '@plug-atlas/api-hooks';
interface RoleEditDialogProps {
    isOpen: boolean;
    role: RoleResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RoleEditDialog({ isOpen, role, onClose, onSuccess }: RoleEditDialogProps) {
    const { trigger: updateRole, isMutating: isUpdateRole } = useUpdateRole();
    const { data: permissionsGroup } = usePermissions();

    const editRoleForm = useForm<RoleUpdateRequest>({
        resolver: zodResolver(RoleUpdateRequestSchema),
        mode: 'onChange'
    });

    useEffect(() => {
        if(role){
            editRoleForm.reset({
                name: role.name || '',
                description: role.description || '',
                permissionGroupIds: role.permissions?.map(p => p.id) || []
            })
        }
    }, [role, editRoleForm]);

    const resetEditRoleForm = useCallback(() => {
        editRoleForm.reset();
        onClose();
    }, [editRoleForm, onClose]);

    const submitEditRoleForm = useCallback (async (data: RoleUpdateRequest) => {
        if(!role) return;

        try{
            await updateRole({
                id: role.id,
                data:{
                    name: data.name,
                    description: data.description,
                    permissionGroupIds: data.permissionGroupIds
                }
            });
            toast.success('역할 수정 성공');
            onSuccess();
            resetEditRoleForm();
        } catch(error){ 
            toast.error('역할 수정 실패');
            console.error(error);
        }
    }, [role, updateRole, onSuccess, resetEditRoleForm]);

    if (!role) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if(!open){
                resetEditRoleForm();
            }
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>역할 수정</DialogTitle>
                </DialogHeader>
                <Form onSubmit={editRoleForm.handleSubmit(submitEditRoleForm)} className="space-y-4">
                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="name">이름</FormLabel>
                            <FormControl>
                                <Input 
                                    id="name"
                                    type="text"
                                    placeholder="이름을 입력해주세요."
                                    {...editRoleForm.register('name')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {editRoleForm.formState.errors.name?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="description">설명</FormLabel>
                            <FormControl>
                                <Input 
                                    id="description"
                                    type="text"
                                    placeholder="역할 설명을 입력해주세요."
                                    {...editRoleForm.register('description')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {editRoleForm.formState.errors.description?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="permissionGroupIds">권한</FormLabel>
                            <Controller
                                name="permissionGroupIds"
                                control={editRoleForm.control}
                                render={({ field }) => (
                                    <FormControl className="flex gap-4">
                                        {permissionsGroup?.map((permissionGroup) => {
                                            const isChecked = field.value?.includes(permissionGroup.id) ?? false;
                                            
                                            return (
                                                <div key={permissionGroup.id} className="flex items-center gap-2">
                                                    <Checkbox 
                                                        id={`edit-${permissionGroup.id.toString()}`}
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            const currentValue = field.value || [];
                                                            if (checked) {
                                                                field.onChange([...currentValue, permissionGroup.id]);
                                                            } else {
                                                                field.onChange(currentValue.filter(id => id !== permissionGroup.id));
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={`edit-${permissionGroup.id.toString()}`}>{permissionGroup.name}</Label>
                                                </div>
                                            );
                                        })}
                                    </FormControl>
                                )}
                            />
                            <FormMessage className="text-sm text-error-600">
                                {editRoleForm.formState.errors.permissionGroupIds?.message}
                            </FormMessage>
                        </FormItem>

                    </FormField>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={resetEditRoleForm}>취소</Button>
                        <Button type="submit" variant="default" className="flex-1" disabled={isUpdateRole || !editRoleForm.formState.isValid}>{isUpdateRole ? '수정중...' : '수정'}</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}