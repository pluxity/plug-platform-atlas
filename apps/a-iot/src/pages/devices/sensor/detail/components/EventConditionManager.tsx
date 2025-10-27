import React from 'react';
import { Button, DataTable } from '@plug-atlas/ui';
import { Plus, AlertTriangle, Trash2 } from 'lucide-react';
import { DeviceProfile } from '../../../../../services/types';
import {createColumns} from "./CreateColumns.tsx";
import ErrorDisplay from "../../../../../components/error/ErrorDisplay.tsx";
import {useEventConditionManager} from "../handlers/useEventConditionManager.ts";


interface EventConditionsManagerProps {
    objectId: string;
    profiles: DeviceProfile[];
}

export default function EventConditionsManager({ objectId, profiles }: EventConditionsManagerProps) {
    const {
        conditionsData,
        isLoading,
        error,
        editingRows,
        selectedRows,
        isAddingNew,
        newCondition,
        setSelectedRows,
        setNewCondition,
        editHandlers,
        newConditionHandlers,
        deleteHandlers,
        refetch
    } = useEventConditionManager(objectId);

    const columns = createColumns({ editingRows, profiles, editHandlers });
    const displayData = React.useMemo(() => {
        if (isAddingNew) {
            return [...conditionsData, newCondition as any];
        }
        return conditionsData;
    }, [isAddingNew, conditionsData, newCondition]);

    const enhancedColumns = React.useMemo(() => {
        if (!isAddingNew) return columns;

        return columns.map(col => ({
            ...col,
            cell: (value: any, row: any, index: number) => {
                if (index === conditionsData.length) {
                    return renderNewRowCell(col.key, newCondition, setNewCondition, newConditionHandlers);
                }
                return col.cell(value, row, index);
            }
        }));
    }, [isAddingNew, columns, conditionsData.length, newCondition, newConditionHandlers]);

    if (error) {
        return <ErrorDisplay onRetry={refetch} />;
    }

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
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {selectedRows.length > 0 && (
                            <Button variant="outline" onClick={deleteHandlers.handleDeleteSelected}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                선택 삭제 ({selectedRows.length})
                            </Button>
                        )}
                        <Button onClick={newConditionHandlers.handleAddNew} disabled={isAddingNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            컨디션 추가
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">로딩 중...</p>
                    </div>
                ) : conditionsData.length > 0 || isAddingNew ? (
                    <DataTable
                        columns={enhancedColumns as any}
                        data={displayData}
                        className="border-0"
                        selectable={true}
                        selectedRows={selectedRows}
                        onSelectionChange={setSelectedRows}
                        getRowId={(row, index) => row.id ? String(row.id) : `new-${index}`}
                    />
                )}
            </div>
        </div>
    );
}

// 새 행 렌더링 함수 (별도 파일로 분리 가능)
function renderNewRowCell(key: string, newCondition: any, setNewCondition: any, handlers: any) {
    // 새 행 셀 렌더링 로직
    switch (key) {
        case 'fieldKey':
        // EditableFieldKey 컴포넌트 렌더링
        case 'level':
        // EditableLevel 컴포넌트 렌더링
        // ... 기타 케이스들
        default:
            return null;
    }
}