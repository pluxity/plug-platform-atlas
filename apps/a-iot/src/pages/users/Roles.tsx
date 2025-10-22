import { Badge, Card, CardContent, CardHeader, CardTitle, Button, DataTable, Column, toast, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@plug-atlas/ui';
import { useRoles, useDeleteRole } from '@plug-atlas/api-hooks';
import type { RoleResponse } from '@plug-atlas/types';
import { useState } from 'react';
import RoleCreateDialog from './dialogs/RoleCreateDialog';
import RoleEditDialog from './dialogs/RoleEditDialog';

export default function Roles() {
  const { data: roleData , mutate } = useRoles();
  const { trigger: deleteRole } = useDeleteRole()

  const roleColumns: Column<RoleResponse>[] = [
    {
      key: 'name',
      header: '이름',
    },
    {
      key: 'description',
      header: '설명',
    },
    {
      key: 'permissions',
      header: '권한',
      cell: (value) => {
        const permissionGroups = (value as RoleResponse['permissions']) || [];
        return (
          <div className="flex gap-1 flex-wrap">
            {permissionGroups
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((group) => (
              <Badge key={group.id} variant="secondary">
                {group.name}
              </Badge>  
            ))}
          </div>
        )
      }
    }
  ]

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
      mutate();
    } catch(error){
      toast.error(`역할 삭제에 실패했습니다.`);
      console.error(error);
    } finally{
      setIsDeleteRoleDialogOpen(false);
      setRoleDelete(null);
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">역할 관리</h1>
        <p className="text-gray-600">사용자 역할을 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>역할 목록</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="flex items-center mb-4">
            <div className="ml-auto">
              <Button onClick={handleCreateRole}>역할 추가하기</Button>
            </div>
          </div>
          <DataTable 
            data={roleData || []} 
            columns={roleColumns}
            onRowEdit={handleEditRole}
            onRowDelete={handleDeleteRole}
          />
        </CardContent>
      </Card>

      <RoleCreateDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
        onSuccess={() => mutate()} 
      />

      <RoleEditDialog 
        isOpen={isEditDialogOpen} 
        role={selectedRole} 
        onClose={() => setIsEditDialogOpen(false)} 
        onSuccess={() => mutate()} 
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