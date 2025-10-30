import React from "react";
import { Button } from '@plug-atlas/ui';
import { Bell, BellOff, Mail, MailX } from 'lucide-react';
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
    const { onChange, onSaveAll, onCancelAll } = handlers;
    
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
                if (value) {
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
        
        case 'operator':
            const conditionRow = createTempEventCondition(newCondition, -(newRowIndex + 1));
            
            const handleConditionChange = (field: keyof EventCondition, value: any) => {
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
        
        case 'activate':
            const activateValue = newCondition.activate ?? true;
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange(newRowIndex, 'activate', !activateValue)}
                        className={`p-1 h-8 w-8 ${activateValue ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={activateValue ? '활성화됨 (클릭하여 비활성화)' : '비활성화됨 (클릭하여 활성화)'}
                    >
                        {activateValue ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                </div>
            );
        
        case 'notificationEnabled':
            const notificationValue = newCondition.notificationEnabled ?? true;
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange(newRowIndex, 'notificationEnabled', !notificationValue)}
                        className={`p-1 h-8 w-8 ${notificationValue ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={notificationValue ? '알림 활성화됨 (클릭하여 비활성화)' : '알림 비활성화됨 (클릭하여 활성화)'}
                    >
                        {notificationValue ? <Mail className="h-4 w-4" /> : <MailX className="h-4 w-4" />}
                    </Button>
                </div>
            );
        
        case 'id':
            return (
                <div className="flex items-center gap-2">
                    {isLastRow && (
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                onClick={onSaveAll}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                title="새 조건 저장"
                            >
                                저장
                            </Button>
                            <Button
                                size="sm"
                                variant="outline" 
                                onClick={onCancelAll}
                                title="새 조건 추가 취소"
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