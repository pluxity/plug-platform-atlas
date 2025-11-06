import { Card, CardContent, CardHeader, CardTitle, DataTable, Column, Badge, Button, toast, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, Tabs, TabsList, TabsTrigger } from '@plug-atlas/ui';
import { useState, useEffect } from 'react';
import { usePermissions, useDeletePermission, useRoles } from '@plug-atlas/api-hooks';
import { usePermissionResources } from '../../services/hooks';
import { PermissionGroupResponse } from '@plug-atlas/types';
import PermissionCreateDialog from './dialogs/PermissionCreateDialog';
import PermissionEditDialog from './dialogs/PermissionEditDialog';
import { useSearchBar, usePagination } from './hooks';
import { SearchBar, TablePagination } from './components';

export default function Permissions() {
  const { data, mutate: mutatePermissions } = usePermissions();
  const { trigger: deletePermission } = useDeletePermission();
  const { data: roles, mutate: mutateRoles } = useRoles();
  const { data: resourceData = {} } = usePermissionResources();

  const permissionColumns: Column<PermissionGroupResponse>[] = [
    { 
      key: 'name', 
      header: '이름'    
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
        const permissions = (value as PermissionGroupResponse['permissions']) || [];
        
        return (
          <div className="flex flex-col gap-2">
            {permissions.length > 0 ? (
              <>
                {permissions
                  .sort((a, b) => a.resourceType.localeCompare(b.resourceType))
                  .map((permission, index) => {
                    const resourceList = resourceData[permission.resourceType];
                    const resourceMap = resourceList ? new Map(resourceList.map(r => [r.id, r.name])) : new Map();
                    const validResourceIds = permission.resourceIds.filter(id => resourceMap.has(id));
                    
                    return (
                      <div key={`${permission.resourceType}-${index}`} className="flex flex-col gap-1 justify-center items-center">
                        {validResourceIds.map((resourceId) => (
                          <Badge 
                            key={`${permission.resourceType}-${resourceId}`} 
                            variant="outline"
                            className="text-xs"
                          >
                            {resourceMap.get(resourceId)}
                          </Badge>
                        ))}
                      </div>
                    );
                  })}
              </>
            ) : '-'}
          </div>
        );
      },
    },
    {
      key: 'id',
      header: '할당된 역할',
      cell: (_, permissionGroup) => {
        const assignedRoles = roles?.filter(role => 
          role.permissions?.some(p => p.id === permissionGroup.id)
        ) || [];
        
        return (
          <div className="flex gap-1 flex-wrap items-center justify-center">
            {assignedRoles.length > 0 ? (
              <>
                {assignedRoles
                 .sort((a, b) => a.name.localeCompare(b.name))
                 .map(role => (
                   <Badge key={role.id} variant="secondary">
                     {role.name}
                   </Badge>
                 ))}
              </>
            ) : '-'}
          </div>
        );
      },
    }
  ];

  const [filteredData, setFilteredData] = useState<PermissionGroupResponse[]>(data || []);
  const [isDeletePermissionDialogOpen, setIsDeletePermissionDialogOpen] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionGroupResponse | null>(null);
  const [permissionDelete, setPermissionDelete] = useState<PermissionGroupResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});

  // 카테고리 탭
  useEffect(() => {
    if (!data || !roles) return;
    
    const counts: { [key: string]: number } = { all: data.length };
    
    roles.forEach(role => {
      const permissionIdSet = new Set(role.permissions?.map(p => p.id));
      counts[role.name] = data.filter(permission => permissionIdSet.has(permission.id)).length;
    });
    
    setCategories(roles.map(role => role.name).sort());
    setCategoryCounts(counts);
  }, [data, roles]);

  // 카테고리 필터링
  useEffect(() => {
    if (!data) return;
    
    let filtered = [...data];
    
    if (selectedCategory !== 'all') {
      const selectedRole = roles?.find(r => r.name === selectedCategory);
      if (selectedRole) {
        filtered = filtered.filter(permission =>
          selectedRole.permissions?.some(p => p.id === permission.id)
        );
      }
    }
    
    setFilteredData(filtered);
  }, [data, selectedCategory, roles]);

  const { searchTerm, filteredData: searchFilteredData, handleSearch } = useSearchBar<PermissionGroupResponse>(filteredData || [], ['name', 'description']);

  const { currentPage, totalPages, currentPageData, goToPage, nextPage, prevPage, resetPage } = usePagination<PermissionGroupResponse>(searchFilteredData, 5);

  useEffect(() => {
    resetPage();
  }, [searchFilteredData.length, selectedCategory, resetPage]);

  const handleEditPermission = (permission: PermissionGroupResponse) => {
    setSelectedPermission(permission);  
    setIsEditDialogOpen(true);
  }

  const handleDeletePermission = (permission: PermissionGroupResponse) => {
    setPermissionDelete(permission);
    setIsDeletePermissionDialogOpen(true);
  }

  const handleConfirmDeletePermission = async () => {
    if (!permissionDelete) return;
    try {
      await deletePermission(permissionDelete.id);
      toast.success(`${permissionDelete.name} 권한이 삭제되었습니다.`);
      mutatePermissions();
      mutateRoles();
    } catch (error) {
      toast.error('권한 삭제에 실패했습니다.');
    } finally {
      setIsDeletePermissionDialogOpen(false);
      setPermissionDelete(null);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>권한 관리 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            variant="pills"
            size="sm"
            className="mb-4"
          >
            <TabsList className="justify-start">
              <TabsTrigger value="all">
                전체
                <Badge variant="secondary" className="ml-1.5">
                  {categoryCounts.all || 0}
                </Badge>
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                  <Badge variant="secondary" className="ml-1.5">
                    {categoryCounts[category] || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center justify-between mb-4 gap-2">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="권한 이름, 설명으로 검색"
            />
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              권한 추가하기
            </Button>
          </div>

          <DataTable
            data={currentPageData}
            columns={permissionColumns}
            onRowEdit={handleEditPermission}
            onRowDelete={handleDeletePermission}
          />

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </CardContent>
      </Card>

      <PermissionCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          mutatePermissions();
          mutateRoles();
        }}
      />

      <PermissionEditDialog
        isOpen={isEditDialogOpen}
        permission={selectedPermission}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={() => {
          mutatePermissions();
          mutateRoles();
        }}
      />

      <AlertDialog open={isDeletePermissionDialogOpen} onOpenChange={setIsDeletePermissionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>권한 삭제</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {permissionDelete?.name} 권한을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeletePermission} variant="destructive">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
