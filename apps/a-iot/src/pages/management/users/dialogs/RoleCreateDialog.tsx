import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ModalForm, ModalFormItem, ModalFormField, ModalFormContainer, Input, toast, Checkbox, Label, Dialog, DialogContent, DialogHeader, DialogTitle, Spinner, DialogFooter } from '@plug-atlas/ui';
import { useCreateRole, usePermissions } from '@plug-atlas/api-hooks';
import { RoleCreateRequest, RoleCreateRequestSchema } from '@plug-atlas/types';
interface RoleCreateDialogProps{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RoleCreateDialog({ isOpen, onClose, onSuccess }: RoleCreateDialogProps) {
    const { trigger: createRole, isMutating: isCreateRole } = useCreateRole();
    const { data: permissionsGroup } = usePermissions();

    const createRoleForm = useForm<RoleCreateRequest>({
        resolver: zodResolver(RoleCreateRequestSchema),
        defaultValues: {
            name: '',
            description: '',
            permissionGroupIds: []
        },
        mode: 'onChange'
    });
    
    const resetCreateRoleForm = useCallback(() => {
        createRoleForm.reset();
        onClose();
    }, [createRoleForm, onClose]);

    const submitCreateRoleForm = useCallback(async (data: RoleCreateRequest) => {
        try{
            await createRole(data);
            toast.success('역할 생성 성공');
            onSuccess();
            resetCreateRoleForm();
        } catch(error){
            toast.error('역할 생성 실패');
            console.error(error);
        }
    }, [createRole, onSuccess, resetCreateRoleForm]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetCreateRoleForm();
            }
        }}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>역할 생성</DialogTitle>
                </DialogHeader>
                <ModalForm {...createRoleForm}>
                    <form onSubmit={createRoleForm.handleSubmit(submitCreateRoleForm)} className="space-y-4 p-4">
                        <ModalFormContainer>
                            <ModalFormField>
                                <Controller
                                    name="name"
                                    control={createRoleForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="이름"
                                            message={createRoleForm.formState.errors.name?.message}
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
                                    control={createRoleForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="설명"
                                            message={createRoleForm.formState.errors.description?.message}
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
                                    control={createRoleForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="권한"
                                            message={createRoleForm.formState.errors.permissionGroupIds?.message}
                                        >
                                            <div className="flex flex-wrap gap-x-6 gap-y-4 max-h-[100px] p-0 overflow-y-auto p-1">
                                                {permissionsGroup?.map((permissionGroup) => {
                                                    const isChecked = field.value?.includes(permissionGroup.id) ?? false;
                                                    
                                                    return (
                                                        <div key={permissionGroup.id} className="flex items-center gap-2">
                                                            <Checkbox 
                                                                id={`create-${permissionGroup.id.toString()}`}
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
                                                            <Label htmlFor={`create-${permissionGroup.id.toString()}`}>{permissionGroup.name}</Label>
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
                            <Button type="button" variant="outline" className="min-w-30" onClick={resetCreateRoleForm}>취소</Button>
                            <Button type="submit" variant="default" className="min-w-30" disabled={isCreateRole || !createRoleForm.formState.isValid}>{isCreateRole ? (<> 저장중... <Spinner size="sm" /> </>) : '저장'}</Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
}