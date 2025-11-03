import { Button } from "@plug-atlas/ui";
import { DeviceProfile, EventCondition } from "../../../../../services/types";
import { Column, isBooleanProfile } from "../../handlers/EventConditionUtils";
import { EditableCondition, EditableConditionType, EditableFieldKey, EditableLevel } from "./EditableCells";
import { Bell, BellOff, Mail, MailX } from "lucide-react";

interface CreateColumnsProps {
    profiles: DeviceProfile[];
    editingData: { [key: number]: EventCondition };
    hasChanges: (index: number) => boolean;
    handleEditDataChange: (index: number, field: keyof EventCondition, value: any) => void;
    handleSaveRow: (index: number) => Promise<void>;
    handleCancelRow: (index: number) => void;
    handleDelete: (conditionId: number) => Promise<void>;
    getConditionSummary: (condition: EventCondition) => string;
}

export const createColumns = ({
    profiles,
    editingData,
    handleEditDataChange,
    handleCancelRow,
    handleDelete,
}: CreateColumnsProps): Column<EventCondition>[] => [
    {
        key: 'fieldKey',
        header: 'Field Key',
        cell: (value: string, _row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const isEditing = editingData[currentIndex] !== undefined;
            const currentValue = editingData[currentIndex]?.fieldKey ?? value ?? '';

            return (
                <EditableFieldKey
                    value={currentValue}
                    onChange={(newValue: string) => handleEditDataChange(currentIndex, 'fieldKey', newValue)}
                    profiles={profiles}
                    isEditing={isEditing}
                />
            );
        },
    },
    {
        key: 'level',
        header: '레벨',
        cell: (value: EventCondition['level'], row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const isEditing = editingData[currentIndex] !== undefined;
            const currentRow = editingData[currentIndex] || row;
            const currentValue = currentRow.level ?? value ?? 'NORMAL';

            return (
                <EditableLevel
                    value={currentValue}
                    onChange={(newValue: EventCondition['level']) => handleEditDataChange(currentIndex, 'level', newValue)}
                    isEditing={isEditing}
                    profiles={profiles}
                    fieldKey={currentRow.fieldKey ?? ''}
                />
            );
        },
    },
    {
        key: 'conditionType',
        header: '타입',
        cell: (value: EventCondition['conditionType'], row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const isEditing = editingData[currentIndex] !== undefined;
            const currentRow = editingData[currentIndex] || row;
            const currentValue = currentRow.conditionType ?? value ?? 'SINGLE';
            const fieldKey = currentRow.fieldKey ?? '';

            const isBoolean = isBooleanProfile(profiles, fieldKey);
            if (isBoolean) {
                return <div className="text-gray-400 text-sm text-center">-</div>;
            }

            return (
                <EditableConditionType
                    value={currentValue}
                    onChange={(field: keyof EventCondition, newValue: any) => handleEditDataChange(currentIndex, field, newValue)}
                    isEditing={isEditing}
                    profiles={profiles}
                    fieldKey={fieldKey}
                    row={currentRow}
                />
            );
        },
    },
    {
        key: 'operator',
        header: '조건',
        cell: (_value: EventCondition['operator'], row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const isEditing = editingData[currentIndex] !== undefined;
            const displayRow = editingData[currentIndex] || row;

            return (
                <EditableCondition
                    row={displayRow}
                    onChange={(field: keyof EventCondition, newValue: any) => handleEditDataChange(currentIndex, field, newValue)}
                    isEditing={isEditing}
                    profiles={profiles}
                />
            );
        },
    },
    {
        key: 'activate',
        header: '알림',
        cell: (value: boolean, _row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const isEditing = editingData[currentIndex] !== undefined;
            const currentValue = editingData[currentIndex]?.activate ?? value ?? true;

            if (!isEditing) {
                return (
                    <div className="flex justify-center">
                        <div className={`p-1 h-8 w-8 flex items-center justify-center ${currentValue ? 'text-green-600' : 'text-gray-400'}`}>
                            {currentValue ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDataChange(currentIndex, 'activate', !currentValue)}
                        className={`p-1 h-8 w-8 ${currentValue ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={currentValue ? '활성화됨 (클릭하여 비활성화)' : '비활성화됨 (클릭하여 활성화)'}
                    >
                        {currentValue ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                </div>
            );
        },
    },
    {
        key: 'notificationEnabled',
        header: 'SMS',
        cell: (value: boolean, _row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const isEditing = editingData[currentIndex] !== undefined;
            const currentValue = editingData[currentIndex]?.notificationEnabled ?? value ?? true;

            if (!isEditing) {
                return (
                    <div className="flex justify-center">
                        <div className={`p-1 h-8 w-8 flex items-center justify-center ${currentValue ? 'text-blue-600' : 'text-gray-400'}`}>
                            {currentValue ? <Mail className="h-4 w-4" /> : <MailX className="h-4 w-4" />}
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDataChange(currentIndex, 'notificationEnabled', !currentValue)}
                        className={`p-1 h-8 w-8 ${currentValue ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={currentValue ? '알림 활성화됨 (클릭하여 비활성화)' : '알림 비활성화됨 (클릭하여 활성화)'}
                    >
                        {currentValue ? <Mail className="h-4 w-4" /> : <MailX className="h-4 w-4" />}
                    </Button>
                </div>
            );
        },
    },
    {
        key: 'id',
        header: '작업',
        cell: (_value: number | undefined, row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const isEditing = editingData[currentIndex] !== undefined;

            if (!isEditing) {
                return (
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (row.id) {
                                    handleEditDataChange(currentIndex, 'id', row.id);
                                }
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="이 행 편집하기"
                        >
                            편집
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => row.id && handleDelete(row.id)}
                            className="text-red-600 hover:text-red-800"
                            title="이 조건 삭제"
                        >
                            삭제
                        </Button>
                    </div>
                );
            }

            return (
                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelRow(currentIndex)}
                        className="text-gray-600 hover:text-gray-800"
                        title="편집 모드 종료"
                    >
                        취소
                    </Button>
                </div>
            );
        },
    },
];