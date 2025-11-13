import { useState } from "react";
import { Button, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@plug-atlas/ui";
import { DeviceProfile, EventCondition } from "../../../../../services/types";
import { Column, isBooleanProfile, getRequiredFieldsStatus } from "../../handlers/EventConditionUtils";
import { EditableCondition, EditableConditionType, EditableFieldKey, EditableLevel } from "./EditableCells";
import {Bell, BellOff, Mail, MailX, Trash2, X} from "lucide-react";

interface CreateColumnsProps {
    profiles: DeviceProfile[];
    handleEditDataChange: (index: number, field: keyof EventCondition, value: any) => void;
    handleRemoveCondition: (index: number) => void;
    handleDelete: (conditionId: number) => Promise<void>;
}

const DeleteButton = ({
    row,
    index,
    handleRemoveCondition,
    handleDelete
}: {
    row: EventCondition;
    index: number;
    handleRemoveCondition: (index: number) => void;
    handleDelete: (conditionId: number) => Promise<void>;
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const isNewCondition = !row.id;

    const handleClick = () => {
        if (isNewCondition) {
            // 새 조건은 바로 삭제
            handleRemoveCondition(index);
        } else {
            // 기존 조건은 확인 다이얼로그 표시
            setIsDialogOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (row.id) {
            await handleDelete(row.id);
        }
        setIsDialogOpen(false);
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                className="text-red-600 hover:text-red-800"
                title={isNewCondition ? "조건 취소" : "조건 삭제"}
            >
                {isNewCondition ? (
                    <X className="h-3 w-3" />
                ) : (
                    <Trash2 className="h-3 w-3" />
                )}
            </Button>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>이벤트 조건 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            이 이벤트 조건을 정말 삭제하시겠습니까?
                            <br />
                            삭제된 조건은 복구할 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                            삭제
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export const createColumns = ({
    profiles,
    handleEditDataChange,
    handleRemoveCondition,
    handleDelete,
}: CreateColumnsProps): Column<EventCondition>[] => [
    {
        key: 'fieldKey',
        header: 'Field Key',
        cell: (value: string, row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;
            const currentValue = value ?? '';
            const requiredStatus = getRequiredFieldsStatus(row, profiles);

            return (
                <EditableFieldKey
                    value={currentValue}
                    onChange={(newValue: string) => handleEditDataChange(currentIndex, 'fieldKey', newValue)}
                    profiles={profiles}
                    isMissing={requiredStatus.fieldKey}
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
            const requiredStatus = getRequiredFieldsStatus(row, profiles);

            return (
                <EditableCondition
                    row={row}
                    onChange={(field: keyof EventCondition, newValue: any) => handleEditDataChange(currentIndex, field, newValue)}
                    profiles={profiles}
                    requiredStatus={requiredStatus}
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
        cell: (_value: number | undefined, row: EventCondition, index?: number) => {
            const currentIndex = index ?? 0;

            return (
                <div className="flex gap-1">
                    <DeleteButton
                        row={row}
                        index={currentIndex}
                        handleRemoveCondition={handleRemoveCondition}
                        handleDelete={handleDelete}
                    />
                </div>
            );
        },
    },
];