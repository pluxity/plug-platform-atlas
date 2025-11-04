import { Button } from "@plug-atlas/ui";
import { DeviceProfile, EventCondition } from "../../../../../services/types";
import { Column, isBooleanProfile } from "../../handlers/EventConditionUtils";
import { EditableCondition, EditableConditionType, EditableFieldKey, EditableLevel } from "./EditableCells";
import {Bell, BellOff, Mail, MailX, Trash2} from "lucide-react";

interface CreateColumnsProps {
    profiles: DeviceProfile[];
    handleEditDataChange: (index: number, field: keyof EventCondition, value: any) => void;
    handleDelete: (conditionId: number) => Promise<void>;
}

export const createColumns = ({
    profiles,
    handleEditDataChange,
    handleDelete,
}: CreateColumnsProps): Column<EventCondition>[] => [
    {
        key: 'fieldKey',
        header: 'Field Key',
        cell: (value: string, _row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const currentValue = value ?? '';

            return (
                <EditableFieldKey
                    value={currentValue}
                    onChange={(newValue: string) => handleEditDataChange(currentIndex, 'fieldKey', newValue)}
                    profiles={profiles}
                />
            );
        },
    },
    {
        key: 'level',
        header: '레벨',
        cell: (value: EventCondition['level'], row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const currentValue = value ?? 'NORMAL';

            return (
                <EditableLevel
                    value={currentValue}
                    onChange={(newValue: EventCondition['level']) => handleEditDataChange(currentIndex, 'level', newValue)}
                    profiles={profiles}
                    fieldKey={row.fieldKey ?? ''}
                />
            );
        },
    },
    {
        key: 'conditionType',
        header: '타입',
        cell: (value: EventCondition['conditionType'], row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const currentValue = value ?? 'SINGLE';
            const fieldKey = row.fieldKey ?? '';

            const isBoolean = isBooleanProfile(profiles, fieldKey);
            if (isBoolean) {
                return <div className="text-gray-400 text-sm text-center">-</div>;
            }

            return (
                <EditableConditionType
                    value={currentValue}
                    onChange={(field: keyof EventCondition, newValue: any) => handleEditDataChange(currentIndex, field, newValue)}
                    profiles={profiles}
                    fieldKey={fieldKey}
                    row={row}
                />
            );
        },
    },
    {
        key: 'operator',
        header: '조건',
        cell: (_value: EventCondition['operator'], row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;

            return (
                <EditableCondition
                    row={row}
                    onChange={(field: keyof EventCondition, newValue: any) => handleEditDataChange(currentIndex, field, newValue)}
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
            const currentValue = value ?? true;

            return (
                <div className="flex justify-center">
                    <Button
                        variant={currentValue ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEditDataChange(currentIndex, 'activate', !currentValue)}
                        className={`${currentValue ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300 text-gray-500 hover:bg-gray-50'} h-8 transition-colors`}
                        title={currentValue ? '활성화됨 (클릭하여 비활성화)' : '비활성화됨 (클릭하여 활성화)'}
                    >
                        {currentValue ? <Bell className="h-4 w-4"/> : <BellOff className="h-4 w-4"/>}
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
            const currentValue = value ?? true;

            return (
                <div className="flex justify-center">
                    <Button
                        variant={currentValue ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEditDataChange(currentIndex, 'notificationEnabled', !currentValue)}
                        className={`${currentValue ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300 text-gray-500 hover:bg-gray-50'} h-8 transition-colors`}
                        title={currentValue ? '알림 활성화됨 (클릭하여 비활성화)' : '알림 비활성화됨 (클릭하여 활성화)'}
                    >
                        {currentValue ? <Mail className="h-4 w-4"/> : <MailX className="h-4 w-4"/>}
                    </Button>
                </div>
            );
        },
    },
    {
        key: 'id',
        header: '작업',
        cell: (_value: number | undefined, row: EventCondition, _index?: number) => {
            return (
                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => row.id && handleDelete(row.id)}
                        className="text-red-600 hover:text-red-800"
                        title="이 조건 삭제"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];