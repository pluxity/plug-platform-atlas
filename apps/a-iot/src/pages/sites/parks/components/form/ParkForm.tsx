import {useState} from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input, Label } from '@plug-atlas/ui';
import {SiteCreateRequest} from "../../../../../services/types/site/site.ts";
import CesiumPolygonDrawer from "./CesiumPolygonDrawer.tsx";

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
    const [showMapDrawer, setShowMapDrawer] = useState(false);

    const handlePolygonComplete = (wktString: string) => {
        onFormFieldChange('location', wktString);
        setShowMapDrawer(false);
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowMapDrawer(!showMapDrawer)}
                                >
                                    {showMapDrawer ? '지도 숨기기' : '지도에서 선택'}
                                </Button>
                            </div>

                            {showMapDrawer && (
                                <div className="border rounded-md p-4">
                                    <CesiumPolygonDrawer
                                        onPolygonComplete={handlePolygonComplete}
                                        initialWkt={formData.location}
                                    />
                                </div>
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