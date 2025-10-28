import { Button } from "@plug-atlas/ui";
import { DeviceProfile, EventCondition } from "../../../../../services/types";
import { Column } from "../handlers/EventConditionUtils.tsx";
import { EditableCondition, EditableConditionType, EditableFieldKey, EditableLevel } from "./EditableCells.tsx";
import { Bell, BellOff, Eye, EyeOff, Save, RotateCcw, Trash2 } from "lucide-react";

interface CreateColumnsProps {
    profiles: DeviceProfile[];
    editingData: { [key: number]: EventCondition };
    hasChanges: (index: number) => boolean;
    handleEditDataChange: (index: number, field: keyof EventCondition, value: any) => void;
    handleSaveRow: (index: number) => Promise<void>;
    handleCancelRow: (index: number) => void;
    handleDelete: (conditionId: number) => Promise<void>;
}

export const createColumns = ({
    profiles,
    editingData,
    hasChanges,
    handleEditDataChange,
    handleSaveRow,
    handleCancelRow,
    handleDelete
}: CreateColumnsProps): Column<EventCondition>[] => [
    {
        key: 'fieldKey',
        header: 'Field Key',
        cell: (value: string, _row: EventCondition, index: number) => (
            <EditableFieldKey
                value={editingData[index]?.fieldKey ?? value ?? ''}
                onChange={(newValue: string) => handleEditDataChange(index, 'fieldKey', newValue)}
                profiles={profiles}
                isEditing={true}
            />
        ),
    },
    {
        key: 'level',
        header: '레벨',
        cell: (value: EventCondition['level'], _row: EventCondition, index: number) => (
            <EditableLevel
                value={editingData[index]?.level ?? value ?? 'NORMAL'}
                onChange={(newValue: EventCondition['level']) => handleEditDataChange(index, 'level', newValue)}
                isEditing={true}
            />
        ),
    },
    {
        key: 'conditionType',
        header: '타입',
        cell: (value: EventCondition['conditionType'], _row: EventCondition, index: number) => (
            <EditableConditionType
                value={editingData[index]?.conditionType ?? value ?? 'SINGLE'}
                onChange={(newValue: EventCondition['conditionType']) => handleEditDataChange(index, 'conditionType', newValue)}
                isEditing={true}
            />
        ),
    },
    {
        key: 'operator',
        header: '조건',
        cell: (_value: EventCondition['operator'], row: EventCondition, index: number) => {
            const displayRow = editingData[index] || row;

            return (
                <EditableCondition
                    row={displayRow}
                    onChange={(field: keyof EventCondition, newValue: any) => handleEditDataChange(index, field, newValue)}
                    isEditing={true}
                />
            );
        },
    },
    {
        key: 'activate',
        header: '활성화',
        cell: (value: boolean, _row: EventCondition, index: number) => {
            const currentValue = editingData[index]?.activate ?? value ?? true;

            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDataChange(index, 'activate', !currentValue)}
                        className={`p-1 h-8 w-8 ${currentValue ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={currentValue ? '활성화됨 (클릭하여 비활성화)' : '비활성화됨 (클릭하여 활성화)'}
                    >
                        {currentValue ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                </div>
            );
        },
    },
    {
        key: 'notificationEnabled',
        header: '알림',
        cell: (value: boolean, _row: EventCondition, index: number) => {
            const currentValue = editingData[index]?.notificationEnabled ?? value ?? true;

            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDataChange(index, 'notificationEnabled', !currentValue)}
                        className={`p-1 h-8 w-8 ${currentValue ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-500'}`}
                        title={currentValue ? '알림 활성화됨 (클릭하여 비활성화)' : '알림 비활성화됨 (클릭하여 활성화)'}
                    >
                        {currentValue ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                </div>
            );
        },
    },
    {
        key: 'id',
        header: '작업',
        cell: (_value: number | undefined, row: EventCondition, index: number) => {
            const rowHasChanges = hasChanges(index);

            return (
                <div className="flex gap-1">
                    {rowHasChanges ? (
                        <>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleSaveRow(index)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                title="이 행의 변경사항 저장"
                            >
                                <Save className="h-4 w-4 mr-1" />
                                저장
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelRow(index)}
                                className="text-gray-600 hover:text-gray-800"
                                title="이 행의 변경사항 취소"
                            >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                취소
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => row.id && handleDelete(row.id)}
                            className="text-red-600 hover:text-red-800"
                            title="이 조건 삭제"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            삭제
                        </Button>
                    )}
                </div>
            );
        },
    },
];