import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DataTable, Column } from './data-table.component'
import { Badge } from '../../atoms/badge'

const meta: Meta<typeof DataTable> = {
  title: 'Organisms/Data Table',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '데이터 테이블 컴포넌트입니다. 열 정의와 데이터 배열을 받아 테이블을 렌더링하며 커스텀 셀 렌더링을 지원합니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof DataTable>

interface User {
  id: number
  name: string
  email: string
  role: string
}

const usersData: User[] = [
  { id: 1, name: '김철수', email: 'kim@example.com', role: 'admin' },
  { id: 2, name: '이영희', email: 'lee@example.com', role: 'user' },
  { id: 3, name: '박민수', email: 'site@example.com', role: 'user' },
  { id: 4, name: '정지은', email: 'jung@example.com', role: 'moderator' },
  { id: 5, name: '최동욱', email: 'choi@example.com', role: 'user' },
]

const userColumns: Column<User>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: '이름' },
  { key: 'email', header: '이메일' },
  { key: 'role', header: '역할' },
]

export const Default: Story = {
  render: () => <DataTable data={usersData} columns={userColumns} />,
}

const userColumnsWithBadge: Column<User>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: '이름' },
  { key: 'email', header: '이메일' },
  {
    key: 'role',
    header: '역할',
    cell: (value) => {
      const role = String(value)
      const variant =
        role === 'admin'
          ? 'destructive'
          : role === 'moderator'
          ? 'default'
          : 'secondary'

      const label =
        role === 'admin'
          ? '관리자'
          : role === 'moderator'
          ? '운영자'
          : '사용자'

      return <Badge variant={variant}>{label}</Badge>
    },
  },
]

export const WithCustomCell: Story = {
  render: () => <DataTable data={usersData} columns={userColumnsWithBadge} />,
}

interface Device {
  id: string
  name: string
  type: string
  status: 'online' | 'offline' | 'error'
  lastSeen: string
}

const devices: Device[] = [
  {
    id: 'DEV001',
    name: '센서-A1',
    type: '온도 센서',
    status: 'online',
    lastSeen: '2분 전',
  },
  {
    id: 'DEV002',
    name: '카메라-B2',
    type: 'CCTV',
    status: 'online',
    lastSeen: '5분 전',
  },
  {
    id: 'DEV003',
    name: '센서-C3',
    type: '습도 센서',
    status: 'offline',
    lastSeen: '2시간 전',
  },
  {
    id: 'DEV004',
    name: '제어기-D4',
    type: '조명 제어',
    status: 'error',
    lastSeen: '30분 전',
  },
]

const deviceColumns: Column<Device>[] = [
  { key: 'id', header: '장치 ID' },
  { key: 'name', header: '장치명' },
  { key: 'type', header: '유형' },
  {
    key: 'status',
    header: '상태',
    cell: (value) => {
      const status = String(value)
      const statusConfig = {
        online: { label: '온라인', color: 'text-success-600', bg: 'bg-success-50' },
        offline: { label: '오프라인', color: 'text-gray-600', bg: 'bg-gray-50' },
        error: { label: '오류', color: 'text-error-600', bg: 'bg-error-50' },
      }
      const config = statusConfig[status as keyof typeof statusConfig]

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
          {config.label}
        </span>
      )
    },
  },
  { key: 'lastSeen', header: '마지막 확인' },
]

export const DeviceTable: Story = {
  render: () => <DataTable data={devices} columns={deviceColumns} />,
}

interface Task {
  id: number
  title: string
  assignee: string
  priority: 'high' | 'medium' | 'low'
  progress: number
}

const tasks: Task[] = [
  {
    id: 1,
    title: 'UI 컴포넌트 개발',
    assignee: '김철수',
    priority: 'high',
    progress: 75,
  },
  {
    id: 2,
    title: 'API 통합',
    assignee: '이영희',
    priority: 'high',
    progress: 50,
  },
  {
    id: 3,
    title: '문서 작성',
    assignee: '박민수',
    priority: 'medium',
    progress: 30,
  },
  {
    id: 4,
    title: '테스트 작성',
    assignee: '정지은',
    priority: 'low',
    progress: 10,
  },
]

