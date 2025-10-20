import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input, Label } from '@plug-atlas/ui';
import {SiteCreateRequest} from "../../../../services/hooks/park/parkType.ts";

interface ParkFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    formData: SiteCreateRequest;
    onFormFieldChange: (field: keyof SiteCreateRequest, value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    submitButtonText: string;
}

export default function ParkForm({
                                     isOpen,
                                     onOpenChange,
                                     title,
                                     formData,
                                     onFormFieldChange,
                                     onSubmit,
                                     onCancel,
                                     isLoading = false,
                                     submitButtonText
                                 }: ParkFormProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
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
                        <Label htmlFor="location">위치 정보</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => onFormFieldChange('location', e.target.value)}
                            placeholder="POLYGON(..)"
                        />
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
                </div>
                <div className="flex justify-end gap-2">
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
                </div>
            </DialogContent>
        </Dialog>
    );
}