// External packages
import { useState, useEffect, useMemo } from 'react'

// @plug-atlas packages
import { toast } from '@plug-atlas/ui'

// Internal imports
import { EventCondition, DeviceProfile } from '@/services/types'
import {
    createDefaultCondition,
    isBooleanProfile,
    getConditionConfigByProfile,
    formatConditionSummary
} from '@/pages/management/devices/sensor/handlers/EventConditionUtils'
import { useEventConditionMutations, useEventConditions } from '@/services/hooks'

export const useEventConditionManager = (objectId: string, profiles: DeviceProfile[]) => {
    const [editingData, setEditingData] = useState<EventCondition[]>([]);
    const [originalData, setOriginalData] = useState<EventCondition[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const { data: conditions, isLoading, error, mutate: refetch } = useEventConditions(objectId);
    const { updateEventConditions, deleteEventCondition } = useEventConditionMutations();

    const getLevelPriority = (level: string): number => {
        const levelOrder = {
            'NORMAL': 1,
            'CAUTION': 2,
            'WARNING': 3,
            'DANGER': 4,
            'DISCONNECTED': 5
        };
        return levelOrder[level as keyof typeof levelOrder] || 999;
    };

    const sortConditions = (conditions: EventCondition[]): EventCondition[] => {
        // 원본을 수정하지 않도록 복사본을 만들어서 정렬
        return [...conditions].sort((a, b) => {
            // 1. Field Key로 정렬 (알파벳순)
            const fieldKeyCompare = (a.fieldKey || '').localeCompare(b.fieldKey || '');
            if (fieldKeyCompare !== 0) {
                return fieldKeyCompare;
            }

            // 2. 조건 값으로 정렬 (leftValue 우선, 없으면 thresholdValue)
            // 값이 작은 것부터 큰 것 순서로 정렬 (예: 온도 -10 → 0 → 40 → 50)
            const aValue = a.leftValue ?? a.thresholdValue ?? Number.MAX_SAFE_INTEGER;
            const bValue = b.leftValue ?? b.thresholdValue ?? Number.MAX_SAFE_INTEGER;
            const valueCompare = aValue - bValue;
            if (valueCompare !== 0) {
                return valueCompare;
            }

            // 3. 같은 값일 경우 레벨로 정렬 (NORMAL > CAUTION > WARNING > DANGER)
            return getLevelPriority(a.level) - getLevelPriority(b.level);
        });
    };

    // Validation: 같은 Field Key + 같은 Level에서 범위 겹침 또는 완전 중복 체크
    const validateConditions = (conditions: EventCondition[]): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // 필수 필드 체크
        conditions.forEach((condition) => {
            if (!condition.fieldKey) {
                errors.push('Field Key를 선택해주세요');
            }
        });

        // Field Key별로 그룹화
        const groupByFieldKey = new Map<string, EventCondition[]>();
        conditions.forEach((condition) => {
            if (!condition.fieldKey) return;

            if (!groupByFieldKey.has(condition.fieldKey)) {
                groupByFieldKey.set(condition.fieldKey, []);
            }
            groupByFieldKey.get(condition.fieldKey)!.push(condition);
        });

        // 헬퍼 함수: 범위 겹침 체크
        const checkRangeOverlap = (
            left1: number | undefined, right1: number | undefined,
            left2: number | undefined, right2: number | undefined
        ): boolean => {
            if (left1 === undefined || right1 === undefined || left2 === undefined || right2 === undefined) {
                return false;
            }
            // 범위가 겹치는지 체크: !(right1 < left2 || right2 < left1)
            return !(right1 < left2 || right2 < left1);
        };

        // 헬퍼 함수: 완전히 동일한 조건인지 체크
        const isIdenticalCondition = (cond1: EventCondition, cond2: EventCondition): boolean => {
            // 레벨이 다르면 동일하지 않음
            if (cond1.level !== cond2.level) return false;

            // Boolean 타입
            const isCond1Boolean = cond1.booleanValue !== undefined && cond1.booleanValue !== null;
            const isCond2Boolean = cond2.booleanValue !== undefined && cond2.booleanValue !== null;

            if (isCond1Boolean && isCond2Boolean) {
                return cond1.booleanValue === cond2.booleanValue;
            }

            // 단일 조건
            if (cond1.conditionType === 'SINGLE' && cond2.conditionType === 'SINGLE') {
                return cond1.operator === cond2.operator && cond1.thresholdValue === cond2.thresholdValue;
            }

            // 범위 조건
            if (cond1.conditionType === 'RANGE' && cond2.conditionType === 'RANGE') {
                return cond1.leftValue === cond2.leftValue && cond1.rightValue === cond2.rightValue;
            }

            return false;
        };

        // 각 Field Key 그룹 내에서 검사
        groupByFieldKey.forEach((items, fieldKey) => {
            const profile = profiles.find(p => p.fieldKey === fieldKey);
            const fieldName = profile?.description || fieldKey;

            // 같은 레벨끼리 그룹화
            const groupByLevel = new Map<string, EventCondition[]>();
            items.forEach(item => {
                if (!groupByLevel.has(item.level)) {
                    groupByLevel.set(item.level, []);
                }
                groupByLevel.get(item.level)!.push(item);
            });

            // 각 레벨 그룹 내에서 검사
            groupByLevel.forEach((levelItems, level) => {
                const levelNames: Record<string, string> = {
                    'NORMAL': '정상',
                    'CAUTION': '주의',
                    'WARNING': '경고',
                    'DANGER': '위험',
                    'DISCONNECTED': '연결끊김'
                };
                const levelName = levelNames[level] || level;

                for (let i = 0; i < levelItems.length; i++) {
                    for (let j = i + 1; j < levelItems.length; j++) {
                        const item1 = levelItems[i];
                        const item2 = levelItems[j];

                        if (!item1 || !item2) continue;

                        // 1. 완전히 동일한 조건 체크
                        if (isIdenticalCondition(item1, item2)) {
                            errors.push(`${fieldName}: ${levelName} 레벨에 동일한 조건이 중복되어 있습니다.`);
                            continue;
                        }

                        // 2. 범위 조건 겹침 체크 (같은 레벨에서만)
                        if (item1.conditionType === 'RANGE' && item2.conditionType === 'RANGE') {
                            if (checkRangeOverlap(item1.leftValue, item1.rightValue, item2.leftValue, item2.rightValue)) {
                                errors.push(`${fieldName}: ${levelName} 레벨에서 범위 조건이 겹칩니다 (${item1.leftValue}~${item1.rightValue}와 ${item2.leftValue}~${item2.rightValue}).`);
                            }
                        }
                    }
                }
            });
        });

        return {
            isValid: errors.length === 0,
            errors: Array.from(new Set(errors))
        };
    };

    // conditions가 변경될 때만 데이터를 업데이트 (SWR의 data 변경 시)
    useEffect(() => {
        if (!conditions) {
            setOriginalData([]);
            setEditingData([]);
            setValidationErrors([]);
            return;
        }

        const sortedConditions = sortConditions(conditions);
        const deepCopyConditions = sortedConditions.map(condition => ({ ...condition }));
        setOriginalData(sortedConditions);
        setEditingData(deepCopyConditions);
        setValidationErrors([]);
    }, [conditions]);

    // hasUnsavedChanges를 useMemo로 계산 (최적화: 빠른 종료)
    const hasUnsavedChanges = useMemo(() => {
        // 1. 길이가 다르면 즉시 true 반환
        if (editingData.length !== originalData.length) return true;

        // 2. 길이가 0이면 false (변경사항 없음)
        if (editingData.length === 0) return false;

        // 3. ID로 빠른 맵 생성 (O(n) → O(1) 조회)
        const originalMap = new Map(
            originalData.map(item => [item.id || `temp-${originalData.indexOf(item)}`, item])
        );

        // 4. 변경된 항목만 체크
        for (const current of editingData) {
            const id = current.id || `temp-${editingData.indexOf(current)}`;
            const original = originalMap.get(id);

            // 새로운 항목이면 변경사항 있음
            if (!original) return true;

            // 중요 필드만 빠르게 비교
            if (
                current.fieldKey !== original.fieldKey ||
                current.level !== original.level ||
                current.conditionType !== original.conditionType ||
                current.operator !== original.operator ||
                current.thresholdValue !== original.thresholdValue ||
                current.leftValue !== original.leftValue ||
                current.rightValue !== original.rightValue ||
                current.booleanValue !== original.booleanValue ||
                current.activate !== original.activate ||
                current.notificationEnabled !== original.notificationEnabled
            ) {
                return true; // 변경 발견 시 즉시 반환
            }
        }

        return false;
    }, [editingData, originalData]);

    const handleEditDataChange = (index: number, field: keyof EventCondition, value: any) => {
        setEditingData(prev => {
            const updated = [...prev];
            if (!updated[index]) return prev;

            let updatedCondition = { ...updated[index], [field]: value };

            if (field === 'fieldKey') {
                const conditionConfig = getConditionConfigByProfile(profiles, value);
                updatedCondition = { ...updatedCondition, ...conditionConfig };
            }

            if (field === 'conditionType') {
                const isBoolean = isBooleanProfile(profiles, updatedCondition?.fieldKey || '');

                if (isBoolean) {
                    updatedCondition.conditionType = 'SINGLE';
                    updatedCondition.operator = 'GE';
                } else {
                    if (value === 'SINGLE') {
                        updatedCondition.operator = 'GE';
                        updatedCondition.leftValue = undefined;
                        updatedCondition.rightValue = undefined;
                    } else if (value === 'RANGE') {
                        updatedCondition.operator = 'BETWEEN';
                        updatedCondition.thresholdValue = undefined;
                    }
                }
            }

            updated[index] = updatedCondition;

            return updated;
        });
    };

    const handleAddNew = () => {
        const newCondition: EventCondition = {
            ...createDefaultCondition(objectId),
            id: undefined
        };

        setEditingData(prev => [newCondition, ...prev]);
    };

    const handleRemoveCondition = (index: number) => {
        setEditingData(prev => prev.filter((_, i) => i !== index));
    };

    const handleDelete = async (conditionId: number) => {
        try {
            await deleteEventCondition(conditionId, objectId);
            toast.success("삭제 완료", {
                description: "이벤트 조건이 삭제되었습니다.",
            });
        } catch (error) {
            console.error('조건 삭제 실패:', error);
            toast.error("삭제 실패", {
                description: "이벤트 조건 삭제 중 오류가 발생했습니다.",
            });
        }
    };

    const handleSaveAll = async () => {
        try {
            // Validation 체크
            const validation = validateConditions(editingData);
            if (!validation.isValid) {
                setValidationErrors(validation.errors);
                return;
            }

            // 저장 전에 정렬
            const sortedData = sortConditions(editingData);

            // 서버에 저장
            await updateEventConditions({
                conditions: sortedData,
                objectId
            });

            setValidationErrors([]);
            toast.success("저장 완료", {
                description: "모든 이벤트 조건이 저장되었습니다.",
            });
        } catch (error) {
            console.error('조건 저장 실패:', error);
            toast.error("저장 실패", {
                description: "이벤트 조건 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
            });
        }
    };

    const handleCancelAll = () => {
        const deepCopyOriginal = originalData.map(condition => ({ ...condition }));
        setEditingData(deepCopyOriginal);
        setValidationErrors([]);
    };

    const getConditionSummary = (condition: EventCondition) => {
        return formatConditionSummary(condition, profiles);
    };

    return {
        conditionsData: editingData,
        isLoading,
        error,
        hasUnsavedChanges,
        validationErrors,
        handleEditDataChange,
        handleAddNew,
        handleRemoveCondition,
        handleDelete,
        handleSaveAll,
        handleCancelAll,
        getConditionSummary,
        refetch
    };
};