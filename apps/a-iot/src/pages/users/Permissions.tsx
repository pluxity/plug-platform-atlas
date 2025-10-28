import { Card, CardContent, CardHeader, CardTitle, CardDescription, DataTable, Column, Badge, Button, toast, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, Tabs, TabsList, TabsTrigger, TabsContent, Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, Checkbox } from '@plug-atlas/ui';
import { useState, useEffect } from 'react';
import { usePermissions, useDeletePermission, useRoles, useUpdateRole } from '@plug-atlas/api-hooks';
import { usePermissionResources } from '../../services/hooks';
import { PermissionGroupResponse } from '@plug-atlas/types';
import PermissionCreateDialog from './dialogs/PermissionCreateDialog';
import PermissionEditDialog from './dialogs/PermissionEditDialog';

export default function Permissions() {
  const { data, mutate } = usePermissions();
  const { trigger: deletePermission } = useDeletePermission();
  const { data: roles, mutate: mutateRoles } = useRoles();
  const { trigger: updateRole } = useUpdateRole();
  const { data: resourceData = {} } = usePermissionResources();

  const permissionColumns: Column<PermissionGroupResponse>[] = [
    { 
      key: 'name', 
      header: '이름'    
    },
    { 
      key: 'description', 
      header: '설명',
    },
    { 
      key: 'permissions', 
      header: '권한', 
      cell: (value) => { 
        const permissions = (value as PermissionGroupResponse['permissions']) || [];
        
        return (
          <div className="flex flex-col gap-2">
            {permissions
              .sort((a, b) => a.resourceType.localeCompare(b.resourceType))
              .map((permission, index) => {
                const validResourceIds = permission.resourceIds.filter((resourceId) => 
                  resourceData[permission.resourceType]?.find((resource) => resource.id === resourceId)
                );
                
                return (
                  <div key={`${permission.resourceType}-${index}`} className="flex flex-col gap-1">
                    {validResourceIds.length > 0 ? (
                      <>
                        <p className="text-sm">{permission.resourceType}</p>
                        <div className="flex gap-1 flex-wrap">
                          {validResourceIds.map((resourceId) => (
                            <Badge 
                              key={`${permission.resourceType}-${resourceId}`} 
                              variant="outline"
                              className="text-xs"
                            >
                              {resourceData[permission.resourceType]?.find((resource) => resource.id === resourceId)?.name}
                            </Badge>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">권한이 없습니다.</p>
                    )}
                  </div>
                );
              })}
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
          <div className="flex gap-1 flex-wrap">
            {assignedRoles
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(role => (
              <Badge key={role.id} variant="secondary">
                {role.name}
              </Badge>
            ))}
          </div>
        );
      },
    }
  ];

  const [filteredData, setFilteredData] = useState<PermissionGroupResponse[]>(data || []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDeletePermissionDialogOpen, setIsDeletePermissionDialogOpen] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionGroupResponse | null>(null);
  const [permissionDelete, setPermissionDelete] = useState<PermissionGroupResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentPageData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 카테고리 탭
  useEffect(() => {
    if (!data || !roles) return;
    
    const counts: { [key: string]: number } = { all: data.length };
    
    roles.forEach(role => {
      counts[role.name] = data.filter(permission =>
        role.permissions?.some(p => p.id === permission.id)
      ).length;
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
    setCurrentPage(1);
  }, [data, selectedCategory, roles]);

  
  const handleEditPermission = (permission: PermissionGroupResponse) => {
    setSelectedPermission(permission);
    setIsEditDialogOpen(true);
  };

  const handleDeletePermission = (permission: PermissionGroupResponse) => {
    setPermissionDelete(permission);
    setIsDeletePermissionDialogOpen(true);
  };

  const handleConfirmDeletePermission = async () => { 
    if (!permissionDelete) return;
    try {
      await deletePermission(permissionDelete.id);
      toast.success(`${permissionDelete.name} 권한이 삭제되었습니다.`);
      mutate();
    } catch (error) {
      toast.error('권한 삭제에 실패했습니다.');
    } finally {
      setIsDeletePermissionDialogOpen(false);
      setPermissionDelete(null);
    }
  };

  
  const handlePermissionToggle = async (roleId: number, roleName: string, permissionGroupId: number, isChecked: boolean) => {
    const role = roles?.find(r => r.id === roleId);
    if (!role) return;

    const currentPermissionIds = role.permissions?.map(p => p.id) || [];
    const newPermissionIds = isChecked ? [...currentPermissionIds, permissionGroupId] : currentPermissionIds.filter(id => id !== permissionGroupId);

    try {
      await updateRole({
        id: roleId,
        data: {
          name: role.name,
          description: role.description,
          permissionGroupIds: newPermissionIds,
        },
      });
      
      toast.success(`${roleName} 역할의 권한이 업데이트되었습니다.`);
      mutateRoles();
    } catch (error) {
      toast.error('권한 업데이트에 실패했습니다.');
      console.error(error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedCategory('all');
    setCurrentPage(1);
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">권한 관리</h1>
        <p className="text-gray-600">시스템 권한을 관리합니다.</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} variant="minimal">
        <TabsList>
          <TabsTrigger value="list">목록 보기</TabsTrigger>
          <TabsTrigger value="matrix">역할별 권한 할당</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>권한 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6 gap-2">
                <div className="flex items-center gap-2">
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} variant="pills" size="sm">
                    <TabsList className="justify-start">
                      <TabsTrigger value="all">
                        전체
                        <Badge variant="secondary" className="ml-1.5">{categoryCounts['all'] || 0}</Badge>
                      </TabsTrigger>
                      {categories.map(category => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                          <Badge variant="secondary" className="ml-1.5">{categoryCounts[category] || 0}</Badge>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => setIsCreateDialogOpen(true)}>권한 추가하기</Button>
                </div>
              </div>

              <DataTable 
                data={currentPageData} 
                columns={permissionColumns}
                onRowEdit={handleEditPermission}
                onRowDelete={handleDeletePermission}
              />
              {totalPages >= 1 && (
                <Pagination className="mt-5">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      />
                    </PaginationItem>

                    {Array.from({length: totalPages}).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => totalPages > currentPage && setCurrentPage(currentPage + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>역할별 권한 할당</CardTitle>
              <CardDescription>역할에 권한을 직접 할당하거나 해제할 수 있습니다.</CardDescription>  
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 bg-background border border-border p-4 text-left font-semibold min-w-[200px]">
                        역할
                      </th>
                      {data?.map((permissionGroup) => (
                        <th
                          key={permissionGroup.id}
                          className="border border-border p-4 text-center font-semibold min-w-[150px]"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">{permissionGroup.name}</span>
                            {permissionGroup.description && (
                              <span className="text-xs text-muted-foreground font-normal">
                                {permissionGroup.description}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roles?.map((role) => (
                      <tr key={role.id} className="hover:bg-muted/50 transition-colors">
                        <td className="sticky left-0 z-10 bg-background border border-border p-4 font-medium">
                          <div className="flex flex-col gap-1">
                            <span>{role.name}</span>
                            {role.description && (
                              <span className="text-xs text-muted-foreground font-normal">
                                {role.description}
                              </span>
                            )}
                          </div>
                        </td>
                        {data?.map((permissionGroup) => {
                          const isChecked = role.permissions?.some(p => p.id === permissionGroup.id) || false;
                          return (
                            <td
                              key={`${role.id}-${permissionGroup.id}`}
                              className="border border-border p-4 text-center"
                            >
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => 
                                    handlePermissionToggle(
                                      role.id, 
                                      role.name, 
                                      permissionGroup.id, 
                                      checked === true
                                    )
                                  }
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!roles || roles.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    역할이 없습니다. 먼저 역할을 생성해주세요.
                  </div>
                )}
                {(!data || data.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    권한 그룹이 없습니다. 먼저 권한을 생성해주세요.
                  </div>
                )}
              </div>
            </CardContent>  
          </Card>
        </TabsContent>
      </Tabs>

      <PermissionCreateDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
        onSuccess={() => mutate()} 
      />

      <PermissionEditDialog 
        isOpen={isEditDialogOpen}
        permission={selectedPermission} 
        onClose={() => setIsEditDialogOpen(false)} 
        onSuccess={() => mutate()} 
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
    </div>
  )
}
