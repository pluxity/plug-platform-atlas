// External packages
import React from 'react'
import { z } from 'zod'

// Internal imports
import { DeviceProfile, EventCondition, EventConditionOperator, EventLevel } from '@/services/types'

export interface Column<T> {
    key: keyof T;
    header: string;
    cell: (value: any, row: T, index?: number) => React.ReactNode;
}

const booleanConditionSchema = z.object({
    objectId: z.string().min(1),
    fieldKey: z.string().min(1),
    level: z.enum(['NORMAL', 'WARNING', 'CAUTION', 'DANGER', 'DISCONNECTED']),
    conditionType: z.literal('SINGLE'),
    operator: z.literal('GE'),
    booleanValue: z.boolean({ message: "Boolean 값을 선택해주세요" }),
    thresholdValue: z.number().nullish(),
    leftValue: z.number().nullish(),
    rightValue: z.number().nullish(),
    notificationEnabled: z.boolean(),
    activate: z.boolean(),
    guideMessage: z.string().optional(),
}).passthrough();

const singleConditionSchema = z.object({
    objectId: z.string().min(1),
    fieldKey: z.string().min(1),
    level: z.enum(['NORMAL', 'WARNING', 'CAUTION', 'DANGER', 'DISCONNECTED']),
    conditionType: z.literal('SINGLE'),
    operator: z.enum(['GE', 'LE'], { message: "연산자를 선택해주세요" }),
    thresholdValue: z.number({ message: "기준값을 입력해주세요" }),
    booleanValue: z.boolean().nullish(),
    leftValue: z.number().nullish(),
    rightValue: z.number().nullish(),
    notificationEnabled: z.boolean(),
    activate: z.boolean(),
    guideMessage: z.string().optional(),
}).passthrough();

const rangeConditionSchema = z.object({
    objectId: z.string().min(1),
    fieldKey: z.string().min(1),
    level: z.enum(['NORMAL', 'WARNING', 'CAUTION', 'DANGER', 'DISCONNECTED']),
    conditionType: z.literal('RANGE'),
    operator: z.literal('BETWEEN'),
    leftValue: z.number({ message: "최소값을 입력해주세요" }),
    rightValue: z.number({ message: "최대값을 입력해주세요" }),
    booleanValue: z.boolean().nullish(),
    thresholdValue: z.number().nullish(),
    notificationEnabled: z.boolean(),
    activate: z.boolean(),
    guideMessage: z.string().optional(),
}).passthrough().refine((data) => data.leftValue < data.rightValue, {
    message: "최소값은 최대값보다 작아야 합니다",
    path: ["leftValue"],
});

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    fieldErrors?: Record<string, string[]>;
}

export interface FieldValidationStatus {
    fieldKey: boolean;
    level: boolean;
    booleanValue: boolean;
    thresholdValue: boolean;
    leftValue: boolean;
    rightValue: boolean;
}

export const createDefaultCondition = (objectId: string): EventCondition => ({
    objectId,
    fieldKey: '',
    level: 'NORMAL',
    conditionType: 'SINGLE',
    operator: 'GE',
    thresholdValue: undefined,
    leftValue: undefined,
    rightValue: undefined,
    notificationEnabled: true,
    activate: true,
    booleanValue: undefined,
    guideMessage: ''
});