const taskColumns: Column<Task>[] = [
  { key: 'id', header: 'ID' },
  { key: 'title', header: '작업' },
  { key: 'assignee', header: '담당자' },
  {
    key: 'priority',
    header: '우선순위',
    cell: (value) => {
      const priority = String(value)
      const config = {
        high: { label: '높음', variant: 'destructive' as const },
        medium: { label: '보통', variant: 'default' as const },
        low: { label: '낮음', variant: 'secondary' as const },
      }
      const { label, variant } = config[priority as keyof typeof config]
      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    key: 'progress',
    header: '진행률',
    cell: (value) => {
      const progress = Number(value)
      return (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
      )
    },
  },
]

export const TaskTable: Story = {
  render: () => <DataTable data={tasks} columns={taskColumns} />,
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
}

const transactions: Transaction[] = [
  {
    id: 'TRX001',
    date: '2024-01-15',
    description: '프로젝트 수익',
    amount: 5000000,
    type: 'income',
  },
  {
    id: 'TRX002',
    date: '2024-01-14',
    description: '서버 비용',
    amount: 300000,
    type: 'expense',
  },
  {
    id: 'TRX003',
    date: '2024-01-13',
    description: '라이선스 구매',
    amount: 150000,
    type: 'expense',
  },
  {
    id: 'TRX004',
    date: '2024-01-12',
    description: '컨설팅 수익',
    amount: 2000000,
    type: 'income',
  },
]

const transactionColumns: Column<Transaction>[] = [
  { key: 'id', header: '거래 ID' },
  { key: 'date', header: '날짜' },
  { key: 'description', header: '설명' },
  {
    key: 'amount',
    header: '금액',
    cell: (value, row) => {
      const amount = Number(value)
      const isIncome = row.type === 'income'
      return (
        <span
          className={`font-medium ${
            isIncome ? 'text-success-600' : 'text-error-600'
          }`}
        >
          {isIncome ? '+' : '-'}
          {amount.toLocaleString('ko-KR')}원
        </span>
      )
    },
  },
  {
    key: 'type',
    header: '유형',
    cell: (value) => {
      const type = String(value)
      return type === 'income' ? (
        <Badge variant="success">수입</Badge>
      ) : (
        <Badge variant="destructive">지출</Badge>
      )
    },
  },
]

export const TransactionTable: Story = {
  render: () => <DataTable data={transactions} columns={transactionColumns} />,
}

interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error'
  message: string
  source: string
}

const logs: LogEntry[] = [
  {
    timestamp: '2024-01-15 10:30:45',
    level: 'info',
    message: '사용자 로그인 성공',
    source: 'auth.service',
  },
  {
    timestamp: '2024-01-15 10:29:12',
    level: 'warning',
    message: 'API 응답 지연 (3.5초)',
    source: 'api.gateway',
  },
  {
    timestamp: '2024-01-15 10:28:03',
    level: 'error',
    message: '데이터베이스 연결 실패',
    source: 'db.connection',
  },
  {
    timestamp: '2024-01-15 10:27:30',
    level: 'info',
    message: '서버 시작 완료',
    source: 'server.main',
  },
]

