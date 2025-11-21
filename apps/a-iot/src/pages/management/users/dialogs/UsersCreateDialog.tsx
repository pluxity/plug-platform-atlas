import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ModalForm, ModalFormItem, ModalFormField, ModalFormContainer, Input, toast, Checkbox, Label, Dialog, DialogContent, DialogHeader, DialogTitle, Spinner, DialogFooter } from '@plug-atlas/ui';
import { useCreateAdminUser, useRoles } from '@plug-atlas/api-hooks';
import { UserCreateRequest, UserCreateRequestSchema } from '@plug-atlas/types';

interface UsersCreateDialogProps{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserCreateDialog({ isOpen, onClose, onSuccess }: UsersCreateDialogProps) {
    const { trigger: createUser, isMutating: isCreateUser } = useCreateAdminUser();
    const { data: roles } = useRoles();

    const createUserForm = useForm<UserCreateRequest>({
        resolver: zodResolver(UserCreateRequestSchema),
        defaultValues: {
            username: '',
            password: '',
            name: '',
            phoneNumber: '',
            department: '',
            roleIds: []
        },
        mode: 'onChange'
    });

    const resetCreateUserForm = useCallback(() => {
        createUserForm.reset();
        onClose();
    }, [createUserForm, onClose]);

    const submitCreateUserForm = useCallback(async (data: UserCreateRequest) => {
        try{
            await createUser(data);
            toast.success('사용자 생성 성공');
            onSuccess();
            resetCreateUserForm();
        } catch(error){
            toast.error('사용자 생성 실패');
            console.error(error);
        }
    }, [createUser, onSuccess, resetCreateUserForm]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetCreateUserForm();
            }
        }}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>사용자 생성</DialogTitle>
                </DialogHeader>
                <ModalForm {...createUserForm}>
                    <form onSubmit={createUserForm.handleSubmit(submitCreateUserForm)} className="p-4">
                        <ModalFormContainer>
                            <ModalFormField>
                                <Controller
                                    name="username"
                                    control={createUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="아이디" 
                                            message={createUserForm.formState.errors.username?.message}
                                        >
                                            <Input 
                                                {...field}
                                                id="username" 
                                                type="text" 
                                                placeholder="아이디를 입력해주세요." 
                                                aria-label="아이디"
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="password"
                                    control={createUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="비밀번호" 
                                            message={createUserForm.formState.errors.password?.message}
                                        >
                                            <Input 
                                                {...field}
                                                id="password" 
                                                type="password" 
                                                placeholder="비밀번호를 입력해주세요." 
                                                aria-label="비밀번호"
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="name"
                                    control={createUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="이름" 
                                            message={createUserForm.formState.errors.name?.message}
                                        >
                                            <Input 
                                                {...field}
                                                id="name" 
                                                type="text" 
                                                placeholder="이름을 입력해주세요." 
                                                aria-label="이름"
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="phoneNumber"
                                    control={createUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="전화번호" 
                                            message={createUserForm.formState.errors.phoneNumber?.message}
                                        >
                                            <Input 
                                                {...field}
                                                id="phoneNumber" 
                                                type="text" 
                                                placeholder="전화번호를 입력해주세요. (ex: 010-1234-5678)" 
                                                aria-label="전화번호"
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="department"
                                    control={createUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="부서" 
                                            message={createUserForm.formState.errors.department?.message}
                                        >
                                            <Input 
                                                {...field}
                                                id="department" 
                                                type="text" 
                                                placeholder="부서를 입력해주세요." 
                                                aria-label="부서"
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="roleIds"
                                    control={createUserForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="역할"
                                            message={createUserForm.formState.errors.roleIds?.message}
                                        >
                                            <div className="flex flex-wrap gap-x-6 gap-y-4 max-h-[100px] p-0 overflow-y-auto p-1">
                                                {roles && roles.length > 0 ? (
                                                    roles.map(role => {
                                                        const checkboxId = `create-role-${role.id.toString()}`;
                                                        const isChecked = field.value?.includes(role.id) ?? false;
                                                        
                                                        return (
                                                            <div key={role.id} className="flex items-center gap-2">
                                                                <Checkbox 
                                                                    id={checkboxId}
                                                                    checked={isChecked}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentValue = field.value || [];
                                                                        if (checked) {
                                                                            field.onChange([...currentValue, role.id]);
                                                                        } else {
                                                                            field.onChange(currentValue.filter(id => id !== role.id));
                                                                        }
                                                                    }}
                                                                />
                                                                <Label htmlFor={checkboxId}>{role.name}</Label>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-gray-500 text-sm">사용 가능한 역할이 없습니다.</div>
                                                )}
                                            </div>
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>
                        </ModalFormContainer>

                        <DialogFooter>
                            <Button type="button" variant="outline" className="min-w-30" onClick={resetCreateUserForm}>
                                취소
                            </Button>
                            <Button type="submit" variant="default" className="min-w-30" disabled={isCreateUser || !createUserForm.formState.isValid}>
                                {isCreateUser ? (<> 저장중... <Spinner size="sm" /> </>) : '저장'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    )
}