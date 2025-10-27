import {EventCondition} from "../../../../../services/types";

export type CreateConditionData = Omit<EventCondition, 'id'>;

export interface Column<T> {
    key: keyof T;
    header: string;
    cell: (value: any, row: T, index: number) => React.ReactNode;
}

export interface EditHandlers {
    handleStartEdit: (row: EventCondition, index: number) => void;
    handleCancelEdit: (index: number) => void;
    handleSaveEdit: (index: number) => Promise<void>;
    handleEditDataChange: (index: number, field: keyof EventCondition, value: any) => void;
    getEditingValue: (index: number, field: keyof EventCondition, originalValue: any) => any;
}

export interface NewConditionHandlers {
    handleAddNew: () => void;
    handleSaveNew: () => Promise<void>;
    handleCancelNew: () => void;
}

export interface DeleteHandlers {
    handleDeleteSelected: () => Promise<void>;
}


export const getLevelBadge = (level: EventCondition['level']) => {
    const levelConfigs = {
        NORMAL: { color: 'bg-blue-100 text-blue-800', label: '일반' },
        WARNING: { color: 'bg-yellow-100 text-yellow-800', label: '경고' },
        CAUTION: { color: 'bg-orange-100 text-orange-800', label: '주의' },
        DANGER: { color: 'bg-red-100 text-red-800', label: '위험' },
        DISCONNECTED: { color: 'bg-gray-100 text-gray-800', label: '연결 끊김' },
    } as const;

    const config = levelConfigs[level];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
        </span>
    );
};

export const getOperatorLabel = (operator: EventCondition['operator']): string => {
    const operatorLabels = {
        GE: '이상',
        LE: '이하',
        BETWEEN: '≥ ~ ≤',
    } as const;
    return operatorLabels[operator];
};

export const createDefaultCondition = (objectId: string): CreateConditionData => ({
    objectId,
    fieldKey: '',
    level: 'NORMAL',
    conditionType: 'SINGLE',
    operator: 'GE',
    thresholdValue: 0.1,
    leftValue: 0.1,
    rightValue: 0.1,
    booleanValue: true,
    notificationEnabled: true,
    order: 0,
    activate: true,
});