const logColumns: Column<LogEntry>[] = [
  {
    key: 'timestamp',
    header: '시간',
    cell: (value) => (
      <span className="font-mono text-xs text-muted-foreground">
        {String(value)}
      </span>
    ),
  },
  {
    key: 'level',
    header: '레벨',
    cell: (value) => {
      const level = String(value)
      const config = {
        info: { label: 'INFO', bg: 'bg-primary-50', text: 'text-primary-700' },
        warning: {
          label: 'WARN',
          bg: 'bg-warning-50',
          text: 'text-warning-700',
        },
        error: { label: 'ERROR', bg: 'bg-error-50', text: 'text-error-700' },
      }
      const { label, bg, text } = config[level as keyof typeof config]
      return (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-mono font-semibold ${bg} ${text}`}
        >
          {label}
        </span>
      )
    },
  },
  { key: 'message', header: '메시지' },
  {
    key: 'source',
    header: '소스',
    cell: (value) => (
      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{String(value)}</code>
    ),
  },
]

export const LogTable: Story = {
  render: () => <DataTable data={logs} columns={logColumns} />,
}

export const WithActions: Story = {
  render: () => {
    const [users, setUsers] = useState([...usersData])

    const handleEdit = (user: User, _index: number) => {
      alert(`편집: ${user.name} (ID: ${user.id})`)
      // 실제로는 Dialog를 열어서 편집
    }

    const handleDelete = (user: User, index: number) => {
      if (confirm(`${user.name}을(를) 삭제하시겠습니까?`)) {
        setUsers(prev => prev.filter((_, i) => i !== index))
      }
    }

    return (
      <DataTable
        data={users}
        columns={userColumns}
        onRowEdit={handleEdit}
        onRowDelete={handleDelete}
      />
    )
  },
}

export const WithRowClick: Story = {
  render: () => {
    const handleRowClick = (user: User, _index: number) => {
      alert(`클릭: ${user.name}\n이메일: ${user.email}\n역할: ${user.role}`)
    }

    return (
      <DataTable
        data={usersData}
        columns={userColumns}
        onRowClick={handleRowClick}
      />
    )
  },
}

export const WithSelection: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<number[]>([])

    const handleBulkDelete = () => {
      if (selectedRows.length === 0) {
        alert('선택된 항목이 없습니다')
        return
      }
      alert(`${selectedRows.length}개 항목 삭제`)
      setSelectedRows([])
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedRows.length > 0 ? `${selectedRows.length}개 선택됨` : '항목을 선택하세요'}
          </p>
          {selectedRows.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-error-600 text-white rounded-md hover:bg-error-700 transition-colors"
            >
              선택 항목 삭제
            </button>
          )}
        </div>
        <DataTable
          data={usersData}
          columns={userColumns}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </div>
    )
  },
}

export const WithAllFeatures: Story = {
  render: () => {
    const [users, setUsers] = useState([...usersData])
    const [selectedRows, setSelectedRows] = useState<number[]>([])

    const handleRowClick = (user: User, _index: number) => {
      console.log('Row clicked:', user)
    }

    const handleEdit = (user: User, _index: number) => {
      alert(`편집: ${user.name}`)
    }

    const handleDelete = (user: User, index: number) => {
      if (confirm(`${user.name}을(를) 삭제하시겠습니까?`)) {
        setUsers(prev => prev.filter((_, i) => i !== index))
        setSelectedRows(prev => prev.filter(i => i !== index))
      }
    }

    const handleBulkAction = (action: string) => {
      if (selectedRows.length === 0) {
        alert('선택된 항목이 없습니다')
        return
      }
      alert(`${action}: ${selectedRows.length}개 항목`)
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">사용자 관리</h3>
          {selectedRows.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('활성화')}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                활성화
              </button>
              <button
                onClick={() => handleBulkAction('비활성화')}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                비활성화
              </button>
              <button
                onClick={() => handleBulkAction('삭제')}
                className="px-3 py-1.5 text-sm bg-error-600 text-white rounded-md hover:bg-error-700 transition-colors"
              >
                삭제
              </button>
            </div>
          )}
        </div>
        {selectedRows.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-md p-3">
            <p className="text-sm text-primary-900">
              {selectedRows.length}개 항목이 선택되었습니다
            </p>
          </div>
        )}
        <DataTable
          data={users}
          columns={userColumnsWithBadge}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowClick={handleRowClick}
          onRowEdit={handleEdit}
          onRowDelete={handleDelete}
          getRowId={(user) => String(user.id)}
        />
      </div>
    )
  },
}

interface Device {
  id: string
  name: string
  type: string
  status: 'online' | 'offline' | 'error'
  lastSeen: string
}

const devicesData: Device[] = [
  {
    id: 'DEV001',
    name: '센서-A1',
    type: '온도 센서',
    status: 'online',
    lastSeen: '2분 전',
  },
  {
    id: 'DEV002',
    name: '카메라-B2',
    type: 'CCTV',
    status: 'online',
    lastSeen: '5분 전',
  },
  {
    id: 'DEV003',
    name: '센서-C3',
    type: '습도 센서',
    status: 'offline',
    lastSeen: '2시간 전',
  },
  {
    id: 'DEV004',
    name: '제어기-D4',
    type: '조명 제어',
    status: 'error',
    lastSeen: '30분 전',
  },
]

export const DeviceManagement: Story = {
  render: () => {
    const [devices, setDevices] = useState(devicesData)
    const [selectedRows, setSelectedRows] = useState<number[]>([])

    const handleReboot = (device: Device, _index: number) => {
      alert(`${device.name} 재시작 중...`)
      // 실제로는 API 호출
    }

    const handleRemove = (device: Device, index: number) => {
      if (confirm(`${device.name}을(를) 제거하시겠습니까?`)) {
        setDevices(prev => prev.filter((_, i) => i !== index))
      }
    }

    const deviceColumns: Column<Device>[] = [
      { key: 'id', header: '장치 ID' },
      { key: 'name', header: '장치명' },
      { key: 'type', header: '유형' },
      {
        key: 'status',
        header: '상태',
        cell: (value) => {
          const status = String(value)
          const statusConfig = {
            online: { label: '온라인', color: 'text-success-600', bg: 'bg-success-50' },
            offline: { label: '오프라인', color: 'text-gray-600', bg: 'bg-gray-50' },
            error: { label: '오류', color: 'text-error-600', bg: 'bg-error-50' },
          }
          const config = statusConfig[status as keyof typeof statusConfig]

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
            >
              <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
              {config.label}
            </span>
          )
        },
      },
      { key: 'lastSeen', header: '마지막 확인' },
    ]

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">장치 관리</h3>
            <p className="text-sm text-muted-foreground">
              총 {devices.length}개 장치 • {devices.filter(d => d.status === 'online').length}개 온라인
            </p>
          </div>
          {selectedRows.length > 0 && (
            <button
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              선택한 {selectedRows.length}개 재시작
            </button>
          )}
        </div>
        <DataTable
          data={devices}
          columns={deviceColumns}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowEdit={handleReboot}
          onRowDelete={handleRemove}
          getRowId={(device) => device.id}
        />
      </div>
    )
  },
}

export const WithStickyHeader: Story = {
  render: () => {
    const generateUsers = (count: number): User[] => {
      const roles: User['role'][] = ['admin', 'user', 'moderator']
      const names = ['김철수', '이영희', '박민수', '정지은', '최동욱', '한소희', '윤서연', '강민준']
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `${names[i % names.length]}${Math.floor(i / names.length) + 1}`,
        email: `user${i + 1}@example.com`,
        role: roles[i % roles.length] || 'user',
      }))
    }

    const manyUsers = generateUsers(50)

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">고정 헤더 테이블</h3>
          <p className="text-sm text-muted-foreground mb-4">
            아래로 스크롤해도 헤더가 상단에 고정되어 표시됩니다.
          </p>
        </div>
        <DataTable
          data={manyUsers}
          columns={userColumnsWithBadge}
          stickyHeader
          maxHeight={400}
          selectable
          getRowId={(user) => String(user.id)}
        />
      </div>
    )
  },
}