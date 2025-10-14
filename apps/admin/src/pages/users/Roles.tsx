import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@plug-atlas/ui'

export default function Roles() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">역할 관리</h1>
        <p className="text-gray-600">사용자 역할을 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>역할 목록</CardTitle>
          <CardDescription>시스템 역할을 확인하고 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">역할 데이터가 없습니다.</p>
        </CardContent>
      </Card>
    </div>
  )
}
