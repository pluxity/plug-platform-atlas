// External packages
import { AlertCircle, FileEdit, Info, Plus, Save, X } from 'lucide-react'

// @plug-atlas packages
import { Button, Toaster } from '@plug-atlas/ui'

// Internal imports
import { DeviceProfile } from '@/services/types'
import { useEventConditionManager } from '@/pages/management/devices/sensor/handlers/useEventConditionManager'
import ErrorDisplay from '@/pages/management/devices/sensor/components/ErrorDisplay'
import EventConditionList from '@/pages/management/devices/sensor/components/detail/EventConditionList'

interface EventConditionsManagerProps {
    objectId: string
    profiles: DeviceProfile[]
}

export default function EventConditionsManager({ objectId, profiles }: EventConditionsManagerProps) {
    const {
        conditionsData,
        isLoading,
        error,
        isDirty,
        validationErrors,
        errorIndices,
        apiError,
        handleEditDataChange,
        handleAddNew,
        handleRemoveCondition,
        handleDelete,
        handleSaveAll,
        handleCancelAll,
        refetch
    } = useEventConditionManager(objectId, profiles);

    if (error) {
        return <ErrorDisplay onRetry={refetch} />;
    }


    return (
        <>
            <Toaster />
            <div className="bg-white">
                <div className="border-b border-gray-200 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">이벤트 조건 관리</h2>
                        {isDirty && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                저장되지 않은 변경사항
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">

                        {isDirty && (
                            <>
                                <Button
                                    variant="default"
                                    onClick={handleSaveAll}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    전체 저장
                                </Button>
                                <Button variant="outline" onClick={handleCancelAll}>
                                    <X className="h-4 w-4 mr-2" />
                                    전체 취소
                                </Button>
                            </>
                        )}
                        <Button variant="default" onClick={handleAddNew}>
                            <Plus className="h-4 w-4" />
                            새 조건 추가
                        </Button>
                    </div>
                </div>

                {profiles.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-yellow-600" />
                            <p className="text-sm text-yellow-800">
                                이 센서에 등록된 데이터 프로파일이 없습니다. 이벤트 조건을 생성하기 전에 먼저 프로파일을 등록해주세요.
                            </p>
                        </div>
                    </div>
                )}

                {(validationErrors.length > 0 || apiError) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-red-800 mb-2">
                                    {apiError ? 'API 오류' : '검증 오류'}
                                </h3>

                                {apiError && (
                                    <div className="text-sm text-red-700 mb-3 p-2 bg-red-100 rounded border border-red-300">
                                        {apiError}
                                    </div>
                                )}

                                {validationErrors.length > 0 && (
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="flex items-start gap-1">
                                                <span className="mt-1">•</span>
                                                <span>{error}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div>
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">로딩 중...</p>
                    </div>
                ) : conditionsData.length > 0 ? (
                    <EventConditionList
                        conditions={conditionsData}
                        profiles={profiles}
                        errorIndices={errorIndices}
                        onFieldChange={handleEditDataChange}
                        onRemove={handleRemoveCondition}
                        onDelete={handleDelete}
                    />
                ) : (
                    <div className="text-center py-12">
                        <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                            <FileEdit className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">이벤트 조건이 없습니다</h3>
                        <p className="text-sm text-gray-600 mb-4">새 조건을 추가하여 센서 데이터 모니터링을 시작하세요.</p>
                        {profiles.length > 0 && (
                            <Button variant="default" onClick={handleAddNew}>
                                <Plus className="h-4 w-4 mr-2" />
                                첫 조건 추가
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
        </>
    );
}