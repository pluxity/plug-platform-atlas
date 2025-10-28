import React from 'react';
import { Button, DataTable } from '@plug-atlas/ui';
import { Plus, AlertTriangle, Info, Save, X, FileEdit } from 'lucide-react';
import { DeviceProfile } from '../../../../../services/types';
import { useEventConditionManager } from "../handlers/useEventConditionManager";
import { createColumns } from "./CreateColumns";
import { renderNewRowCell } from "./renderNewRowCell";
import ErrorDisplay from "../../components/ErrorDisplay";

interface EventConditionsManagerProps {
    objectId: string;
    profiles: DeviceProfile[];
}

export default function EventConditionsManager({ objectId, profiles }: EventConditionsManagerProps) {
    const {
        conditionsData,
        isLoading,
        error,
        editingData,
        newConditions,
        isAddingMode,
        hasChanges,
        handleEditDataChange,
        handleSaveRow,
        handleCancelRow,
        handleAddNew,
        handleSaveNew,
        handleCancelNew,
        handleNewConditionChange,
        handleRemoveNewCondition,
        handleDelete,
        refetch
    } = useEventConditionManager(objectId);

    // 디버깅: 상태 확인
    console.log('EventConditionManager render:', {
        isAddingMode,
        newConditions,
        conditionsData: conditionsData.length,
        profiles: profiles.length
    });

    const columns = createColumns({
        profiles,
        editingData,
        hasChanges,
        handleEditDataChange,
        handleSaveRow,
        handleCancelRow,
        handleDelete
    });

    // 표시할 데이터: 기존 조건들 + 새 조건들
    const displayData = React.useMemo(() => {
        const existingData = [...conditionsData];
        if (isAddingMode && newConditions.length > 0) {
            const newRowsData = newConditions.map((condition, index) => ({
                ...condition,
                id: `new-${index}`,
                isNewRow: true // 새 행임을 명시적으로 표시
            }));
            console.log('Adding new rows to display data:', newRowsData);
            return [...existingData, ...newRowsData];
        }
        return existingData;
    }, [conditionsData, newConditions, isAddingMode]);

    const enhancedColumns = React.useMemo(() => {
        console.log('Creating enhanced columns, isAddingMode:', isAddingMode);
        
        if (!isAddingMode) {
            console.log('Not in adding mode, returning normal columns');
            return columns;
        }

        return columns.map(col => ({
            ...col,
            cell: (value: any, row: any, index: number) => {
                console.log(`Enhanced column cell - key: ${col.key}, index: ${index}, row:`, row);
                
                // 새 행인지 확인 - row.isNewRow 속성 또는 문자열 ID로 판단
                const isNewRow = row.isNewRow === true || (typeof row.id === 'string' && row.id.startsWith('new-'));
                
                if (isNewRow) {
                    console.log(`This is a new row! index: ${index}, id: ${row.id}`);
                    
                    // 새 행의 실제 인덱스 계산
                    const newRowIndex = typeof row.id === 'string' && row.id.startsWith('new-') 
                        ? parseInt(row.id.split('-')[1], 10) 
                        : index - conditionsData.length;
                    
                    const newCondition = newConditions[newRowIndex];
                    
                    console.log(`New row index: ${newRowIndex}, condition:`, newCondition);

                    if (!newCondition) {
                        console.log('No new condition found for this index');
                        return <div className="p-2 text-center text-gray-400">-</div>;
                    }

                    return renderNewRowCell({
                        columnKey: String(col.key),
                        newCondition,
                        newRowIndex,
                        handlers: {
                            onChange: handleNewConditionChange,
                            onRemove: handleRemoveNewCondition,
                            onSaveAll: handleSaveNew,
                            onCancelAll: handleCancelNew
                        },
                        profiles,
                        isLastRow: newRowIndex === newConditions.length - 1
                    });
                }
                
                console.log('Regular row, using original cell function');
                return col.cell(value, row, index);
            }
        }));
    }, [isAddingMode, columns, conditionsData.length, newConditions, handleNewConditionChange, handleRemoveNewCondition, handleSaveNew, handleCancelNew, profiles]);

    // 변경된 행의 개수 계산
    const changedRowsCount = conditionsData.filter((_, index) => hasChanges(index)).length;

    if (error) {
        return <ErrorDisplay onRetry={refetch} />;
    }

    console.log('Final display data:', displayData);
    console.log('Enhanced columns:', enhancedColumns);

    return (
        <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">이벤트 컨디션 관리</h2>
                            <p className="text-sm text-gray-600">디바이스 데이터 기반 이벤트 조건 설정</p>
                            {conditionsData.length > 0 && (
                                <p className="text-xs text-blue-600 mt-1">
                                    <FileEdit className="h-3 w-3 inline mr-1" />
                                    전체 편집 모드: 변경된 행만 개별 저장하세요
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {isAddingMode && (
                            <>
                                <Button
                                    variant="default"
                                    onClick={handleSaveNew}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    모두 저장 ({newConditions.length})
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelNew}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    취소
                                </Button>
                            </>
                        )}
                        <Button onClick={handleAddNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            {isAddingMode ? "행 추가" : "컨디션 추가"}
                        </Button>
                    </div>
                </div>

                {changedRowsCount > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">
                            <strong>{changedRowsCount}개</strong>의 조건에 변경사항이 있습니다. 
                            각 행의 <strong>"저장" 버튼</strong>을 클릭하여 개별 저장하세요.
                        </span>
                    </div>
                )}

                {isAddingMode && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                        <Info className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                            {newConditions.length}개의 새 컨디션을 추가하는 중입니다. 
                            <strong className="mx-1">"행 추가"</strong>로 더 추가하거나 
                            <strong className="mx-1">"모두 저장"</strong>으로 일괄 저장하세요.
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">로딩 중...</p>
                    </div>
                ) : displayData.length > 0 ? (
                    <div className="space-y-4">
                        <DataTable
                            columns={enhancedColumns as any}
                            data={displayData}
                            className="border-0"
                            selectable={false}
                            getRowId={(row, index) => {
                                const id = typeof row.id === 'string' ? row.id : String(row.id || index);
                                console.log(`getRowId for row ${index}:`, id);
                                return id;
                            }}
                        />

                        {/* 편집 가이드 */}
                        {conditionsData.length > 0 && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                <p>💡 <strong>편집 가이드:</strong></p>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li>모든 필드를 직접 수정할 수 있습니다</li>
                                    <li>변경사항이 있는 행에만 "저장" 버튼이 나타납니다</li>
                                    <li>"취소" 버튼으로 해당 행의 변경사항을 되돌릴 수 있습니다</li>
                                    <li>각 행은 개별적으로 저장됩니다</li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            등록된 이벤트 컨디션이 없습니다
                        </h3>
                        <p className="text-gray-600 mb-4">
                            새로운 이벤트 컨디션을 추가해보세요.
                        </p>
                        <Button onClick={handleAddNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            첫 번째 컨디션 추가
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}