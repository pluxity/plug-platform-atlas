import React from "react";
import { Button } from '@plug-atlas/ui';
import { Trash2 } from 'lucide-react';
import { DeviceProfile, EventCondition } from "../../../../../services/types";
import { CreateConditionData } from "../handlers/EventConditionUtils";
import {
    EditableFieldKey,
    EditableLevel,
    EditableConditionType,
    EditableCondition
} from "./EditableCells";

interface NewRowCellHandlers {
    onChange: (index: number, field: keyof CreateConditionData, value: any) => void;
    onRemove: (index: number) => void;
    onSaveAll: () => void;
    onCancelAll: () => void;
}

interface RenderNewRowCellProps {
    columnKey: string;
    newCondition: CreateConditionData;
    newRowIndex: number;
    handlers: NewRowCellHandlers;
    profiles: DeviceProfile[];
    isLastRow: boolean;
}

// CreateConditionData에서 EventCondition과 호환되는 형태로 변환하는 헬퍼 함수
const createTempEventCondition = (condition: CreateConditionData, tempId: number): EventCondition => {
    return {
        id: tempId,
        ...condition
    } as EventCondition;
};

export function renderNewRowCell({
    columnKey,
    newCondition,
    newRowIndex,
    handlers,
    profiles,
    isLastRow
}: RenderNewRowCellProps): React.ReactNode {
    const { onChange, onRemove, onSaveAll, onCancelAll } = handlers;
    
    console.log(`renderNewRowCell - columnKey: ${columnKey}, index: ${newRowIndex}`, newCondition);

    switch (columnKey) {
        case 'fieldKey':
            return (
                <EditableFieldKey
                    value={newCondition.fieldKey || ''}
                    onChange={(value) => onChange(newRowIndex, 'fieldKey', value)}
                    profiles={profiles}
                    isEditing={true}
                />
            );
        
        case 'level':
            return (
                <EditableLevel
                    value={newCondition.level}
                    onChange={(value) => onChange(newRowIndex, 'level', value)}
                    isEditing={true}
                    profiles={profiles}
                    fieldKey={newCondition.fieldKey || ''}
                />
            );
        
        case 'conditionType':
            const handleConditionTypeChange = (value: EventCondition['conditionType'] | undefined) => {
                if (value) {  // undefined가 아닌 경우에만 처리
                    onChange(newRowIndex, 'conditionType', value);
                }
            };
            
            return (
                <EditableConditionType
                    value={newCondition.conditionType || 'SINGLE'}
                    onChange={handleConditionTypeChange}
                    isEditing={true}
                    profiles={profiles}
                    fieldKey={newCondition.fieldKey || ''}
                />
            );
        
        case 'condition':
            // CreateConditionData를 EventCondition 형태로 변환 (임시 ID 사용)
            const conditionRow = createTempEventCondition(newCondition, -(newRowIndex + 1));
            
            // onChange 핸들러를 CreateConditionData 필드만 처리하도록 제한
            const handleConditionChange = (field: keyof EventCondition, value: any) => {
                // id 필드는 무시하고, CreateConditionData에 있는 필드만 처리
                if (field !== 'id' && field in newCondition) {
                    onChange(newRowIndex, field as keyof CreateConditionData, value);
                }
            };
            
            return (
                <EditableCondition
                    row={conditionRow}
                    onChange={handleConditionChange}
                    isEditing={true}
                    profiles={profiles}
                />
            );
        
        case 'notificationEnabled':
            return (
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={newCondition.notificationEnabled ?? true}
                        onChange={(e) => onChange(newRowIndex, 'notificationEnabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </label>
            );
        
        case 'activate':
            return (
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={newCondition.activate ?? true}
                        onChange={(e) => onChange(newRowIndex, 'activate', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </label>
            );
        
        case 'actions':
            return (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemove(newRowIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    {isLastRow && (
                        <div className="flex gap-1 ml-2">
                            <Button
                                size="sm"
                                onClick={onSaveAll}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                저장
                            </Button>
                            <Button
                                size="sm"
                                variant="outline" 
                                onClick={onCancelAll}
                            >
                                취소
                            </Button>
                        </div>
                    )}
                </div>
            );
        
        default:
            return <div className="p-2 text-center text-gray-400">-</div>;
    }
}