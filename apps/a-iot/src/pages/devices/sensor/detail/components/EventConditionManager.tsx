import React from 'react';
import { Button, DataTable } from '@plug-atlas/ui';
import { Plus, AlertTriangle, Info, Save, X, FileEdit } from 'lucide-react';
import { DeviceProfile, EventCondition } from '../../../../../services/types';
import { useEventConditionManager } from "../handlers/useEventConditionManager";
import { createColumns } from "./CreateColumns";
import { renderNewRowCell } from "./renderNewRowCell";
import ErrorDisplay from "../../components/ErrorDisplay";

interface EventConditionsManagerProps {
    objectId: string;
    profiles: DeviceProfile[];
}

type DisplayRowData = EventCondition & { isNewRow?: boolean };

interface DataTableColumn<T> {
    key: keyof T;
    header: string;
    cell: (value: any, row: T) => React.ReactNode;
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
    } = useEventConditionManager(objectId, profiles);

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

    const displayData = React.useMemo((): DisplayRowData[] => {
        const existingData = [...conditionsData];
        if (isAddingMode && newConditions.length > 0) {
            const newRowsData = newConditions.map((condition, index) => ({
                id: -(index + 1),
                isNewRow: true,
                ...condition
            } as DisplayRowData));
            console.log('Adding new rows to display data:', newRowsData);
            return [...existingData, ...newRowsData];
        }
        return existingData;
    }, [conditionsData, newConditions, isAddingMode]);

    const enhancedColumns = React.useMemo((): DataTableColumn<DisplayRowData>[] => {

        if (!isAddingMode) {
            return columns.map(col => ({
                ...col,
                cell: (value: any, row: DisplayRowData) => col.cell(value, row, 0)
            }));
        }

        return columns.map(col => ({
            ...col,
            cell: (value: any, row: DisplayRowData) => {
                console.log(`Enhanced column cell - key: ${col.key}, row:`, row);
                
                const isNewRow = row.isNewRow === true;
                
                if (isNewRow) {
                    console.log(`This is a new row! id: ${row.id}`);
                    
                    if (row.id == null) {
                        console.log('Row ID is null or undefined');
                        return <div className="p-2 text-center text-gray-400">-</div>;
                    }
                    
                    const newRowIndex = Math.abs(row.id) - 1;
                    const newCondition = newConditions[newRowIndex];

                    if (!newCondition) {
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
                return col.cell(value, row, 0);
            }
        }));
    }, [isAddingMode, columns, newConditions, handleNewConditionChange, handleRemoveNewCondition, handleSaveNew, handleCancelNew, profiles]);

    if (error) {
        return <ErrorDisplay onRetry={refetch} />;
    }

    return (
        <div className="bg-white">
            <div className="border-b border-gray-200 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">이벤트 조건 관리</h2>
                    </div>

                    <div className="flex gap-2">
                        {isAddingMode ? (
                            <>
                                <Button
                                    variant="default"
                                    onClick={handleSaveNew}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={newConditions.length === 0}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    새 조건 저장
                                </Button>
                                <Button variant="outline" onClick={handleCancelNew}>
                                    <X className="h-4 w-4 mr-2" />
                                    취소
                                </Button>
                                <Button variant="outline" onClick={handleAddNew}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    추가 행
                                </Button>
                            </>
                        ) : (
                            <Button variant="default" onClick={handleAddNew}>
                                <Plus className="h-4 w-4 mr-2" />
                                새 조건 추가
                            </Button>
                        )}
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

            <div >
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">로딩 중...</p>
                    </div>
                ) : displayData.length > 0 ? (
                    <DataTable
                        columns={enhancedColumns}
                        data={displayData}
                        className="border-0"
                    />
                ) : (
                    <div className="text-center py-12">
                        <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                            <FileEdit className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">이벤트 조건이 없습니다</h3>
                        <p className="text-sm text-gray-600 mb-4">새 조건을 추가하여 센서 데이터 모니터링을 시작하세요.</p>
                        {!isAddingMode && profiles.length > 0 && (
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