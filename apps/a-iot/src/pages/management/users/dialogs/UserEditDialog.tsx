import { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ModalForm, ModalFormItem, ModalFormField, ModalFormContainer, Input, toast, Checkbox, Label, Dialog, DialogContent, DialogHeader, DialogTitle, Spinner, DialogFooter } from '@plug-atlas/ui';
import { useUpdateAdminUser, useRoles } from '@plug-atlas/api-hooks';
import { UserUpdateRequest, UserUpdateRequestSchema, UserResponse } from '@plug-atlas/types';

interface UserEditDialogProps {
  isOpen: boolean
  user: UserResponse | null
  onClose: () => void
  onSuccess: () => void
}

export default function UserEditDialog({ isOpen, user, onClose, onSuccess }: UserEditDialogProps) {
    const { trigger: updateUser, isMutating: isUpdateUser } = useUpdateAdminUser();
    const { data: roles } = useRoles();

    const editUserForm = useForm<UserUpdateRequest>({
        resolver: zodResolver(UserUpdateRequestSchema),
        mode: 'onChange'
    });

    useEffect(() => {
        if (user) {
            editUserForm.reset({
                name: user.name,
                phoneNumber: user.phoneNumber || '',
                department: user.department || '',
                roleIds: user.roles?.map(r => r.id) || []
            });
        }
    }, [user, editUserForm]);

    const resetEditUserForm = useCallback(() => {
        editUserForm.reset();
        onClose();
    }, [editUserForm, onClose]);

    const submitEditUserForm = useCallback(async (data: UserUpdateRequest) => {
        if (!user) return;
        
        try {
            await updateUser({
                id: user.id,
                data: {
                    name: data.name,
                    phoneNumber: data.phoneNumber,
                    department: data.department,
                    roleIds: data.roleIds
                }
            });
            toast.success('사용자 수정 성공');
            onSuccess();
            resetEditUserForm();
        } catch (error) {
            toast.error('사용자 수정 실패');
            console.error(error);
        }
    }, [user, updateUser, onSuccess, resetEditUserForm]);

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetEditUserForm();
            }
        }}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>사용자 정보 수정</DialogTitle>
                </DialogHeader>
                <ModalForm {...editUserForm}>
                    <form onSubmit={editUserForm.handleSubmit(submitEditUserForm)} className="space-y-4 p-4">
                        <ModalFormContainer>
                            <ModalFormField>
                                <ModalFormItem label="아이디">
                                    <Input 
                                        id="username"
                                        type="text"
                                        value={user.username}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </ModalFormItem>
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="name"
                                    control={editUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="이름"
                                            message={editUserForm.formState.errors.name?.message}
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
                                    name="phoneNumber"
                                    control={editUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="전화번호"
                                            message={editUserForm.formState.errors.phoneNumber?.message}
                                        >
                                            <Input 
                                                id="phoneNumber"
                                                type="text"
                                                placeholder="전화번호를 입력해주세요. (ex: 010-1234-5678)"
                                                {...field}
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="department"
                                    control={editUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="부서"
                                            message={editUserForm.formState.errors.department?.message}
                                        >
                                            <Input 
                                                id="department"
                                                type="text"
                                                placeholder="부서를 입력해주세요."
                                                {...field}
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="roleIds"
                                    control={editUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="역할"
                                            message={editUserForm.formState.errors.roleIds?.message}
                                        >
                                            <div className="flex flex-wrap gap-x-6 gap-y-4 max-h-[100px] p-0 overflow-y-auto p-1">
                                                {roles?.map(role => {
                                                    const checkboxId = `edit-role-${role.id}`;
                                                    const checked = field.value?.includes(role.id) ?? false;
                                                    
                                                    return (
                                                        <div key={role.id} className="flex items-center gap-2">
                                                            <Checkbox 
                                                                id={checkboxId}
                                                                checked={checked}
                                                                onCheckedChange={(isChecked) => {
                                                                    const currentValue = field.value || [];
                                                                    if (isChecked) {
                                                                        field.onChange([...currentValue, role.id]);
                                                                    } else {
                                                                        field.onChange(currentValue.filter(id => id !== role.id));
                                                                    }
                                                                }}
                                                            />
                                                            <Label htmlFor={checkboxId}>{role.name}</Label>
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
                            <Button type="button" variant="outline" className="min-w-30" onClick={resetEditUserForm}>취소</Button>
                            <Button type="submit" variant="default" className="min-w-30" disabled={isUpdateUser || !editUserForm.formState.isValid}>
                                {isUpdateUser ? (<> 수정중... <Spinner size="sm" /> </>) : '수정'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
}