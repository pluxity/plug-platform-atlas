import { useForm, Controller } from 'react-hook-form';
import { useCallback, useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input, DialogFooter, ModalForm, ModalFormItem, ModalFormField, ModalFormContainer, Spinner, Label } from '@plug-atlas/ui';
import { SiteCreateRequest } from "../../../../../../services/types";
import CesiumPolygonDrawer from "./CesiumPolygonDrawer.tsx";
import { useUploadFile } from '@plug-atlas/api-hooks';
import { X } from 'lucide-react';

interface SiteFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    formData: SiteCreateRequest;
    onFormFieldChange: (field: keyof SiteCreateRequest, value: string | number | undefined) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    submitButtonText: string;
    initialThumbnailUrl?: string;
}

export default function SiteForm({
                                     isOpen,
                                     onOpenChange,
                                     title,
                                     formData,
                                     onFormFieldChange,
                                     onSubmit,
                                     onCancel,
                                     isLoading = false,
                                     submitButtonText,
                                     initialThumbnailUrl
                                 }: SiteFormProps) {

    const {trigger: uploadFile, isMutating: isUploading} = useUploadFile();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const siteForm = useForm<SiteCreateRequest>({
        defaultValues: {
            name: '',
            location: '',
            description: '',
            thumbnailId: undefined
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (isOpen) {
            siteForm.reset({
                name: formData.name || '',
                location: formData.location || '',
                description: formData.description || '',
                thumbnailId: formData.thumbnailId
            });
        }
    }, [isOpen, formData, siteForm]);

    useEffect(() => {
        if (initialThumbnailUrl) {
            setPreviewUrl(initialThumbnailUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [initialThumbnailUrl]);

    const resetForm = useCallback(() => {
        siteForm.reset();
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onCancel();
    }, [siteForm, onCancel]);

    const handleSubmit = useCallback(async () => {
        onSubmit();
    }, [onSubmit]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: number | undefined) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setPreviewUrl(reader.result);
            }
        };
        reader.readAsDataURL(file);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const thumbnailId = await uploadFile(formData);
            onChange(thumbnailId);
            onFormFieldChange('thumbnailId', thumbnailId);
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            setPreviewUrl(null);
            onChange(undefined);
            onFormFieldChange('thumbnailId', undefined);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveThumbnail = (onChange: (value: number | undefined) => void) => {
        setPreviewUrl(null);
        onChange(undefined);
        onFormFieldChange('thumbnailId', undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetForm();
            } else {
                onOpenChange(open);
            }
        }}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[85vh] overflow-y-auto">
                    <ModalForm {...siteForm}>
                        <form onSubmit={siteForm.handleSubmit(handleSubmit)} className="p-4">
                            <ModalFormContainer>
                                <ModalFormField>
                                <Controller
                                    name="name"
                                    control={siteForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem
                                            label="공원명"
                                            message={siteForm.formState.errors.name?.message}
                                        >
                                            <Input
                                                {...field}
                                                id="name"
                                                placeholder="공원명을 입력하세요"
                                                aria-label="공원명"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onFormFieldChange('name', e.target.value);
                                                }}
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                                </ModalFormField>

                                <ModalFormField>
                                    <Controller
                                        name="thumbnailId"
                                        control={siteForm.control}
                                        render={({ field }) => (
                                            <ModalFormItem
                                                label="썸네일 이미지"
                                                message={siteForm.formState.errors.thumbnailId?.message}
                                            >
                                                <div className="space-y-2">
                                                    <Input
                                                        ref={fileInputRef}
                                                        id="thumbnail"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, field.onChange)}
                                                        disabled={isUploading}
                                                        aria-label="썸네일 이미지"
                                                    />
                                                    {previewUrl && (
                                                        <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                                                            <img
                                                                src={previewUrl}
                                                                alt="썸네일 미리보기"
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveThumbnail(field.onChange)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                                aria-label="썸네일 제거"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {isUploading && (
                                                        <p className="text-sm text-muted-foreground">업로드 중...</p>
                                                    )}
                                                </div>
                                            </ModalFormItem>
                                        )}
                                    />
                                </ModalFormField>

                                <ModalFormField>
                                <Controller
                                    name="description"
                                    control={siteForm.control}
                                    render={({ field }) => (
                                        <ModalFormItem
                                            label="설명"
                                            message={siteForm.formState.errors.description?.message}
                                        >
                                            <textarea
                                                {...field}
                                                id="description"
                                                placeholder="공원에 대한 설명을 입력하세요"
                                                className="min-h-[80px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring w-full"
                                                aria-label="설명"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onFormFieldChange('description', e.target.value);
                                                }}
                                            />
                                        </ModalFormItem>
                                    )}
                                />
                                </ModalFormField>

                            </ModalFormContainer>

                            <div className="grid gap-2">
                                <Label htmlFor="location" className="text-sm bg-[#dfe4eb] text-muted-foreground font-bold border-b border-[#bbbecf] p-4 text-center block">위치 정보</Label>
                                <Controller
                                    name="location"
                                    control={siteForm.control}
                                    render={({ field }) => (
                                        <div className="space-y-2">
                                            <Input
                                                {...field}
                                                id="location"
                                                placeholder="아래 지도에서 영역을 그려주세요"
                                                className="flex-1"
                                                aria-label="위치 정보"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onFormFieldChange('location', e.target.value);
                                                }}
                                            />
                                            <div className="border rounded-md p-4">
                                                <CesiumPolygonDrawer
                                                    onPolygonComplete={(wktString) => {
                                                        field.onChange(wktString);
                                                        onFormFieldChange('location', wktString);
                                                    }}
                                                    initialWkt={field.value}
                                                />
                                            </div>
                                            {siteForm.formState.errors.location && (
                                                <p className="text-sm text-destructive">
                                                    {siteForm.formState.errors.location.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                    disabled={isLoading || isUploading}
                                    className="min-w-30"
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || isUploading || !siteForm.formState.isValid}
                                    className="min-w-30"
                                >
                                    {isLoading ? `${submitButtonText} 중...` : submitButtonText}
                                </Button>
                            </DialogFooter>
                        </form>
                    </ModalForm>
                </div>
            </DialogContent>
        </Dialog>
    );
}