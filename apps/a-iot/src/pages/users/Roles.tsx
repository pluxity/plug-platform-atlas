import { Badge, Card, CardContent, CardHeader, CardTitle, Button, DataTable, Column, toast, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@plug-atlas/ui';
import { useRoles, useDeleteRole, usePermissions, useAdminUsers } from '@plug-atlas/api-hooks';
import type { RoleResponse } from '@plug-atlas/types';
import { useState, useEffect } from 'react';
import RoleCreateDialog from './dialogs/RoleCreateDialog';
import RoleEditDialog from './dialogs/RoleEditDialog';
import { useSearchBar, usePagination } from './hooks';
import { SearchBar, TablePagination } from './components';

export default function Roles() {
  const { data: roleData, mutate: mutateRoles } = useRoles();
  const { trigger: deleteRole } = useDeleteRole();
  const { mutate: mutatePermissions } = usePermissions();
  const { mutate: mutateUsers } = useAdminUsers();

  const roleColumns: Column<RoleResponse>[] = [
    {
      key: 'name',
      header: '이름',
    },
    {
      key: 'description',
      header: '설명',
      cell: (value) => value ? String(value) : '-'
    },
    {
      key: 'permissions',
      header: '권한',
      cell: (value) => {
        const permissionGroups = (value as RoleResponse['permissions']) || [];
        return (
          <div className="flex gap-1 flex-wrap items-center justify-center">
            {permissionGroups.length > 0 ? (
              <>
                {permissionGroups
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((group) => (
                    <Badge key={group.id} variant="secondary">
                      {group.name}
                    </Badge>  
                ))}
              </>
            ) : '-'}
          </div>
        )
      }
    }
  ]

  const { searchTerm, filteredData: searchFilteredData, handleSearch } = useSearchBar<RoleResponse>(roleData || [], ['name', 'description']);

  const { currentPage, totalPages, currentPageData, goToPage, nextPage, prevPage, resetPage } = usePagination<RoleResponse>(searchFilteredData, 5);

  useEffect(() => {
    resetPage();
  }, [searchFilteredData.length]);

  const [ isCreateDialogOpen, setIsCreateDialogOpen ] = useState(false);
  const [ isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen ] = useState(false);
  const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false);
  const [ selectedRole, setSelectedRole ] = useState<RoleResponse | null>(null);
  const [ roleDelete, setRoleDelete ] = useState<RoleResponse | null>(null);

  const handleCreateRole = () => {
    setIsCreateDialogOpen(true);
  }

  const handleEditRole = (role: RoleResponse) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  }

  const handleDeleteRole = (role: RoleResponse) => {
    setRoleDelete(role);
    setIsDeleteRoleDialogOpen(true);
  }

  const handleConfirmDeleteRole = async () => {
    if(!roleDelete) return;
    try{
      await deleteRole(roleDelete.id);
      toast.success(`${roleDelete.name}이 삭제되었습니다.`);
      mutateRoles();
      mutatePermissions();
      mutateUsers();
    } catch(error){
      toast.error(`역할 삭제에 실패했습니다.`);
      console.error(error);
    } finally{
      setIsDeleteRoleDialogOpen(false);
      setRoleDelete(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-1">역할 관리</h1>
        <p className="text-sm text-gray-600">역할 목록을 관리합니다.</p>
      </div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="역할 이름, 설명으로 검색"
        />
        <Button onClick={handleCreateRole}>역할 추가하기</Button>
      </div>
      <div className="flex flex-col gap-4">
        <DataTable
          data={currentPageData}
          columns={roleColumns}
          onRowEdit={handleEditRole}
          onRowDelete={handleDeleteRole}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onPrev={prevPage}
          onNext={nextPage}
        />
      </div>
      
      <RoleCreateDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
        onSuccess={() => {
          mutateRoles();
          mutatePermissions();
          mutateUsers();
        }} 
      />

      <RoleEditDialog 
        isOpen={isEditDialogOpen} 
        role={selectedRole} 
        onClose={() => setIsEditDialogOpen(false)} 
        onSuccess={() => {
          mutateRoles();
          mutatePermissions();
          mutateUsers();
        }} 
      />

      <AlertDialog open={isDeleteRoleDialogOpen} onOpenChange={setIsDeleteRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>역할 삭제</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {roleDelete?.name} 역할을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteRole} variant="destructive">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}