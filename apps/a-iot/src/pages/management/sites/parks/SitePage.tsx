import { useState, useEffect } from 'react';
import { DataTable, Dialog, DialogTrigger, Button } from '@plug-atlas/ui';
import { Plus } from 'lucide-react';
import { toast } from '@plug-atlas/ui';
import SiteForm from './components/form/SiteForm.tsx';
import DeleteConfirmation from './components/data/DeleteConfirmation.tsx';
import { useCreateSite, useUpdateSite, useDeleteSite, useSites } from "../../../../services/hooks";
import { useSearchBar, usePagination } from "../../../../services/hooks";
import { createSiteColumns } from "./components/data/SiteColumns.tsx";
import ErrorDisplay from "../../../../components/error/ErrorDisplay.tsx";
import type {Site} from "../../../../services/types";
import {useSiteForm} from "./components/form/useSiteForm.ts";
import { SearchBar } from "../../../../components/elements/SearchBar.tsx";
import { TablePagination } from "../../../../components/elements/Pagination.tsx";

export default function SitePage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);

    const { data: sites = [], error, mutate } = useSites();
    const { formData, resetForm, setFormFromSite, updateFormField } = useSiteForm();

    const createSiteMutation = useCreateSite();

    const updateSiteMutation = useUpdateSite();

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
            setIsCreateModalOpen(false);
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
            setIsEditModalOpen(false);
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

    const { searchTerm, filteredData: searchFilteredData, handleSearch } = useSearchBar<Site>(sites, ['name']);

    const { currentPage, totalPages, currentPageData, goToPage, nextPage, prevPage, resetPage } = usePagination<Site>(searchFilteredData, 5);

    useEffect(() => {
        resetPage();
    }, [searchFilteredData.length, resetPage]);

    const columns = createSiteColumns();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl font-bold mb-1">공원 관리</h1>
                <p className="text-sm text-gray-600">공원 목록을 관리합니다.</p>
            </div>
            <div className="flex items-center justify-between mb-4 gap-2">
                <SearchBar
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="공원 이름으로 검색"
                />
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4" />
                            공원 추가
                        </Button>
                    </DialogTrigger>
                </Dialog>
            </div>

            <div className="flex flex-col gap-4">
                <DataTable
                    columns={columns}
                    data={currentPageData}
                    onRowEdit={(site: Site) => openEditModal(site)}
                    onRowDelete={(site: Site) => openDeleteDialog(site)}
                />

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    onPrev={prevPage}
                    onNext={nextPage}
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