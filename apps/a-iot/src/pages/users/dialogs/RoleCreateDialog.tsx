import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, toast, Checkbox, Label, Dialog, DialogContent, DialogHeader, DialogTitle } from '@plug-atlas/ui';
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>역할 생성</DialogTitle>
                </DialogHeader>
                <Form onSubmit={createRoleForm.handleSubmit(submitCreateRoleForm)} className="space-y-4">
                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="name">이름</FormLabel>
                            <FormControl>
                                <Input 
                                    id="name"
                                    type="text"
                                    placeholder="이름을 입력해주세요."
                                    {...createRoleForm.register('name')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {createRoleForm.formState.errors.name?.message}
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
                                    {...createRoleForm.register('description')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {createRoleForm.formState.errors.description?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="permissionGroupIds">권한</FormLabel>
                            <Controller
                                name="permissionGroupIds"
                                control={createRoleForm.control}
                                render={({ field }) => (
                                    <FormControl className="flex gap-4">
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
                                    </FormControl>
                                )}
                            />
                            <FormMessage className="text-sm text-error-600">
                                {createRoleForm.formState.errors.permissionGroupIds?.message}
                            </FormMessage>
                        </FormItem>

                    </FormField>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={resetCreateRoleForm}>취소</Button>
                        <Button type="submit" variant="default" className="flex-1" disabled={isCreateRole || !createRoleForm.formState.isValid}>{isCreateRole ? '저장중...' : '저장'}</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}