import { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, toast, Checkbox, Label, Dialog, DialogContent, DialogHeader, DialogTitle, Spinner } from '@plug-atlas/ui';
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
                <Form onSubmit={editUserForm.handleSubmit(submitEditUserForm)} className="space-y-4">
                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="username">아이디</FormLabel>
                            <FormControl>
                                <Input 
                                    id="username"
                                    type="text"
                                    value={user.username}
                                    disabled
                                    className="bg-gray-100"
                                />
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="name">이름</FormLabel>
                            <FormControl>
                                <Input 
                                    id="name"
                                    type="text"
                                    placeholder="이름을 입력해주세요."
                                    {...editUserForm.register('name')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {editUserForm.formState.errors.name?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="phoneNumber">전화번호</FormLabel>
                            <FormControl>
                                <Input 
                                    id="phoneNumber"
                                    type="text"
                                    placeholder="전화번호를 입력해주세요. (ex: 010-1234-5678)"
                                    {...editUserForm.register('phoneNumber')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {editUserForm.formState.errors.phoneNumber?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="department">부서</FormLabel>
                            <FormControl>
                                <Input 
                                    id="department"
                                    type="text"
                                    placeholder="부서를 입력해주세요."
                                    {...editUserForm.register('department')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {editUserForm.formState.errors.department?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel>역할</FormLabel>
                            <Controller
                                name="roleIds"
                                control={editUserForm.control}
                                render={({ field }) => {
                                    return (
                                        <FormControl>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
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
                                        </FormControl>
                                    );
                                }}
                            />
                            <FormMessage className="text-sm text-error-600">
                                {editUserForm.formState.errors.roleIds?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={resetEditUserForm}>취소</Button>
                        <Button type="submit" variant="default" className="flex-1" disabled={isUpdateUser || !editUserForm.formState.isValid}>
                            {isUpdateUser ? (<> 수정중... <Spinner size="sm" /> </>) : '수정'}
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}