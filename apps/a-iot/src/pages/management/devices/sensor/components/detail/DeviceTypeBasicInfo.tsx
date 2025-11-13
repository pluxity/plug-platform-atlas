import { DataTable } from '@plug-atlas/ui';
import { Tag, FileText, Layers } from 'lucide-react';
import {DeviceProfile, DeviceType} from "../../../../../services/types";

interface DeviceTypeBasicInfoProps {
    deviceType: DeviceType;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function DeviceTypeBasicInfo({deviceType,}: DeviceTypeBasicInfoProps) {
    const profileColumns = [
        {
            key: 'fieldKey' as keyof DeviceProfile,
            header: 'Field Key',
            cell: (value: any) => (
                <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {value}
                </div>
            ),
        },
        {
            key: 'description' as keyof DeviceProfile,
            header: '설명',
            cell: (value: any) => <div className="font-medium">{value}</div>,
        },
        {
            key: 'fieldType' as keyof DeviceProfile,
            header: '데이터 타입',
            cell: (value: any) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {value}
                </span>
            ),
        },
        {
            key: 'fieldUnit' as keyof DeviceProfile,
            header: '단위',
            cell: (value: any) => (
                <div className="text-sm text-gray-600">
                    {value || '—'}
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{deviceType.description}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">{deviceType.version}</span>
                    </div>
                </div>
            </div>
            </div>
            <div>
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
    );
}