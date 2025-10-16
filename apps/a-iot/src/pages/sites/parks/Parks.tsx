import React, { useState, useEffect } from 'react';
import {
    DataTable, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button,Input, Label, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@plug-atlas/ui'
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    useSites,
    useCreateSite,
    useUpdateSite,
    useDeleteSite,
    Site,
    SiteCreateRequest
} from '@plug-atlas/api-hooks';

interface ParkFormData {
    name: string;
    location: string;
    description: string;
}

export default function Parks() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPark, setSelectedPark] = useState<Site | null>(null);
    const [formData, setFormData] = useState<ParkFormData>({
        name: '',
        location: '',
        description: ''
    });

    const { data: parks = [], isLoading, error } = useSites();
    const createSiteMutation = useCreateSite();
    const updateSiteMutation = useUpdateSite();
    const deleteSiteMutation = useDeleteSite();

    const handleCreatePark = async () => {
        try {
            await createSiteMutation.mutateAsync(formData);
            toast.success('공원이 성공적으로 생성되었습니다.');
            setIsCreateModalOpen(false);
            resetForm();
        } catch (error) {
            toast.error('공원 생성에 실패했습니다.');
            console.error('Error creating park:', error);
        }
    };

    const handleUpdatePark = async () => {
        if (!selectedPark) return;

        try {
            await updateSiteMutation.mutateAsync({
                id: selectedPark.id,
                data: formData
            });
            toast.success('공원 정보가 성공적으로 수정되었습니다.');
            setIsEditModalOpen(false);
            setSelectedPark(null);
            resetForm();
        } catch (error) {
            toast.error('공원 수정에 실패했습니다.');
            console.error('Error updating park:', error);
        }
    };

    const handleDeletePark = async () => {
        if (!selectedPark) return;

        try {
            await deleteSiteMutation.mutateAsync(selectedPark.id);
            toast.success('공원이 성공적으로 삭제되었습니다.');
            setIsDeleteDialogOpen(false);
            setSelectedPark(null);
        } catch (error) {
            toast.error('공원 삭제에 실패했습니다.');
            console.error('Error deleting park:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            description: ''
        });
    };

    const openEditModal = (park: Site) => {
        setSelectedPark(park);
        setFormData({
            name: park.name,
            location: park.location,
            description: park.description
        });
        setIsEditModalOpen(true);
    };

    const openDeleteDialog = (park: Site) => {
        setSelectedPark(park);
        setIsDeleteDialogOpen(true);
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <p className="text-destructive">데이터를 불러오는 중 오류가 발생했습니다.</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        다시 시도
                    </Button>
                </div>
            </div>
        );
    }

    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }: any) => <div className="font-medium">{row.getValue('id')}</div>,
        },
        {
            accessorKey: 'name',
            header: '공원명',
            cell: ({ row }: any) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'description',
            header: '설명',
            cell: ({ row }: any) => (
                <div className="max-w-xs truncate text-muted-foreground">
                    {row.getValue('description')}
                </div>
            ),
        },
        {
            accessorKey: 'location',
            header: '위치',
            cell: ({ row }: any) => (
                <div className="max-w-xs truncate text-muted-foreground">
                    {row.getValue('location')}
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: '생성일',
            cell: ({ row }: any) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.getValue('createdAt')).toLocaleDateString('ko-KR')}
                </div>
            ),
        },
        {
            id: 'actions',
            header: '작업',
            cell: ({ row }: any) => {
                const park = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(park)}
                            className="h-8 w-8 p-0"
                            disabled={updateSiteMutation.isPending}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(park)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            disabled={deleteSiteMutation.isPending}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">공원 관리</h1>
                    <p className="text-muted-foreground">
                        공원 정보를 관리하고 모니터링하세요.
                    </p>
                </div>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="mr-2 h-4 w-4" />
                            공원 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>새 공원 추가</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">공원명</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="공원명을 입력하세요"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">위치 정보</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="POLYGON(..)"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">설명</Label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="공원에 대한 설명을 입력하세요"
                                    className="min-h-[80px]"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateModalOpen(false)}
                                disabled={createSiteMutation.isPending}
                            >
                                취소
                            </Button>
                            <Button
                                onClick={handleCreatePark}
                                disabled={createSiteMutation.isPending}
                            >
                                {createSiteMutation.isPending ? '추가 중...' : '추가'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg border bg-card">
                <DataTable
                    columns={columns}
                    data={parks}
                    loading={isLoading}
                />
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>공원 정보 수정</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">공원명</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="공원명을 입력하세요"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-location">위치 정보</Label>
                            <Input
                                id="edit-location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="POLYGON(..)"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">설명</Label>
                            <textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="공원에 대한 설명을 입력하세요"
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={updateSiteMutation.isPending}
                        >
                            취소
                        </Button>
                        <Button
                            onClick={handleUpdatePark}
                            disabled={updateSiteMutation.isPending}
                        >
                            {updateSiteMutation.isPending ? '수정 중...' : '수정'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>공원 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            정말로 "{selectedPark?.name}" 공원을 삭제하시겠습니까?
                            이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteSiteMutation.isPending}>
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePark}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteSiteMutation.isPending}
                        >
                            {deleteSiteMutation.isPending ? '삭제 중...' : '삭제'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
