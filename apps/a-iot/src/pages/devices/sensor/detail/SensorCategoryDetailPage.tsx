import { useParams, useNavigate } from 'react-router-dom';
import { useDeviceTypes } from '../../../../services/deviceCategory/useDeviceCategory';
import type { DeviceType } from '../../../../services/deviceCategory/useDeviceCategory';
import { Button, DataTable } from '@plug-atlas/ui';
import { ArrowLeft, Package, Hash, Tag, FileText, Layers } from 'lucide-react';
import ErrorDisplay from '../components/ErrorDisplay';

export default function SensorCategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: deviceTypes = [], error, mutate } = useDeviceTypes();

  const deviceType = deviceTypes.find((item: DeviceType) => item.objectId === id);

  if (error) {
    return <ErrorDisplay onRetry={() => mutate()} />;
  }

  if (!deviceType && deviceTypes.length > 0) {
    return (
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">디바이스 타입을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">요청하신 ID({id})에 해당하는 디바이스 타입이 존재하지 않습니다.</p>
            <Button onClick={() => navigate('/devices/sensors')}>
              목록으로 돌아가기
            </Button>
          </div>
        </div>
    );
  }

  if (!deviceType) {
    return (
        <div className="p-6">
          <div className="text-center">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
    );
  }

  // 프로파일 테이블 컬럼 정의
  const profileColumns = [
    {
      key: 'fieldKey' as keyof typeof deviceType.profiles[0],
      header: 'Field Key',
      cell: (value: any) => (
          <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {value}
          </div>
      ),
    },
    {
      key: 'description' as keyof typeof deviceType.profiles[0],
      header: '설명',
      cell: (value: any) => <div className="font-medium">{value}</div>,
    },
    {
      key: 'fieldType' as keyof typeof deviceType.profiles[0],
      header: '데이터 타입',
      cell: (value: any) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: 'fieldUnit' as keyof typeof deviceType.profiles[0],
      header: '단위',
      cell: (value: any) => (
          <div className="text-sm text-gray-600">
            {value || '—'}
          </div>
      ),
    },
  ];

  return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/devices/sensors')}
              className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            센서 분류 목록
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{deviceType.description}</h1>
                  <p className="text-lg text-gray-600 mt-1">IoT 센서 분류 상세 정보</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                수정
              </Button>
              <Button variant="outline" size="sm">
                삭제
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">디바이스 정보 및 프로필</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="h-4 w-4 text-green-600" />
                <div className="flex justify-between items-center w-full">
                  <p className="text-xs text-gray-600">디바이스 ID</p>
                  <p className="font-semibold text-gray-900">{deviceType.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="h-4 w-4 text-purple-600" />
                <div className="flex justify-between items-center w-full">
                  <p className="text-xs text-gray-600">Object ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">{deviceType.objectId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-4 w-4 text-orange-600" />
                <div className="flex justify-between items-center w-full">
                  <p className="text-xs text-gray-600">버전</p>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  v{deviceType.version}
                </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {deviceType.profiles && deviceType.profiles.length > 0 ? (
                <DataTable
                    columns={profileColumns}
                    data={deviceType.profiles}
                    className="border-0"
                />
            ) : (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">프로파일이 없습니다</h3>
                  <p className="text-sm text-gray-600">등록된 데이터 프로파일이 없습니다.</p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}