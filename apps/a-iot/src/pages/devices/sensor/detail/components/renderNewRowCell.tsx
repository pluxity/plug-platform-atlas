import React from "react";
import {CreateConditionData} from "../handlers/EventConditionUtils.tsx";
import {DeviceProfile} from "../../../../../services/types";
import {EditableCondition, EditableConditionType, EditableFieldKey, EditableLevel} from "./EditableCells";
import {Button} from "@plug-atlas/ui";
import {Trash2, Bell, BellOff, Eye, EyeOff} from "lucide-react";

interface NewRowHandlers {
    onChange: (index: number, field: keyof CreateConditionData, value: any) => void;
    onRemove: (index: number) => void;
    onSaveAll: () => Promise<void>;
    onCancelAll: () => void;
}

interface NewRowRendererProps {
    columnKey: string;
    newCondition: CreateConditionData;
    newRowIndex: number;
    handlers: NewRowHandlers;
    profiles: DeviceProfile[];
    isLastRow: boolean;
}

export const renderNewRowCell = ({
                                     columnKey,
                                     newCondition,
                                     newRowIndex,
                                     handlers,
                                     profiles
                                 }: NewRowRendererProps): React.ReactNode => {

    // 디버깅: 상태 변화 확인
    console.log(`renderNewRowCell - columnKey: ${columnKey}, newRowIndex: ${newRowIndex}`, {
        newCondition,
        fieldValue: newCondition[columnKey as keyof CreateConditionData]
    });

    // conditionType 변경 시 적절한 값 설정
    const handleConditionTypeChange = (value: 'SINGLE' | 'RANGE') => {
        console.log(`Condition type changed to: ${value} for index: ${newRowIndex}`);
        handlers.onChange(newRowIndex, 'conditionType', value);
    };

    const handleFieldKeyChange = (value: string) => {
        console.log(`FieldKey changed to: ${value} for index: ${newRowIndex}`);
        handlers.onChange(newRowIndex, 'fieldKey', value);
    };

    const handleLevelChange = (value: CreateConditionData['level']) => {
        console.log(`Level changed to: ${value} for index: ${newRowIndex}`);
        handlers.onChange(newRowIndex, 'level', value);
    };

    switch (columnKey) {
        case 'fieldKey':
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-1">
                    <EditableFieldKey
                        value={newCondition.fieldKey || ''}
                        onChange={handleFieldKeyChange}
                        isEditing={true}
                        profiles={profiles}
                    />
                </div>
            );

        case 'level':
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-1">
                    <EditableLevel
                        value={newCondition.level || 'NORMAL'}
                        onChange={handleLevelChange}
                        isEditing={true}
                    />
                </div>
            );

        case 'conditionType':
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-1">
                    <EditableConditionType
                        value={newCondition.conditionType || 'SINGLE'}
                        onChange={handleConditionTypeChange}
                        isEditing={true}
                    />
                </div>
            );

        case 'operator':
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-1">
                    <EditableCondition
                        row={newCondition as any}
                        isEditing={true}
                        onChange={(field, value) => {
                            console.log(`Operator/Value changed - field: ${field}, value: ${value} for index: ${newRowIndex}`);
                            handlers.onChange(newRowIndex, field as keyof CreateConditionData, value);
                        }}
                    />
                </div>
            );

        case 'activate':
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-1 flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlers.onChange(newRowIndex, 'activate', !newCondition.activate)}
                        className={`p-1 h-8 w-8 ${newCondition.activate ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={newCondition.activate ? '활성화됨 (클릭하여 비활성화)' : '비활성화됨 (클릭하여 활성화)'}
                    >
                        {newCondition.activate ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                </div>
            );

        case 'notificationEnabled':
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-1 flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlers.onChange(newRowIndex, 'notificationEnabled', !newCondition.notificationEnabled)}
                        className={`p-1 h-8 w-8 ${newCondition.notificationEnabled ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={newCondition.notificationEnabled ? '알림 활성화됨 (클릭하여 비활성화)' : '알림 비활성화됨 (클릭하여 활성화)'}
                    >
                        {newCondition.notificationEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                </div>
            );

        case 'id':
            // 새 행이므로 "제거" 버튼만 표시 (삭제 버튼 아님)
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-1 flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlers.onRemove(newRowIndex)}
                        className="text-gray-600 hover:text-gray-800 text-xs"
                        title="이 새 행 제거 (저장 전이므로 안전)"
                    >
                        <Trash2 className="h-3 w-3 mr-1" />
                        제거
                    </Button>
                </div>
            );

        default:
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center text-gray-400 text-xs">
                    -
                </div>
            );
    }
};