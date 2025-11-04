import React from 'react';
import { DeviceProfile, EventCondition } from "../../../../services/types";
import { EventConditionOperator, EventLevel } from "../../../../services/types/eventCondition.ts";

export interface Column<T> {
    key: keyof T;
    header: string;
    cell: (value: any, row: T, index?: number) => React.ReactNode;
}

export const createDefaultCondition = (objectId: string): EventCondition => ({
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

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export const validateConditionData = (condition: EventCondition, profiles: DeviceProfile[], allConditions?: EventCondition[]): ValidationResult => {
    const errors: string[] = [];

    if (!condition.fieldKey) {
        errors.push('Field Key를 선택해주세요');
    }
    if (!condition.level) {
        errors.push('레벨을 선택해주세요');
    }
    if (!condition.conditionType) {
        errors.push('조건 타입을 선택해주세요');
    }
    if (!condition.operator) {
        errors.push('연산자를 선택해주세요');
    }

    const isBoolean = isBooleanProfile(profiles, condition.fieldKey);
    
    if (isBoolean) {
        if (condition.booleanValue === undefined) {
            errors.push('Boolean 값을 선택해주세요');
        }
    } else {
        if (condition.conditionType === 'SINGLE') {
            if (condition.thresholdValue === undefined || condition.thresholdValue === null) {
                errors.push('기준값을 입력해주세요');
            }
        } else if (condition.conditionType === 'RANGE') {
            if (condition.leftValue === undefined || condition.leftValue === null) {
                errors.push('최소값을 입력해주세요');
            }
            if (condition.rightValue === undefined || condition.rightValue === null) {
                errors.push('최대값을 입력해주세요');
            }
            
            if (condition.leftValue !== undefined && condition.rightValue !== undefined) {
                if (condition.leftValue >= condition.rightValue) {
                    errors.push('최소값은 최대값보다 작아야 합니다');
                }
            }
        }
    }

    if (allConditions && condition.fieldKey && condition.level) {
        const duplicates = allConditions.filter(other => 
            other !== condition &&
            other.fieldKey === condition.fieldKey &&
            other.level === condition.level
        );

        for (const duplicate of duplicates) {
            if (isDuplicateCondition(condition, duplicate)) {
                const profile = profiles.find(p => p.fieldKey === condition.fieldKey);
                const fieldName = profile?.description || condition.fieldKey;
                const levelName = getLevelDisplayName(condition.level);
                
                errors.push(`${fieldName}의 ${levelName} 레벨에 동일한 조건이 이미 존재합니다`);
                break;
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const isDuplicateCondition = (condition1: EventCondition, condition2: EventCondition): boolean => {
    if (condition1.fieldKey !== condition2.fieldKey || condition1.level !== condition2.level) {
        return false;
    }

    if (condition1.conditionType !== condition2.conditionType) {
        return false;
    }

    if (condition1.booleanValue !== undefined && condition2.booleanValue !== undefined) {
        return condition1.booleanValue === condition2.booleanValue;
    }

    if (condition1.conditionType === 'SINGLE') {
        return condition1.operator === condition2.operator &&
               condition1.thresholdValue === condition2.thresholdValue;
    }

    if (condition1.conditionType === 'RANGE') {
        return condition1.leftValue === condition2.leftValue &&
               condition1.rightValue === condition2.rightValue;
    }

    return false;
};

const getLevelDisplayName = (level: EventLevel): string => {
    const levelMap: Record<EventLevel, string> = {
        'NORMAL': '정상',
        'WARNING': '경고',
        'CAUTION': '주의',
        'DANGER': '위험',
        'DISCONNECTED': '연결끊김'
    };
    return levelMap[level] || level;
};

export const isBooleanProfile = (profiles: DeviceProfile[], fieldKey: string): boolean => {
    const profile = profiles.find(p => p.fieldKey === fieldKey);
    return profile?.fieldType === 'Boolean';
};

export const getConditionConfigByProfile = (profiles: DeviceProfile[], fieldKey: string): Partial<EventCondition> => {
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

export const formatConditionSummary = (condition: EventCondition | undefined, profiles: DeviceProfile[]): string => {
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