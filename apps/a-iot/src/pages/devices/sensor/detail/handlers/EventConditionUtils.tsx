import React from "react";
import {EventCondition, DeviceProfile} from "../../../../../services/types";

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

export const getOperatorLabel = (operator?: EventCondition['operator']): string => {
    if (!operator) return '-';

    const operatorLabels = {
        GE: '이상',
        LE: '이하',
        BETWEEN: '≥ ~ ≤',
    } as const;
    return operatorLabels[operator];
};

export const getProfileByFieldKey = (profiles: DeviceProfile[], fieldKey: string): DeviceProfile | undefined => {
    return profiles.find(profile => profile.fieldKey === fieldKey);
};

export const isBooleanProfile = (profiles: DeviceProfile[], fieldKey: string): boolean => {
    const profile = getProfileByFieldKey(profiles, fieldKey);
    return profile?.fieldType?.toUpperCase() === 'BOOLEAN';
};

export const isFloatProfile = (profiles: DeviceProfile[], fieldKey: string): boolean => {
    const profile = getProfileByFieldKey(profiles, fieldKey);
    return profile?.fieldType?.toUpperCase() === 'FLOAT';
};

export const getBooleanAvailableLevels = (): EventCondition['level'][] => {
    return ['NORMAL', 'DANGER'];
};

export const getFloatAvailableLevels = (): EventCondition['level'][] => {
    return ['NORMAL', 'WARNING', 'CAUTION', 'DANGER', 'DISCONNECTED'];
};

export const getAvailableLevelsByProfile = (profiles: DeviceProfile[], fieldKey: string): EventCondition['level'][] => {
    if (isBooleanProfile(profiles, fieldKey)) {
        return getBooleanAvailableLevels();
    }
    return getFloatAvailableLevels();
};

export const getBooleanValueLabel = (booleanValue: boolean): string => {
    return booleanValue ? '참 (True)' : '거짓 (False)';
};

export const createDefaultCondition = (objectId: string): CreateConditionData => ({
    objectId,
    fieldKey: '',
    level: 'NORMAL',
    conditionType: 'SINGLE',
    operator: 'GE',
    thresholdValue: 1.0,
    leftValue: 1.0,
    rightValue: 2.0,
    booleanValue: true,
    notificationEnabled: true,
    activate: true,
});

export const toCreateConditionData = (condition: EventCondition | CreateConditionData): CreateConditionData => {
    const { id, ...rest } = condition as any;
    return rest;
};

export const toApiConditionData = (condition: CreateConditionData, profiles: DeviceProfile[]) => {
    const isBoolean = isBooleanProfile(profiles, condition.fieldKey);
    
    if (isBoolean) {
        return {
            fieldKey: condition.fieldKey,
            level: condition.level,
            booleanValue: condition.booleanValue ?? true,
            activate: condition.activate,
            notificationEnabled: condition.notificationEnabled,
        };
    } else {
        const baseData = {
            fieldKey: condition.fieldKey,
            level: condition.level,
            conditionType: condition.conditionType,
            operator: condition.operator,
            activate: condition.activate,
            notificationEnabled: condition.notificationEnabled,
        };

        if (condition.conditionType === 'SINGLE') {
            return {
                ...baseData,
                thresholdValue: condition.thresholdValue,
            };
        } else if (condition.conditionType === 'RANGE') {
            return {
                ...baseData,
                leftValue: condition.leftValue,
                rightValue: condition.rightValue,
            };
        }

        return baseData;
    }
};

export const validateConditionData = (condition: CreateConditionData, profiles: DeviceProfile[]): boolean => {
    if (!condition.fieldKey || condition.fieldKey.trim() === '') {
        return false;
    }
    
    const isBoolean = isBooleanProfile(profiles, condition.fieldKey);
    
    if (isBoolean) {
        return condition.level !== undefined &&
               getBooleanAvailableLevels().includes(condition.level) &&
               condition.booleanValue !== undefined && 
               condition.booleanValue !== null;
    }
    
    if (condition.conditionType === 'SINGLE') {
        return condition.thresholdValue !== undefined &&
            condition.thresholdValue !== null &&
            !isNaN(Number(condition.thresholdValue));
    }
    
    if (condition.conditionType === 'RANGE') {
        const hasValidLeft = condition.leftValue !== undefined && 
                             condition.leftValue !== null && 
                             !isNaN(Number(condition.leftValue));
        const hasValidRight = condition.rightValue !== undefined && 
                              condition.rightValue !== null && 
                              !isNaN(Number(condition.rightValue));
        
        if (!hasValidLeft || !hasValidRight) return false;
        
        return Number(condition.leftValue) < Number(condition.rightValue);
    }
    
    return true;
};

export const getConditionConfigByProfile = (profiles: DeviceProfile[], fieldKey: string) => {
    const isBoolean = isBooleanProfile(profiles, fieldKey);
    
    if (isBoolean) {
        return {
            conditionType: 'SINGLE' as const,
            operator: 'GE' as const,
            thresholdValue: undefined,
            leftValue: undefined,
            rightValue: undefined,
            booleanValue: true,
            level: 'NORMAL' as const
        };
    }
    
    return {
        conditionType: 'SINGLE' as const,
        operator: 'GE' as const,
        thresholdValue: 1.0,
        leftValue: undefined,
        rightValue: undefined,
        booleanValue: false,
        level: 'NORMAL' as const
    };
};