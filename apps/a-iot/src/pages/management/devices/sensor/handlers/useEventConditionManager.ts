import { useState, useEffect, useMemo } from 'react';
import { EventCondition, DeviceProfile } from '../../../../../services/types';
import {
    createDefaultCondition,
    validateConditionData,
    isBooleanProfile,
    getConditionConfigByProfile,
    formatConditionSummary,
    ValidationResult
} from "./EventConditionUtils.tsx";
import { useEventConditionMutations, useEventConditions } from "../../../../../services/hooks";
import { toast } from "@plug-atlas/ui";

export const useEventConditionManager = (objectId: string, profiles: DeviceProfile[]) => {
    const [editingData, setEditingData] = useState<EventCondition[]>([]);
    const [originalData, setOriginalData] = useState<EventCondition[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const { data: conditions, isLoading, error, mutate: refetch } = useEventConditions(objectId);
    const { updateEventConditions, deleteEventCondition } = useEventConditionMutations();

    const conditionsData = conditions || [];

    const getLevelPriority = (level: string): number => {
        const levelOrder = {
            'DANGER': 1,
            'WARNING': 2,
            'CAUTION': 3,
            'NORMAL': 4,
            'DISCONNECTED': 5
        };
        return levelOrder[level as keyof typeof levelOrder] || 999;
    };

    const sortConditions = (conditions: EventCondition[]): EventCondition[] => {
        const newConditions = conditions.filter(c => !c.id);
        const existingConditions = conditions.filter(c => c.id);

        const sortedExisting = existingConditions.sort((a, b) => {
            const fieldKeyCompare = (a.fieldKey || '').localeCompare(b.fieldKey || '');
            if (fieldKeyCompare !== 0) {
                return fieldKeyCompare;
            }

            return getLevelPriority(a.level) - getLevelPriority(b.level);
        });

        return [...newConditions, ...sortedExisting];
    };

    const validationState = useMemo(() => {
        const allErrors: string[] = [];
        const conditionValidations = new Map<number, ValidationResult>();
        let hasErrors = false;

        editingData.forEach((condition, index) => {
            const validation = validateConditionData(condition, profiles, editingData);
            conditionValidations.set(index, validation);
            if (!validation.isValid) {
                hasErrors = true;
                allErrors.push(...validation.errors);
            }
        });

        const uniqueErrors = Array.from(new Set(allErrors));

        return {
            isValid: !hasErrors,
            errors: uniqueErrors,
            hasConditions: editingData.length > 0,
            conditionValidations
        };
    }, [editingData, profiles]);

    useEffect(() => {
        if (conditionsData.length > 0) {
            const sortedConditions = sortConditions(conditionsData);
            const deepCopyConditions = sortedConditions.map(condition => ({ ...condition }));
            setOriginalData(sortedConditions);
            setEditingData(deepCopyConditions);
        } else {
            setOriginalData([]);
            setEditingData([]);
        }
        setHasUnsavedChanges(false);
    }, [conditionsData]);

    useEffect(() => {
        const hasChanges = checkForChanges(editingData);
        setHasUnsavedChanges(hasChanges);
    }, [editingData, originalData]);

    const checkForChanges = (currentEditing: EventCondition[]) => {
        if (currentEditing.length !== originalData.length) return true;

        return currentEditing.some((current, index) => {
            const original = originalData[index];
            if (!original) return true;

            const fieldsToCompare: (keyof EventCondition)[] = [
                'fieldKey', 'level', 'conditionType', 'operator',
                'thresholdValue', 'leftValue', 'rightValue',
                'notificationEnabled', 'activate', 'booleanValue', 'guideMessage'
            ];

            return fieldsToCompare.some(field => {
                if (field === 'thresholdValue' || field === 'leftValue' || field === 'rightValue') {
                    const origVal = original[field] ?? undefined;
                    const currVal = current[field] ?? undefined;
                    return origVal !== currVal;
                }
                return original[field] !== current[field];
            });
        });
    };

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

            const isNewCondition = !updatedCondition.id;
            if (!isNewCondition && (field === 'fieldKey' || field === 'level')) {
                return sortConditions(updated);
            }

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
            await updateEventConditions({
                conditions: editingData,
                objectId
            });

            setHasUnsavedChanges(false);
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
        setHasUnsavedChanges(false);
    };

    const getConditionSummary = (condition: EventCondition) => {
        return formatConditionSummary(condition, profiles);
    };

    return {
        conditionsData: editingData,
        isLoading,
        error,
        hasUnsavedChanges,
        validationState,
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