export const validateConditionData = (condition: EventCondition, profiles: DeviceProfile[], allConditions?: EventCondition[]): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    const addFieldError = (field: string, message: string) => {
        errors.push(message);
        if (!fieldErrors[field]) {
            fieldErrors[field] = [];
        }
        fieldErrors[field].push(message);
    };

    if (!condition.fieldKey || condition.fieldKey.trim() === '') {
        addFieldError('fieldKey', "Field Key를 선택해주세요");
        return {
            isValid: false,
            errors,
            fieldErrors
        };
    }

    const isBoolean = isBooleanProfile(profiles, condition.fieldKey);

    let validationResult;

    if (isBoolean) {
        validationResult = booleanConditionSchema.safeParse(condition);
    } else if (condition.conditionType === 'RANGE') {
        validationResult = rangeConditionSchema.safeParse(condition);
    } else {
        validationResult = singleConditionSchema.safeParse(condition);
    }

    if (!validationResult.success) {
        validationResult.error.issues.forEach((err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!fieldErrors[path]) {
                fieldErrors[path] = [];
            }
            fieldErrors[path].push(err.message);
            errors.push(err.message);
        });
    }

    const profile = profiles.find(p => p.fieldKey === condition.fieldKey);
    if (profile) {
        const fieldName = profile.description || profile.fieldKey;

        if (profile.fieldKey === 'Angle-X' || profile.fieldKey === 'Angle-Y') {
            if (condition.conditionType === 'SINGLE' && condition.thresholdValue !== undefined) {
                if (condition.thresholdValue < -90 || condition.thresholdValue > 90) {
                    const angleError = `${fieldName}의 값은 -90 ~ 90 사이여야 합니다`;
                    errors.push(angleError);
                    if (!fieldErrors['thresholdValue']) {
                        fieldErrors['thresholdValue'] = [];
                    }
                    fieldErrors['thresholdValue'].push(angleError);
                }
            } else if (condition.conditionType === 'RANGE') {
                if (condition.leftValue !== undefined && (condition.leftValue < -90 || condition.leftValue > 90)) {
                    const angleError = `${fieldName}의 최소값은 -90 ~ 90 사이여야 합니다`;
                    errors.push(angleError);
                    if (!fieldErrors['leftValue']) {
                        fieldErrors['leftValue'] = [];
                    }
                    fieldErrors['leftValue'].push(angleError);
                }
                if (condition.rightValue !== undefined && (condition.rightValue < -90 || condition.rightValue > 90)) {
                    const angleError = `${fieldName}의 최대값은 -90 ~ 90 사이여야 합니다`;
                    errors.push(angleError);
                    if (!fieldErrors['rightValue']) {
                        fieldErrors['rightValue'] = [];
                    }
                    fieldErrors['rightValue'].push(angleError);
                }
            }
        }

        if (condition.conditionType === 'RANGE' && profile.fieldKey === 'errorRange' && condition.leftValue !== undefined && condition.leftValue <= 0) {
            const customError = `${fieldName}의 최소값은 0보다 커야 합니다`;
            errors.push(customError);
            if (!fieldErrors['leftValue']) {
                fieldErrors['leftValue'] = [];
            }
            fieldErrors['leftValue'].push(customError);
        }
    }

    if (allConditions && condition.fieldKey) {
        const duplicates = allConditions.filter(other =>
            other !== condition &&
            other.fieldKey === condition.fieldKey
        );

        const isFireAlarm = profile?.fieldKey === 'Fire Alarm';

        for (const duplicate of duplicates) {
            if (isSameConditionValue(condition, duplicate)) {
                const fieldName = profile?.description || condition.fieldKey;
                const currentLevelName = getLevelDisplayName(condition.level);
                const duplicateLevelName = getLevelDisplayName(duplicate.level);

                let duplicateError: string;

                if (isFireAlarm && condition.level === duplicate.level) {
                    duplicateError = `${fieldName}의 ${currentLevelName} 레벨에 동일한 조건이 이미 존재합니다`;
                    errors.push(duplicateError);

                    if (!fieldErrors['fieldKey']) {
                        fieldErrors['fieldKey'] = [];
                    }
                    fieldErrors['fieldKey'].push(duplicateError);
                    break;
                } else if (!isFireAlarm && condition.level !== duplicate.level) {
                    duplicateError = `${fieldName}의 ${duplicateLevelName} 레벨에 동일한 조건값이 이미 존재합니다. 다른 조건값을 입력해주세요`;
                    errors.push(duplicateError);

                    if (!fieldErrors['fieldKey']) {
                        fieldErrors['fieldKey'] = [];
                    }
                    fieldErrors['fieldKey'].push(duplicateError);
                    break;
                }
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        fieldErrors
    };
};

const isSameConditionValue = (condition1: EventCondition, condition2: EventCondition): boolean => {
    if (condition1.fieldKey !== condition2.fieldKey) {
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

export const getRequiredFieldsStatus = (condition: EventCondition, profiles: DeviceProfile[]): FieldValidationStatus => {
    const validation = validateConditionData(condition, profiles);
    const fieldErrors = validation.fieldErrors || {};

    return {
        fieldKey: !!fieldErrors['fieldKey'],
        level: !!fieldErrors['level'],
        booleanValue: !!fieldErrors['booleanValue'],
        thresholdValue: !!fieldErrors['thresholdValue'],
        leftValue: !!fieldErrors['leftValue'],
        rightValue: !!fieldErrors['rightValue'],
    };
};

export const getConditionConfigByProfile = (profiles: DeviceProfile[], fieldKey: string): Partial<EventCondition> => {
    const profile = profiles.find(p => p.fieldKey === fieldKey);

    if (!profile) {
        return {};
    }

    if (profile.fieldType === 'Boolean') {
        return {
            level: 'DANGER',
            conditionType: 'SINGLE',
            operator: 'GE',
            booleanValue: true,
            thresholdValue: undefined,
            leftValue: undefined,
            rightValue: undefined
        };
    }

    return {
        level: 'NORMAL',
        conditionType: 'SINGLE',
        operator: 'GE',
        booleanValue: undefined,
        thresholdValue: undefined,
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

export const getAvailableLevelsByProfile = (profiles: DeviceProfile[], fieldKey: string): EventLevel[] => {
    const isBoolean = isBooleanProfile(profiles, fieldKey);
    
    if (isBoolean) {
        return ['NORMAL', 'DANGER'];
    }
    
    return ['NORMAL', 'CAUTION', 'WARNING', 'DANGER'];
};

export const getProfileByFieldKey = (profiles: DeviceProfile[], fieldKey: string): DeviceProfile | undefined => {
    return profiles.find(p => p.fieldKey === fieldKey);
};