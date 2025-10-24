import { DataTable } from '@plug-atlas/ui';
import { DeviceType, useDeviceTypes } from '../../../../services/deviceCategory/useDeviceCategory';
import {useNavigate} from "react-router-dom";


export default function SensorCategoriesPage() {
    const navigate = useNavigate();
    const { data: deviceTypes = [] } = useDeviceTypes();

    const columns = [
        {
            key: 'id' as keyof DeviceType,
            header: 'ID',
            cell: (value: DeviceType[keyof DeviceType]) => <div className="font-medium">{String(value)}</div>,
        },
        {
            key: 'objectId' as keyof DeviceType,
            header: 'Object ID',
            cell: (value: DeviceType[keyof DeviceType]) => <div className="font-medium">{String(value)}</div>,
        },
        {
            key: 'description' as keyof DeviceType,
            header: '설명',
            cell: (value: DeviceType[keyof DeviceType]) => <div className="font-medium">{String(value)}</div>,
        },
        {
            key: 'version' as keyof DeviceType,
            header: '버전',
            cell: (value: DeviceType[keyof DeviceType]) => (
                <div className="text-sm text-muted-foreground">
                    {String(value)}
                </div>
            ),
        },
        {
            key: 'profiles' as keyof DeviceType,
            header: '프로필 수',
            cell: (value: DeviceType[keyof DeviceType]) => (
                <div className="text-sm text-muted-foreground">
                    {Array.isArray(value) ? `${value.length}개` : '0개'}
                </div>
            ),
        },
    ];

    const handleManage = (deviceType: DeviceType) => {
        console.log('디바이스 타입 관리:', deviceType);
        navigate(`/devices/sensor-categories/${deviceType.id}`);
    };

    // 데이터 확인을 위한 디버깅
    console.log('Device Types Data:', deviceTypes);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">IoT 센서 분류 관리</h1>
                <p className="text-gray-600">IoT 센서의 분류를 등록하고 관리합니다.</p>
            </div>

            <div className="rounded-lg border bg-card">
                <DataTable
                    columns={columns}
                    data={deviceTypes}
                    onRowEdit={(deviceType: DeviceType) => handleManage(deviceType)}
                />
            </div>
        </div>
    );
}
