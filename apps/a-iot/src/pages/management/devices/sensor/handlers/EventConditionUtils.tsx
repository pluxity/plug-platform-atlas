import React from 'react';
import { z } from 'zod';
import { DeviceProfile, EventCondition } from "../../../../../services/types";
import { EventConditionOperator, EventLevel } from "../../../../../services/types/eventCondition.ts";

export interface Column<T> {
    key: keyof T;
    header: string;
    cell: (value: any, row: T, index?: number) => React.ReactNode;
}

// Zod 스키마 정의
const eventConditionBaseSchema = z.object({
    objectId: z.string().min(1, { message: "객체 ID가 필요합니다" }),
    fieldKey: z.string().min(1, { message: "Field Key를 선택해주세요" }),
    level: z.enum(['NORMAL', 'WARNING', 'CAUTION', 'DANGER', 'DISCONNECTED'], {
        message: "레벨을 선택해주세요"
    }),
    conditionType: z.enum(['SINGLE', 'RANGE'], {
        message: "조건 타입을 선택해주세요"
    }),
    operator: z.enum(['GE', 'LE', 'BETWEEN'], {
        message: "연산자를 선택해주세요"
    }),
    notificationEnabled: z.boolean(),
    activate: z.boolean(),
    guideMessage: z.string().optional(),
});

// Boolean 타입 조건 스키마
const booleanConditionSchema = eventConditionBaseSchema.extend({
    booleanValue: z.boolean({ message: "Boolean 값을 선택해주세요" }),
    thresholdValue: z.number().optional(),
    leftValue: z.undefined(),
    rightValue: z.undefined(),
});

// SINGLE 조건 스키마
const singleConditionSchema = eventConditionBaseSchema.extend({
    conditionType: z.literal('SINGLE'),
    thresholdValue: z.number({ message: "기준값을 입력해주세요" }),
    booleanValue: z.undefined(),
    leftValue: z.undefined(),
    rightValue: z.undefined(),
});

const rangeConditionSchema = eventConditionBaseSchema.extend({
    conditionType: z.literal('RANGE'),
    leftValue: z.number({ message: "최소값을 입력해주세요" }),
    rightValue: z.number({ message: "최대값을 입력해주세요" }),
    booleanValue: z.undefined(),
    thresholdValue: z.undefined(),
}).refine((data) => data.leftValue < data.rightValue, {
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
    thresholdValue: 1.0,
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

    // Boolean 타입인지 확인
    const isBoolean = isBooleanProfile(profiles, condition.fieldKey);

    // 적절한 스키마 선택 및 validation
    let validationResult;

    if (isBoolean) {
        validationResult = booleanConditionSchema.safeParse(condition);
    } else if (condition.conditionType === 'RANGE') {
        validationResult = rangeConditionSchema.safeParse(condition);
    } else {
        validationResult = singleConditionSchema.safeParse(condition);
    }

    // Zod validation 오류 처리
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

    // 중복 조건 검증
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

                const duplicateError = `${fieldName}의 ${levelName} 레벨에 동일한 조건이 이미 존재합니다`;
                errors.push(duplicateError);

                if (!fieldErrors['fieldKey']) {
                    fieldErrors['fieldKey'] = [];
                }
                fieldErrors['fieldKey'].push(duplicateError);
                break;
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        fieldErrors
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

export const getAvailableLevelsByProfile = (profiles: DeviceProfile[], fieldKey: string): EventLevel[] => {
    const isBoolean = isBooleanProfile(profiles, fieldKey);
    
    if (isBoolean) {
        return ['NORMAL', 'DANGER'];
    }
    
    return ['NORMAL', 'CAUTION', 'WARNING', 'DANGER'];
};

export const getBooleanValueLabel = (value: boolean): string => {
    return value ? 'ON (True)' : 'OFF (False)';
};

export const getProfileByFieldKey = (profiles: DeviceProfile[], fieldKey: string): DeviceProfile | undefined => {
    return profiles.find(p => p.fieldKey === fieldKey);
};