import { useEffect, useCallback } from 'react';
import { Button, ModalForm, ModalFormItem, ModalFormField, ModalFormContainer, Input, toast, Checkbox, Label, Dialog, DialogContent, DialogHeader, DialogTitle, Spinner, DialogFooter } from '@plug-atlas/ui';
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
                name: role.name,
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
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>역할 수정</DialogTitle>
                </DialogHeader>
                <ModalForm {...editRoleForm}>
                    <form onSubmit={editRoleForm.handleSubmit(submitEditRoleForm)} className="space-y-4 p-4">
                        <ModalFormContainer>
                            <ModalFormField>
                                <Controller
                                    name="name"
                                    control={editRoleForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="이름"
                                            message={editRoleForm.formState.errors.name?.message}
                                        >
                                            <Input 
                                                id="name"
                                                type="text"
                                                placeholder="이름을 입력해주세요."
                                                {...field}
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="description"
                                    control={editRoleForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="설명"
                                            message={editRoleForm.formState.errors.description?.message}
                                        >
                                            <Input 
                                                id="description"
                                                type="text"
                                                placeholder="역할 설명을 입력해주세요."
                                                {...field}
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="permissionGroupIds"
                                    control={editRoleForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="권한"
                                            message={editRoleForm.formState.errors.permissionGroupIds?.message}
                                        >
                                            <div className="flex flex-wrap gap-x-6 gap-y-4 max-h-[100px] p-0 overflow-y-auto p-1">
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
                                            </div>
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>
                        </ModalFormContainer>

                        <DialogFooter>
                            <Button type="button" variant="outline" className="min-w-30" onClick={resetEditRoleForm}>취소</Button>
                            <Button type="submit" variant="default" className="min-w-30" disabled={isUpdateRole || !editRoleForm.formState.isValid}>{isUpdateRole ? (<> 수정중... <Spinner size="sm" /> </>) : '수정'}</Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
}