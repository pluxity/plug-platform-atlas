import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, toast, Checkbox, Label, Dialog, DialogContent, DialogHeader, DialogTitle } from '@plug-atlas/ui';
import { useCreateAdminUser, useRoles } from '@plug-atlas/api-hooks';
import { UserCreateRequest, UserCreateRequestSchema } from '@plug-atlas/types';

interface UsersCreateFormProps{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserCreateForm({ isOpen, onClose, onSuccess }: UsersCreateFormProps) {
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>사용자 생성</DialogTitle>
                </DialogHeader>
                <Form onSubmit={createUserForm.handleSubmit(submitCreateUserForm)} className="space-y-4">
                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="username">아이디</FormLabel>
                            <FormControl>
                                <Input 
                                    id="username"
                                    type="text"
                                    placeholder="아이디를 입력해주세요."
                                    {...createUserForm.register('username')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {createUserForm.formState.errors.username?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="password">비밀번호</FormLabel>
                            <FormControl>
                                <Input 
                                    id="password"
                                    type="password"
                                    placeholder="비밀번호를 입력해주세요."
                                    {...createUserForm.register('password')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {createUserForm.formState.errors.password?.message}
                            </FormMessage>
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
                                    {...createUserForm.register('name')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {createUserForm.formState.errors.name?.message}
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
                                    {...createUserForm.register('phoneNumber')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {createUserForm.formState.errors.phoneNumber?.message}
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
                                    {...createUserForm.register('department')}
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-error-600">
                                {createUserForm.formState.errors.department?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <FormField>
                        <FormItem>
                            <FormLabel htmlFor="roleIds">역할</FormLabel>
                            <Controller
                                name="roleIds"
                                control={createUserForm.control}
                                render={({ field }) => (
                                    <FormControl className="flex gap-4">
                                        {roles?.map(role => {
                                            const isChecked = field.value?.includes(role.id) ?? false;
                                            
                                            return (
                                                <div key={role.id} className="flex items-center gap-2">
                                                    <Checkbox 
                                                        id={`create-${role.id.toString()}`}
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
                                                    <Label htmlFor={`create-${role.id.toString()}`}>{role.name}</Label>
                                                </div>
                                            );
                                        })}
                                    </FormControl>
                                )}
                            />
                            <FormMessage className="text-sm text-error-600">
                                {createUserForm.formState.errors.roleIds?.message}
                            </FormMessage>
                        </FormItem>
                    </FormField>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={resetCreateUserForm}>취소</Button>
                        <Button type="submit" variant="default" className="flex-1" disabled={isCreateUser || !createUserForm.formState.isValid}>{isCreateUser ? '저장중...' : '저장'}</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}