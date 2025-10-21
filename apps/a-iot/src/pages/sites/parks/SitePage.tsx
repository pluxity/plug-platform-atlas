import { useState } from 'react';
import { DataTable, Dialog, DialogTrigger, Button } from '@plug-atlas/ui';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import SiteForm from './components/form/SiteForm';
import DeleteConfirmation from './components/data/DeleteConfirmation.tsx';
import { useCreateSite, useUpdateSite, useDeleteSite, useSites } from "../../../services/hooks/site/useSite.ts";
import { createSiteColumns } from "./components/data/SiteColumns";
import ErrorDisplay from "../../../components/error/ErrorDisplay";
import type {Site} from "../../../services/types/site/site";
import {useSiteForm} from "../../../services/hooks/site/useSiteForm.ts";

export default function SitePage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);

    const { data: sites = [], error, mutate } = useSites();
    const { formData, resetForm, setFormFromSite, updateFormField } = useSiteForm();

    const createSiteMutation = useCreateSite({
        onSuccess: () => {
            toast.success('공원이 성공적으로 생성되었습니다.');
            setIsCreateModalOpen(false);
            resetForm();
            mutate();
        },
        onError: (error) => {
            toast.error('공원 생성에 실패했습니다.');
            console.error('Error creating site:', error);
        }
    });

    const updateSiteMutation = useUpdateSite({
        onSuccess: () => {
            toast.success('공원 정보가 성공적으로 수정되었습니다.');
            setIsEditModalOpen(false);
            setSelectedSite(null);
            resetForm();
            mutate();
        },
        onError: (error) => {
            toast.error('공원 수정에 실패했습니다.');
            console.error('Error updating site:', error);
        }
    });

    const deleteSiteMutation = useDeleteSite({
        onSuccess: () => {
            toast.success('공원이 성공적으로 삭제되었습니다.');
            setIsDeleteDialogOpen(false);
            setSelectedSite(null);
            mutate();
        },
        onError: (error) => {
            toast.error('공원 삭제에 실패했습니다.');
            console.error('Error deleting site:', error);
        }
    });

    const handleCreateSite = async () => {
        try {
            await createSiteMutation.trigger(formData);
        } catch (error) {
        }
    };

    const handleUpdateSite = async () => {
        if (!selectedSite) return;

        try {
            await updateSiteMutation.trigger({
                id: selectedSite.id,
                data: formData
            });
        } catch (error) {
        }
    };

    const handleDeleteSite = async () => {
        if (!selectedSite) return;

        try {
            await deleteSiteMutation.trigger(selectedSite.id);
        } catch (error) {
        }
    };

    const openEditModal = (site: Site) => {
        setSelectedSite(site);
        setFormFromSite(site);
        setIsEditModalOpen(true);
    };

    const openDeleteDialog = (site: Site) => {
        setSelectedSite(site);
        setIsDeleteDialogOpen(true);
    };

    const handleCreateCancel = () => {
        setIsCreateModalOpen(false);
        resetForm();
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setSelectedSite(null);
        resetForm();
    };

    if (error) {
        return <ErrorDisplay onRetry={() => mutate()} />;
    }

    const columns = createSiteColumns();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            공원 추가
                        </Button>
                    </DialogTrigger>
                </Dialog>
            </div>

            <div className="rounded-lg border bg-card">
                <DataTable
                    columns={columns}
                    data={sites}
                    onRowEdit={(site: Site) => openEditModal(site)}
                    onRowDelete={(site: Site) => openDeleteDialog(site)}
                />
            </div>

            <SiteForm
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                title="새 공원 추가"
                formData={formData}
                onFormFieldChange={updateFormField}
                onSubmit={handleCreateSite}
                onCancel={handleCreateCancel}
                isLoading={createSiteMutation.isMutating}
                submitButtonText="추가"
            />

            <SiteForm
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                title="공원 정보 수정"
                formData={formData}
                onFormFieldChange={updateFormField}
                onSubmit={handleUpdateSite}
                onCancel={handleEditCancel}
                isLoading={updateSiteMutation.isMutating}
                submitButtonText="수정"
            />

            <DeleteConfirmation
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                itemName={selectedSite?.name || ''}
                onConfirm={handleDeleteSite}
                isLoading={deleteSiteMutation.isMutating}
            />
        </div>
    );
}