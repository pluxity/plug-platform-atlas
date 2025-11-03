import React from 'react';
import { DeviceProfile, EventCondition } from "../../../../services/types";
import { EventConditionOperator, EventLevel, CreateConditionData } from "../../../../services/types/eventCondition.ts";

export interface Column<T> {
    key: keyof T;
    header: string;
    cell: (value: any, row: T, index?: number) => React.ReactNode;
}

export const createDefaultCondition = (objectId: string): CreateConditionData => ({
    objectId,
    fieldKey: '',
    level: 'NORMAL',
    conditionType: 'SINGLE',
    operator: 'GE',
    thresholdValue: 1.0,
    leftValue: undefined,
    rightValue: undefined,
    notificationEnabled: true,
    activate: true,
    booleanValue: undefined,
    guideMessage: ''
});

export const toCreateConditionData = (condition: EventCondition): CreateConditionData => ({
    objectId: condition.objectId,
    fieldKey: condition.fieldKey,
    level: condition.level,
    conditionType: condition.conditionType || 'SINGLE',
    operator: condition.operator || 'GE',
    thresholdValue: condition.thresholdValue,
    leftValue: condition.leftValue,
    rightValue: condition.rightValue,
    notificationEnabled: condition.notificationEnabled,
    activate: condition.activate,
    booleanValue: condition.booleanValue,
    guideMessage: condition.guideMessage || ''
});

export const toApiConditionData = (condition: CreateConditionData, profiles: DeviceProfile[]) => {
    const isBoolean = isBooleanProfile(profiles, condition.fieldKey);
    
    const baseData = {
        objectId: condition.objectId,
        fieldKey: condition.fieldKey,
        level: condition.level,
        conditionType: condition.conditionType,
        operator: condition.operator,
        notificationEnabled: condition.notificationEnabled,
        activate: condition.activate,
        guideMessage: condition.guideMessage || undefined
    };

    if (isBoolean) {
        return {
            ...baseData,
            booleanValue: condition.booleanValue !== undefined ? condition.booleanValue : true
        };
    } else {
        return {
            ...baseData,
            ...(condition.conditionType === 'SINGLE' 
                ? { thresholdValue: condition.thresholdValue }
                : { leftValue: condition.leftValue, rightValue: condition.rightValue }
            )
        };
    }
};

export const validateConditionData = (condition: CreateConditionData, profiles: DeviceProfile[]): boolean => {
    if (!condition.fieldKey || !condition.level || !condition.conditionType || !condition.operator) {
        return false;
    }

    const isBoolean = isBooleanProfile(profiles, condition.fieldKey);
    
    if (isBoolean) {
        return condition.booleanValue !== undefined;
    }

    if (condition.conditionType === 'SINGLE') {
        return condition.thresholdValue !== undefined && condition.thresholdValue !== null;
    } else if (condition.conditionType === 'RANGE') {
        return condition.leftValue !== undefined && condition.leftValue !== null &&
               condition.rightValue !== undefined && condition.rightValue !== null;
    }

    return false;
};

export const isBooleanProfile = (profiles: DeviceProfile[], fieldKey: string): boolean => {
    const profile = profiles.find(p => p.fieldKey === fieldKey);
    return profile?.fieldType === 'Boolean';
};

export const getConditionConfigByProfile = (profiles: DeviceProfile[], fieldKey: string): Partial<CreateConditionData> => {
    const profile = profiles.find(p => p.fieldKey === fieldKey);
    
    if (!profile) {
        return {};
    }
    
    if (profile.fieldType === 'Boolean') {
        return {
            conditionType: 'SINGLE',
            operator: 'GE',
            booleanValue: true,
            thresholdValue: undefined,
            leftValue: undefined,
            rightValue: undefined
        };
    }
    
    return {
        conditionType: 'SINGLE',
        operator: 'GE',
        booleanValue: undefined,
        thresholdValue: 1.0,
        leftValue: undefined,
        rightValue: undefined
    };
};

export const formatConditionSummary = (condition: CreateConditionData | EventCondition | undefined, profiles: DeviceProfile[]): string => {
    if (!condition?.fieldKey) return '';
    
    const profile = profiles.find(p => p.fieldKey === condition.fieldKey);
    const fieldName = profile?.description || condition.fieldKey;
    const unit = profile?.fieldUnit ? ` ${profile.fieldUnit}` : '';

    const levelMap: Record<EventLevel, string> = {
        'NORMAL': '일반',
        'WARNING': '경고',
        'CAUTION': '주의',
        'DANGER': '위험',
        'DISCONNECTED': '연결끊김'
    };
    
    const level = levelMap[condition.level] || '알 수 없음';
    const isBoolean = isBooleanProfile(profiles, condition.fieldKey);
    
    if (isBoolean) {
        const value = condition.booleanValue ? 'ON' : 'OFF';
        return `${fieldName}이 ${value} 상태일 때 ${level} 알림`;
    }
    
    if (condition.conditionType === 'SINGLE' && condition.thresholdValue !== undefined) {
        const operatorText = getOperatorLabel(condition.operator || 'GE');
        return `${fieldName}이 ${condition.thresholdValue}${unit} ${operatorText}일 때 ${level} 알림`;
    } else if (condition.conditionType === 'RANGE' && condition.leftValue !== undefined && condition.rightValue !== undefined) {
        return `${fieldName}이 ${condition.leftValue}${unit} ~ ${condition.rightValue}${unit} 범위일 때 ${level} 알림`;
    }
    
    return `${fieldName} 조건 설정 미완료`;
};

export const getOperatorLabel = (operator: EventConditionOperator): string => {
    switch (operator) {
        case 'GE': return '이상';
        case 'LE': return '이하';
        case 'BETWEEN': return '범위';
        default: return operator;
    }
};

export const getLevelBadge = (level: EventLevel): React.ReactNode => {
    const levelConfig: Record<EventLevel, { label: string; className: string }> = {
        NORMAL: { label: '일반', className: 'bg-green-100 text-green-800' },
        WARNING: { label: '경고', className: 'bg-yellow-100 text-yellow-800' },
        CAUTION: { label: '주의', className: 'bg-orange-100 text-orange-800' },
        DANGER: { label: '위험', className: 'bg-red-100 text-red-800' },
        DISCONNECTED: { label: '연결끊김', className: 'bg-gray-100 text-gray-800' }
    };

    const config = levelConfig[level] || levelConfig.NORMAL;
    
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.className}`}>
            {config?.label}
        </span>
    );
};

export const getAvailableLevelsByProfile = (profiles: DeviceProfile[], fieldKey: string): EventLevel[] => {
    const isBoolean = isBooleanProfile(profiles, fieldKey);
    
    if (isBoolean) {
        return ['NORMAL', 'DANGER'];
    }
    
    return ['NORMAL', 'WARNING', 'CAUTION', 'DANGER'];
};

export const getBooleanValueLabel = (value: boolean): string => {
    return value ? 'ON (True)' : 'OFF (False)';
};

export const getProfileByFieldKey = (profiles: DeviceProfile[], fieldKey: string): DeviceProfile | undefined => {
    return profiles.find(p => p.fieldKey === fieldKey);
};