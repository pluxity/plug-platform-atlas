import React from 'react';
import { Button } from '@plug-atlas/ui';
import { Trash2, Save, X, Bell, BellOff, Mail, MailX } from 'lucide-react';
import { DeviceProfile, EventCondition } from '../../../../../services/types';
import { CreateConditionData } from '../handlers/EventConditionUtils';
import { EditableCondition, EditableConditionType, EditableFieldKey, EditableLevel } from './EditableCells';

interface RenderNewRowCellProps {
    columnKey: string;
    newCondition: CreateConditionData;
    newRowIndex: number;
    handlers: {
        onChange: (index: number, field: keyof CreateConditionData, value: any) => void;
        onRemove: (index: number) => void;
        onSaveAll: () => Promise<void>;
        onCancelAll: () => void;
    };
    profiles: DeviceProfile[];
    isLastRow: boolean;
    getConditionSummary: (condition: CreateConditionData) => string;
}

export const renderNewRowCell = ({
    columnKey,
    newCondition,
    newRowIndex,
    handlers,
    profiles,
    isLastRow,
    getConditionSummary
}: RenderNewRowCellProps): React.ReactNode => {
    switch (columnKey) {
        case 'fieldKey':
            return (
                <EditableFieldKey
                    value={newCondition.fieldKey}
                    onChange={(value: string) => handlers.onChange(newRowIndex, 'fieldKey', value)}
                    profiles={profiles}
                    isEditing={true}
                />
            );

        case 'level':
            return (
                <EditableLevel
                    value={newCondition.level}
                    onChange={(value) => handlers.onChange(newRowIndex, 'level', value)}
                    isEditing={true}
                    profiles={profiles}
                    fieldKey={newCondition.fieldKey}
                />
            );

        case 'conditionType':
            return (
                <EditableConditionType
                    value={newCondition.conditionType}
                    onChange={(value) => handlers.onChange(newRowIndex, 'conditionType', value)}
                    isEditing={true}
                    profiles={profiles}
                    fieldKey={newCondition.fieldKey}
                />
            );

        case 'operator':
            // CreateConditionData를 EventCondition 타입으로 캐스팅
            const conditionAsEvent: EventCondition = {
                id: undefined,
                objectId: newCondition.objectId,
                fieldKey: newCondition.fieldKey,
                level: newCondition.level,
                conditionType: newCondition.conditionType,
                operator: newCondition.operator,
                thresholdValue: newCondition.thresholdValue,
                leftValue: newCondition.leftValue,
                rightValue: newCondition.rightValue,
                booleanValue: newCondition.booleanValue,
                notificationEnabled: newCondition.notificationEnabled,
                guideMessage: newCondition.guideMessage,
                activate: newCondition.activate
            };

            return (
                <EditableCondition
                    row={conditionAsEvent}
                    onChange={(field, value) => handlers.onChange(newRowIndex, field as keyof CreateConditionData, value)}
                    isEditing={true}
                    profiles={profiles}
                />
            );

        case 'activate':
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlers.onChange(newRowIndex, 'activate', !newCondition.activate)}
                        className={`p-1 h-8 w-8 ${newCondition.activate ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={newCondition.activate ? '활성화됨 (클릭하여 비활성화)' : '비활성화됨 (클릭하여 활성화)'}
                    >
                        {newCondition.activate ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                </div>
            );

        case 'notificationEnabled':
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlers.onChange(newRowIndex, 'notificationEnabled', !newCondition.notificationEnabled)}
                        className={`p-1 h-8 w-8 ${newCondition.notificationEnabled ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={newCondition.notificationEnabled ? '알림 활성화됨 (클릭하여 비활성화)' : '알림 비활성화됨 (클릭하여 활성화)'}
                    >
                        {newCondition.notificationEnabled ? <Mail className="h-4 w-4" /> : <MailX className="h-4 w-4" />}
                    </Button>
                </div>
            );

        case 'id':
            return (
                <div className="space-y-2">
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlers.onRemove(newRowIndex)}
                            className="text-red-600 hover:text-red-800"
                            title="이 새 조건 행 제거"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        {isLastRow && (
                            <>
                                <Button
                                    variant="default" 
                                    size="sm"
                                    onClick={handlers.onSaveAll}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    title="모든 새 조건 저장"
                                >
                                    <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlers.onCancelAll}
                                    className="text-gray-600 hover:text-gray-800"
                                    title="새 조건 추가 취소"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded max-w-xs">
                        {getConditionSummary(newCondition)}
                    </div>
                </div>
            );

        default:
            return <div className="p-2 text-center text-gray-400">-</div>;
    }
};