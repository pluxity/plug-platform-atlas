import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TwoColumnLayout } from '@plug-atlas/ui';
import { Package } from 'lucide-react';
import ErrorDisplay from "../components/ErrorDisplay.tsx";
import SensorCategoryCard from "./components/SensorCategoryCard.tsx";
import DeviceTypeBasicInfo from '../detail/components/DeviceTypeBasicInfo.tsx';
import EventConditionsManager from "../detail/components/EventConditionManager.tsx";
import { DeviceType } from '../../../../services/types';
import { useDeviceTypes } from "../../../../services/hooks";

export default function SensorCategoryManagementPage() {
    const { objectId } = useParams<{ objectId: string }>();
    const { data: deviceTypes = [], error, mutate } = useDeviceTypes();
    const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType | null>(null);

    useEffect(() => {
        if (objectId && deviceTypes.length > 0) {
            const deviceType = deviceTypes.find((item: DeviceType) => item.objectId === objectId);
            if (deviceType) {
                const extendedDeviceType: DeviceType = {
                    ...deviceType,
                    profiles: (deviceType as any).profiles || []
                };
                setSelectedDeviceType(extendedDeviceType);
            }
        } else if (!objectId && deviceTypes.length > 0 && deviceTypes[0]) {
            const firstDevice = deviceTypes[0];
            if (firstDevice && firstDevice.objectId) {
                const extendedDeviceType: DeviceType = {
                    ...firstDevice,
                    profiles: (firstDevice as any).profiles || []
                };
                setSelectedDeviceType(extendedDeviceType);
            }
        }
    }, [objectId, deviceTypes]);

    const handleDeviceTypeSelect = (deviceType: DeviceType) => {
        const extendedDeviceType: DeviceType = {
            ...deviceType,
            profiles: (deviceType as any).profiles || []
        };
        setSelectedDeviceType(extendedDeviceType);
    };

    if (error) {
        return <ErrorDisplay onRetry={() => mutate()} />;
    }

    if (deviceTypes.length === 0) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                        <Package className="h-10 w-10 text-gray-400 mx-auto mt-3" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        등록된 센서 카테고리가 없습니다
                    </h3>
                    <p className="text-gray-600 mb-4">
                        IoT 센서 카테고리를 먼저 등록해 주세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">IoT 센서 분류 관리</h1>
                <p className="text-gray-600">IoT 센서의 분류를 등록하고 관리합니다.</p>
            </div>

            <TwoColumnLayout leftWidth="25%" rightWidth="75%" gap={24} className="h-[calc(100vh-200px)]">
                <TwoColumnLayout.Left className="p-0">
                    <div className="p-4 space-y-3 overflow-y-auto flex-1">
                        {deviceTypes.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>센서 종류가 없습니다.</p>
                            </div>
                        ) : (
                            deviceTypes.map((deviceType: DeviceType) => (
                                <SensorCategoryCard
                                    key={deviceType.objectId}
                                    deviceType={{
                                        ...deviceType,
                                        profiles: (deviceType as any).profiles || []
                                    }}
                                    isSelected={selectedDeviceType?.objectId === deviceType.objectId}
                                    onClick={() => handleDeviceTypeSelect(deviceType)}
                                />
                            ))
                        )}
                    </div>
                </TwoColumnLayout.Left>

                <TwoColumnLayout.Right className="p-0">
                    {selectedDeviceType ? (
                        <div className="p-6 h-full overflow-y-auto">
                            <div className="space-y-6">
                                <DeviceTypeBasicInfo deviceType={selectedDeviceType as any} />

                                <EventConditionsManager
                                    objectId={selectedDeviceType.objectId}
                                    profiles={selectedDeviceType.profiles || []}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                                    <Package className="h-10 w-10 text-gray-400 mx-auto mt-3" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    센서 카테고리를 선택하세요
                                </h3>
                                <p className="text-gray-600">
                                    왼쪽 목록에서 관리할 센서 카테고리를 선택해 주세요.
                                </p>
                            </div>
                        </div>
                    )}
                </TwoColumnLayout.Right>
            </TwoColumnLayout>
        </div>
    );
}