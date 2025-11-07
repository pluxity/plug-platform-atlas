import { DataTable, Column, Badge, Button, toast, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@plug-atlas/ui';
import { useState, useEffect } from 'react';
import UserCreateDialog from './dialogs/UsersCreateDialog';
import UserEditDialog from './dialogs/UserEditDialog';
import { useAdminUsers, useDeleteAdminUser, useInitAdminUserPassword, useRoles } from '@plug-atlas/api-hooks'; 
import { UserResponse } from '@plug-atlas/types';
import { useSearchBar, usePagination } from '../../services/hooks';
import { SearchBar } from '../../components/SearchBar';
import { TablePagination } from '../../components/Pagination';

export default function Users() {
  const { data, mutate: mutateUsers } = useAdminUsers();
  const { trigger: deleteAdminUser } = useDeleteAdminUser(); 
  const { trigger: initAdminUserPassword } = useInitAdminUserPassword();
  const { mutate: mutateRoles } = useRoles();

  const userColumns: Column<UserResponse>[] = [
    { key: 'username', header: '아이디' },
    { key: 'name', header: '이름' },
    { 
      key: 'roles', 
      header: '역할', 
      cell: (value) => { 
        const roles = (value as UserResponse['roles']) || [];
        
        return (
          <div className="flex gap-1 flex-wrap justify-center">
            {roles.length > 0 ? (
              <>
                {roles
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((role) => (
                    <Badge key={role.id} variant="secondary">
                      {role.name}
                    </Badge>
                ))}
              </>
            ) : '-'}
          </div>
        );
      },
    },
    { 
      key: 'department', 
      header: '부서',
      cell: (value) => value ? String(value) : '-'
    },
    { 
      key: 'phoneNumber', 
      header: '전화번호',
      cell: (value) => value ? String(value) : '-'
    },
    {
      key: 'id',
      header: '초기화',
      cell: (_, user) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleResetPassword(user);
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-primary-50 hover:text-primary-600 h-8 w-8"
          title="비밀번호 초기화"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </button>
      ),
    },
  ]

  const { searchTerm, filteredData: searchFilteredData, handleSearch } = useSearchBar<UserResponse>(data || [], ['name', 'username', 'department', 'phoneNumber']);

  const { currentPage, totalPages, currentPageData, goToPage, nextPage, prevPage, resetPage } = usePagination<UserResponse>(searchFilteredData, 5);

  useEffect(() => {
    resetPage();
  }, [searchFilteredData.length]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState<boolean>(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState<boolean>(false);
  const [userPassword, setUserPassword] = useState<UserResponse | null>(null);
  const [userDelete, setUserDelete] = useState<UserResponse | null>(null);

  const handleCreateUser = () => {
    setIsCreateDialogOpen(true);
  }

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  }

  const handleResetPassword = (user: UserResponse) => {
    setUserPassword(user);
    setIsResetPasswordDialogOpen(true);
  }

  const handleConfirmResetPassword = async () => { 
    if (!userPassword) return;
    try {
      await initAdminUserPassword(userPassword.id);
      toast.success(`${userPassword.name}님의 비밀번호가 초기화되었습니다.`);
      mutateUsers();
    } catch (error) {
      toast.error('비밀번호 초기화에 실패했습니다.');
    } finally {
      setIsResetPasswordDialogOpen(false);
      setUserPassword(null);
    }
  }

  const handleDeleteUser = (user: UserResponse) => {
    setUserDelete(user);
    setIsDeleteUserDialogOpen(true);
  }

  const handleConfirmDeleteUser = async () => {
    if (!userDelete) return;
    try {
      await deleteAdminUser(userDelete.id);
      toast.success(`${userDelete.name}님이 삭제되었습니다.`);
      mutateUsers();
      mutateRoles();
    } catch (error) {
      toast.error('사용자 삭제에 실패했습니다.');
    } finally {
      setIsDeleteUserDialogOpen(false);
      setUserDelete(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-1">사용자 관리</h1>
        <p className="text-sm text-gray-600">사용자 목록을 관리합니다.</p>
      </div>
      <div className="flex items-center justify-between mb-4 gap-2">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="이름, 아이디, 부서, 전화번호로 검색"
          />
          <Button onClick={handleCreateUser}>사용자 추가하기</Button>
      </div>
      <div className="flex flex-col gap-4">
          <DataTable
            data={currentPageData}
            columns={userColumns}
            onRowEdit={handleEditUser}
            onRowDelete={handleDeleteUser}
          />

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrev={prevPage}
            onNext={nextPage}
          />
      </div>

      <UserCreateDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
        onSuccess={() => {
          mutateUsers();
          mutateRoles();
        }} 
      />

      <UserEditDialog 
        isOpen={isEditDialogOpen}
        user={selectedUser} 
        onClose={() => setIsEditDialogOpen(false)} 
        onSuccess={() => {
          mutateUsers();
          mutateRoles();
        }} 
      />

      <AlertDialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>비밀번호 초기화</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {userPassword?.name}님의 비밀번호를 초기화하시겠습니까? <br />
            초기 비밀번호: <strong>qwer1234</strong>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmResetPassword}>초기화</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {userDelete?.name}님을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteUser} variant="destructive">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
