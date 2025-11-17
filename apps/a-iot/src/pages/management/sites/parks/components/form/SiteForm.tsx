import {Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input, Label, DialogFooter} from '@plug-atlas/ui';
import {SiteCreateRequest} from "../../../../../../services/types/site.ts";
import CesiumPolygonDrawer from "./CesiumPolygonDrawer.tsx";
import {useUploadFile} from '@plug-atlas/api-hooks';
import {useState, useRef} from 'react';

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
                                     submitButtonText
                                 }: SiteFormProps) {

    const {trigger: uploadFile, isMutating: isUploading} = useUploadFile();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePolygonComplete = (wktString: string) => {
        onFormFieldChange('location', wktString);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setPreviewUrl(reader.result);
            }
        };
        reader.readAsDataURL(file);

        // 파일 업로드
        try {
            const formData = new FormData();
            formData.append('file', file);

            const thumbnailId = await uploadFile(formData);
            onFormFieldChange('thumbnailId', thumbnailId);
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            // 미리보기 제거
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveThumbnail = () => {
        setPreviewUrl(null);
        onFormFieldChange('thumbnailId', undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">공원명</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => onFormFieldChange('name', e.target.value)}
                            placeholder="공원명을 입력하세요"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="thumbnail">썸네일 이미지</Label>
                        <div className="space-y-2">
                            <Input
                                ref={fileInputRef}
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isUploading}
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
                                        onClick={handleRemoveThumbnail}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {isUploading && (
                                <p className="text-sm text-muted-foreground">업로드 중...</p>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">설명</Label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => onFormFieldChange('description', e.target.value)}
                            placeholder="공원에 대한 설명을 입력하세요"
                            className="min-h-[80px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="location">위치 정보</Label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => onFormFieldChange('location', e.target.value)}
                                    placeholder="지도에서 영역을 그려주세요"
                                    className="flex-1"
                                />
                            </div>
                            <div className="border rounded-md p-4">
                                <CesiumPolygonDrawer
                                    onPolygonComplete={handlePolygonComplete}
                                    initialWkt={formData.location}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? `${submitButtonText} 중...` : submitButtonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}