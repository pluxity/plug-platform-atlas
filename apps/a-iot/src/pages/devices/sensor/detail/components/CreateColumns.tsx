import { Button } from "@plug-atlas/ui";
import {DeviceProfile, EventCondition} from "../../../../../services/types";
import {Column, EditHandlers} from "../handlers/eventConditionUtils";
import {EditableCondition, EditableConditionType, EditableFieldKey, EditableLevel } from "./EditField";
import {Bell, BellOff, Eye, EyeOff, Save, Settings, X} from "lucide-react";

interface CreateColumnsProps {
    editingRows: Set<number>;
    profiles: DeviceProfile[];
    editHandlers: EditHandlers;
}

export const createColumns = ({ editingRows, profiles, editHandlers }: CreateColumnsProps): Column<EventCondition>[] => [
    {
        key: 'fieldKey',
        header: 'Field Key',
        cell: (value: string, _row: EventCondition, index: number) => (
            <EditableFieldKey
                value={editingRows.has(index) ? (editHandlers.getEditingValue(index, 'fieldKey', value) as string) : value}
                onChange={(newValue: any) => editHandlers.handleEditDataChange(index, 'fieldKey', newValue)}
                isEditing={editingRows.has(index)}
                profiles={profiles}
            />
        ),
    },
    {
        key: 'level',
        header: '레벨',
        cell: (value: EventCondition['level'], _row: EventCondition, index: number) => (
            <EditableLevel
                value={editingRows.has(index) ? (editHandlers.getEditingValue(index, 'level', value) as EventCondition['level']) : value}
                onChange={(newValue: any) => editHandlers.handleEditDataChange(index, 'level', newValue)}
                isEditing={editingRows.has(index)}
            />
        ),
    },
    {
        key: 'conditionType',
        header: '타입',
        cell: (value: EventCondition['conditionType'], _row: EventCondition, index: number) => (
            <EditableConditionType
                value={editingRows.has(index) ? (editHandlers.getEditingValue(index, 'conditionType', value) as EventCondition['conditionType']) : value}
                onChange={(newValue: any) => editHandlers.handleEditDataChange(index, 'conditionType', newValue)}
                isEditing={editingRows.has(index)}
            />
        ),
    },
    {
        key: 'operator',
        header: '조건',
        cell: (_value: EventCondition['operator'], row: EventCondition, index: number) => {
            const editingData = editHandlers.getEditingValue(index, 'id', null);
            const displayRow = editingRows.has(index) && editingData ?
                Object.keys(row).reduce((acc, key) => {
                    acc[key as keyof EventCondition] = editHandlers.getEditingValue(index, key as keyof EventCondition, row[key as keyof EventCondition]);
                    return acc;
                }, {} as EventCondition) : row;

            return (
                <EditableCondition
                    row={displayRow}
                    isEditing={editingRows.has(index)}
                    onChange={(field: any, newValue: any) => editHandlers.handleEditDataChange(index, field, newValue)}
                />
            );
        },
    },
    {
        key: 'activate',
        header: '활성화',
        cell: (value: boolean, _row: EventCondition, index: number) => {
            const isEditing = editingRows.has(index);
            const currentValue = isEditing ? (editHandlers.getEditingValue(index, 'activate', value) as boolean) : value;

            if (!isEditing) {
                return currentValue ? (
                    <Eye className="h-4 w-4 text-green-600" />
                ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                );
            }

            return (
                <input
                    type="checkbox"
                    checked={currentValue}
                    onChange={(e) => editHandlers.handleEditDataChange(index, 'activate', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                />
            );
        },
    },
    {
        key: 'notificationEnabled',
        header: '알림',
        cell: (value: boolean, _row: EventCondition, index: number) => {
            const isEditing = editingRows.has(index);
            const currentValue = isEditing ? (editHandlers.getEditingValue(index, 'notificationEnabled', value) as boolean) : value;

            if (!isEditing) {
                return currentValue ? (
                    <Bell className="h-4 w-4 text-blue-600" />
                ) : (
                    <BellOff className="h-4 w-4 text-gray-400" />
                );
            }

            return (
                <input
                    type="checkbox"
                    checked={currentValue}
                    onChange={(e) => editHandlers.handleEditDataChange(index, 'notificationEnabled', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                />
            );
        },
    },
    {
        key: 'id',
        header: '작업',
        cell: (_: any, row: EventCondition, index: number) => {
            const isEditing = editingRows.has(index);

            if (isEditing) {
                return (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editHandlers.handleSaveEdit(index)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editHandlers.handleCancelEdit(index)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                );
            }

            return (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editHandlers.handleStartEdit(row, index)}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];