import { Card, CardContent, CardHeader, CardTitle, DataTable, Column, Badge, Input, Button, toast, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@plug-atlas/ui';
import { useState, useEffect } from 'react';
import UserCreateForm from './Forms/UsersCreateForm';
import UserEditModal from './Forms/UserEditForm';
import { useAdminUsers, useRoles, useDeleteAdminUser, useInitAdminUserPassword } from '@plug-atlas/api-hooks'; 
import { User } from './types/users.types';

export default function Users() {
  const { data , mutate } = useAdminUsers();
  const { data: roleData } = useRoles(); 
  const { trigger: deleteAdminUser } = useDeleteAdminUser(); 
  const { trigger: initAdminUserPassword } = useInitAdminUserPassword();
  
  const userData: User[] = (data || []).map((data) => ({
    id: data.id,
    username: data.username,
    name: data.name,
    roleIds: data.roles?.map(r => r.id) || [], 
    department: data.department || '-',
    phoneNumber: data.phoneNumber || '-',
  }));

  const userColumns: Column<User>[] = [
    { key: 'username', header: '아이디' },
    { key: 'name', header: '이름' },
    { 
      key: 'roleIds', 
      header: '역할', 
      cell: (_, user) => { 
        if (!roleData) return null;
        
        const roles = user.roleIds
          .map(id => roleData.find(role => role.id === id))
          .filter(Boolean).sort();
        
        return (
          <div className="flex gap-1 flex-wrap">
            {roles.map((role) => (
              <Badge key={role?.id} variant="secondary">
                {role?.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    { key: 'department', header: '부서' },
    { key: 'phoneNumber', header: '전화번호' },
    {
      key: 'initPassword',
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

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<User[]>(userData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState<boolean>(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState<boolean>(false);
  const [userPassword, setUserPassword] = useState<User | null>(null);
  const [userDelete, setUserDelete] = useState<User | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentPageData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    setFilteredData(userData);
    setCurrentPage(1);
  }, [data]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData(userData);
      setCurrentPage(1);
      return;
    }

    const filtered = userData.filter((user) => {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roleIds.some(roleId => roleData?.find(role => role.id === roleId)?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }

  const handleResetPassword = (user: User) => {
    setUserPassword(user);
    setIsResetPasswordDialogOpen(true);
  }

  const handleConfirmResetPassword = async () => { 
    if (!userPassword) return;
    try {
      await initAdminUserPassword(userPassword.id);
      toast.success(`${userPassword.name}님의 비밀번호가 초기화되었습니다.`);
      mutate();
    } catch (error) {
      toast.error('비밀번호 초기화에 실패했습니다.');
    } finally {
      setIsResetPasswordDialogOpen(false);
      setUserPassword(null);
    }
  }

  const handleDeleteUser = (user: User) => {
    setUserDelete(user);
    setIsDeleteUserDialogOpen(true);
  }

  const handleConfirmDeleteUser = async () => { 
    if (!userDelete) return;
    try {
      await deleteAdminUser(userDelete.id); 
      toast.success(`${userDelete.name}님이 삭제되었습니다.`);
      mutate(); 
    } catch (error) {
      toast.error('사용자 삭제에 실패했습니다.');
    } finally {
      setIsDeleteUserDialogOpen(false);
      setUserDelete(null);
    }
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  }

  const handleSuccessCreateUser = () => {
    mutate(); 
    setIsCreateModalOpen(false);
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  }

  const handleSuccessEditUser = () => {
    mutate();
    setIsEditModalOpen(false);
    setSelectedUser(null);
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">사용자 관리</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="검색" 
                className="w-64" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline" onClick={handleSearch}>검색</Button>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateUser}>사용자 추가하기</Button>
            </div>
          </div>
          <DataTable 
            data={currentPageData} 
            columns={userColumns}
            onRowEdit={handleEditUser}
            onRowDelete={handleDeleteUser}
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

      {/* 사용자 생성 모달 */}
      <UserCreateForm 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal} 
        onSuccess={handleSuccessCreateUser} 
      />

      {/* 사용자 수정 모달 */}
      <UserEditModal 
        isOpen={isEditModalOpen}
        user={selectedUser} 
        onClose={handleCloseEditModal} 
        onSuccess={handleSuccessEditUser} 
      />

      {/* 비밀번호 초기화 확인 다이얼로그 */}
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

      {/* 사용자 삭제 확인 다이얼로그 */}
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
            <AlertDialogAction onClick={handleConfirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
