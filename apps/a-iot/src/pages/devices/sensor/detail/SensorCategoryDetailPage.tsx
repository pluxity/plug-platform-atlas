import { useParams, useNavigate } from 'react-router-dom';
import { useDeviceTypes } from '../../../../services/hooks';
import { Button } from '@plug-atlas/ui';
import { ArrowLeft, Package } from 'lucide-react';
import ErrorDisplay from '../components/ErrorDisplay';
import DeviceTypeBasicInfo from "./components/DeviceTypeBasicInfo.tsx";
import EventConditionsManager from "./components/EventConditionManager.tsx";
import {DeviceType} from "../../../../services/types";

export default function SensorCategoryDetailPage() {
  const { objectId } = useParams<{ objectId: string }>();
  const navigate = useNavigate();
  const { data: deviceTypes = [], error, mutate } = useDeviceTypes();

  const deviceType = deviceTypes.find((item: DeviceType) => item.objectId === objectId);


  if (error) {
    return <ErrorDisplay onRetry={() => mutate()} />;
  }

  if (!deviceType && deviceTypes.length > 0) {
    return (
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">디바이스 타입을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">요청하신 ID({objectId})에 해당하는 디바이스가 존재하지 않습니다.</p>
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

  return (
      <div className="p-6">
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

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{deviceType.description}</h1>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DeviceTypeBasicInfo
              deviceType={deviceType}
          />

          <EventConditionsManager
              objectId={deviceType.objectId}
              profiles={deviceType.profiles || []}
          />
        </div>
      </div>
  );
}