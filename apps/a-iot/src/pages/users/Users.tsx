import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@plug-atlas/ui'

export default function Users() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">사용자 관리</h1>
        <p className="text-gray-600">시스템 사용자를 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
          <CardDescription>등록된 사용자를 확인하고 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">사용자 데이터가 없습니다.</p>
        </CardContent>
      </Card>
    </div>
  )
}
