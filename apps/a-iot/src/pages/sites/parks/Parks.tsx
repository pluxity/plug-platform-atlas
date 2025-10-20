import { useState } from 'react';
import { DataTable, Dialog, DialogTrigger, Button } from '@plug-atlas/ui';
import { Plus } from 'lucide-react';
import ParkForm from './components/form/ParkForm.tsx';
import DeleteConfirmation from './components/data/DeleteConfirmation.tsx';
import { useParkActions } from "../../../services/hooks/park/useParkActions";
import { createParkColumns } from "./components/data/ParkColumns.tsx";
import { useSites } from "../../../services/hooks/park/park";
import ErrorDisplay from "../../../components/error/ErrorDisplay";
import {Site} from "../../../services/hooks/park/parkType.ts";
import {useParkForm} from "../../../services/hooks/park/useParkfForm.ts";

export default function Parks() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPark, setSelectedPark] = useState<Site | null>(null);

    const { data: parks = [], error, mutate } = useSites();
    const { formData, resetForm, setFormFromPark, updateFormField } = useParkForm();
    const { createPark, updatePark, deletePark, isCreating, isUpdating, isDeleting } = useParkActions();

    const handleCreatePark = async () => {
        const success = await createPark(formData);
        if (success) {
            setIsCreateModalOpen(false);
            resetForm();
            mutate();
        }
    };

    const handleUpdatePark = async () => {
        if (!selectedPark) return;

        const success = await updatePark(selectedPark.id, formData);
        if (success) {
            setIsEditModalOpen(false);
            setSelectedPark(null);
            resetForm();
            mutate();
        }
    };

    const handleDeletePark = async () => {
        if (!selectedPark) return;

        const success = await deletePark(selectedPark.id);
        if (success) {
            setIsDeleteDialogOpen(false);
            setSelectedPark(null);
            mutate();
        }
    };

    const openEditModal = (park: Site) => {
        setSelectedPark(park);
        setFormFromPark(park);
        setIsEditModalOpen(true);
    };

    const openDeleteDialog = (park: Site) => {
        setSelectedPark(park);
        setIsDeleteDialogOpen(true);
    };

    const handleCreateCancel = () => {
        setIsCreateModalOpen(false);
        resetForm();
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setSelectedPark(null);
        resetForm();
    };

    if (error) {
        return <ErrorDisplay onRetry={() => mutate()} />;
    }

    const columns = createParkColumns();

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
                    data={parks}
                    onRowEdit={(park: Site) => openEditModal(park)}
                    onRowDelete={(park: Site) => openDeleteDialog(park)}
                />
            </div>

            <ParkForm
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                title="새 공원 추가"
                formData={formData}
                onFormFieldChange={updateFormField}
                onSubmit={handleCreatePark}
                onCancel={handleCreateCancel}
                isLoading={isCreating}
                submitButtonText="추가"
            />

            <ParkForm
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                title="공원 정보 수정"
                formData={formData}
                onFormFieldChange={updateFormField}
                onSubmit={handleUpdatePark}
                onCancel={handleEditCancel}
                isLoading={isUpdating}
                submitButtonText="수정"
            />

            <DeleteConfirmation
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                itemName={selectedPark?.name || ''}
                onConfirm={handleDeletePark}
                isLoading={isDeleting}
            />
        </div>
    );
}