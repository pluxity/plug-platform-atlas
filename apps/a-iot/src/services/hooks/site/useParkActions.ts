import { toast } from 'sonner';
import { useCreateSite, useUpdateSite, useDeleteSite } from './useSite.ts';
import {SiteCreateRequest} from "../../types/site/site.ts";

export function useParkActions() {
    const createSiteMutation = useCreateSite();
    const updateSiteMutation = useUpdateSite();
    const deleteSiteMutation = useDeleteSite();

    const createPark = async (formData: SiteCreateRequest) => {
        try {
            await createSiteMutation.trigger(formData);
            toast.success('공원이 성공적으로 생성되었습니다.');
            return true;
        } catch (error) {
            toast.error('공원 생성에 실패했습니다.');
            console.error('Error creating site:', error);
            return false;
        }
    };

    const updatePark = async (id: number, formData: SiteCreateRequest) => {
        try {
            await updateSiteMutation.trigger({
                id,
                data: formData
            });
            toast.success('공원 정보가 성공적으로 수정되었습니다.');
            return true;
        } catch (error) {
            toast.error('공원 수정에 실패했습니다.');
            console.error('Error updating site:', error);
            return false;
        }
    };

    const deletePark = async (id: number) => {
        try {
            await deleteSiteMutation.trigger(id);
            toast.success('공원이 성공적으로 삭제되었습니다.');
            return true;
        } catch (error) {
            toast.error('공원 삭제에 실패했습니다.');
            console.error('Error deleting site:', error);
            return false;
        }
    };

    return {
        createPark,
        updatePark,
        deletePark,
        isCreating: createSiteMutation.isMutating,
        isUpdating: updateSiteMutation.isMutating,
        isDeleting: deleteSiteMutation.isMutating
    };
}