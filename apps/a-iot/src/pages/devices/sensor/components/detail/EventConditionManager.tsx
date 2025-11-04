import { Button } from '@plug-atlas/ui';
import { Plus, AlertTriangle, Info, Save, X, FileEdit } from 'lucide-react';
import { DeviceProfile } from '../../../../../services/types';
import { useEventConditionManager } from "../../handlers/useEventConditionManager.ts";
import { createColumns } from "./CreateColumns.tsx";
import ErrorDisplay from '../ErrorDisplay.tsx';

interface EventConditionsManagerProps {
    objectId: string;
    profiles: DeviceProfile[];
}

export default function EventConditionsManager({ objectId, profiles }: EventConditionsManagerProps) {
    const {
        conditionsData,
        isLoading,
        error,
        hasUnsavedChanges,
        handleEditDataChange,
        handleAddNew,
        handleRemoveCondition,
        handleDelete,
        handleSaveAll,
        handleCancelAll,
        refetch
    } = useEventConditionManager(objectId, profiles);

    const columns = createColumns({
        profiles,
        handleEditDataChange,
        handleRemoveCondition,
        handleDelete,
    });

    if (error) {
        return <ErrorDisplay onRetry={refetch} />;
    };

    const renderTable = () => {
        return (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th 
                                    key={index}
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                    {column.header === 'Field Key' && (
                                        <span className="ml-1 text-blue-500" title="필드키 순 정렬">↑</span>
                                    )}
                                    {column.header === '레벨' && (
                                        <span className="ml-1 text-red-500" title="위험→경고→주의→정상 순 정렬">↑</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {conditionsData.map((condition, rowIndex) => (
                            <tr key={condition.id || `new-${rowIndex}`}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}
                                        className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                        {column.cell(condition[column.key], condition, rowIndex)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white">
            <div className="border-b border-gray-200 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">이벤트 조건 관리</h2>
                        {hasUnsavedChanges && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                저장되지 않은 변경사항
                            </span>
                        )}
                        {conditionsData.length > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Field Key 순, 위험→경고→주의→정상 순 정렬
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {hasUnsavedChanges && (
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
                            <Plus className="h-4 w-4 mr-2" />
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
            </div>

            <div>
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">로딩 중...</p>
                    </div>
                ) : conditionsData.length > 0 ? (
                    renderTable()
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
    );
}