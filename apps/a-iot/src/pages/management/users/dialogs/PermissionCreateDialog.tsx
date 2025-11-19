import { Dialog, DialogContent, DialogHeader, DialogTitle, ModalForm, ModalFormItem, ModalFormField, ModalFormContainer, Input, Button, toast, Label, Checkbox, Spinner, DialogFooter } from '@plug-atlas/ui';
import { useCreatePermission, useResourceTypes } from '@plug-atlas/api-hooks';
import { PermissionGroupCreateRequest, PermissionGroupCreateRequestSchema, ResourceTypeResponse } from '@plug-atlas/types';
import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePermissionResources, usePermissionCheckbox } from '../../../../services/hooks';
import type { PermissionResourceItem } from '../../../../services/types';

interface PermissionCreateDialogProps{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PermissionCreateDialog({ isOpen, onClose, onSuccess }: PermissionCreateDialogProps) {
    const { trigger: createPermission, isMutating: isCreating } = useCreatePermission();
    const { data: resourceTypes } = useResourceTypes();
    const { data: resourceData = {} } = usePermissionResources();

    const { isSelected, handleCheckboxChange } = usePermissionCheckbox();

    const createPermissionForm = useForm<PermissionGroupCreateRequest>({
        resolver: zodResolver(PermissionGroupCreateRequestSchema),
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
        },
        mode: 'onChange'
    });

    const resetPermissionCreateForm = useCallback(() => {
        createPermissionForm.reset();
        onClose();
    }, [createPermissionForm, onClose]);

    const submitCreatePermissionForm = useCallback(async (data: PermissionGroupCreateRequest) => {
        try {
            await createPermission(data);
            toast.success('권한 생성 성공');
            onSuccess();
            resetPermissionCreateForm();
        } catch (error) {
            toast.error('권한 생성 실패');
            console.error(error);
        }
    }, [createPermission, onSuccess, resetPermissionCreateForm]);

    return(
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetPermissionCreateForm();
            }
        }}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>권한 생성</DialogTitle>
                </DialogHeader>
                <ModalForm {...createPermissionForm}>
                    <form onSubmit={createPermissionForm.handleSubmit(submitCreatePermissionForm)} className="p-4">
                        <ModalFormContainer>
                            <ModalFormField>
                                <Controller
                                    name="name"
                                    control={createPermissionForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="권한 이름" 
                                            message={createPermissionForm.formState.errors.name?.message}
                                        >
                                            <Input 
                                                {...field}
                                                id="name" 
                                                type="text" 
                                                placeholder="권한 이름을 입력해주세요." 
                                                aria-label="권한 이름"
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="description"
                                    control={createPermissionForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="권한 설명" 
                                            message={createPermissionForm.formState.errors.description?.message}
                                        >
                                            <Input 
                                                {...field}
                                                id="description" 
                                                type="text" 
                                                placeholder="권한 설명을 입력해주세요." 
                                                aria-label="권한 설명"
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>

                            <ModalFormField>
                                <Controller
                                    name="permissions"
                                    control={createPermissionForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem 
                                            label="권한 목록"
                                            message={createPermissionForm.formState.errors.permissions?.message}
                                        >
                                            <div className="flex flex-wrap gap-x-6 gap-y-4 max-h-[100px] p-0 overflow-y-auto p-1">
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
                                        </ModalFormItem>
                                    )}
                                />
                            </ModalFormField>
                        </ModalFormContainer>

                        <DialogFooter>
                            <Button type="button" variant="outline" className="min-w-30" onClick={resetPermissionCreateForm}>
                                취소
                            </Button>
                            <Button type="submit" variant="default" className="min-w-30" disabled={isCreating || !createPermissionForm.formState.isValid}>
                                {isCreating ? (<> 저장중... <Spinner size="sm" /> </>) : '저장'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    )
}