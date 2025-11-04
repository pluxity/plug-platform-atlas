import { useState, useEffect } from 'react';
import { EventCondition, DeviceProfile } from '../../../../services/types';
import {
    createDefaultCondition,
    validateConditionData,
    isBooleanProfile,
    getConditionConfigByProfile,
    formatConditionSummary
} from "./EventConditionUtils";
import { useEventConditionMutations, useEventConditions } from "../../../../services/hooks";

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
        return [...conditions].sort((a, b) => {
            const fieldKeyCompare = (a.fieldKey || '').localeCompare(b.fieldKey || '');
            if (fieldKeyCompare !== 0) {
                return fieldKeyCompare;
            }
            
            return getLevelPriority(a.level) - getLevelPriority(b.level);
        });
    };

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
            
            if (field === 'fieldKey' || field === 'level') {
                const sortedUpdated = sortConditions(updated);
                setHasUnsavedChanges(checkForChanges(sortedUpdated));
                return sortedUpdated;
            }
            
            const hasChanges = checkForChanges(updated);
            setHasUnsavedChanges(hasChanges);
            
            return updated;
        });
    };

    const handleAddNew = () => {
        const newCondition: EventCondition = {
            ...createDefaultCondition(objectId),
            id: undefined
        };
        
        setEditingData(prev => {
            const updated = [...prev, newCondition];
            const sortedUpdated = sortConditions(updated);
            setHasUnsavedChanges(checkForChanges(sortedUpdated));
            return sortedUpdated;
        });
    };

    const handleRemoveCondition = (index: number) => {
        setEditingData(prev => {
            const updated = prev.filter((_, i) => i !== index);
            setHasUnsavedChanges(checkForChanges(updated));
            return updated;
        });
    };

    const handleDelete = async (conditionId: number) => {
        try {
            await deleteEventCondition(conditionId);
            await refetch();
        } catch (error) {
            console.error('조건 삭제 실패:', error);
        }
    };

    const handleSaveAll = async () => {
        try {
            for (const condition of editingData) {
                const validation = validateConditionData(condition, profiles, editingData);
                if (!validation.isValid) {
                    alert(`조건 유효성 검사 실패:\n${validation.errors.join('\n')}`);
                    return;
                }
            }

            await updateEventConditions({
                conditions: editingData,
                objectId
            });

            setHasUnsavedChanges(false);
            await refetch();
        } catch (error) {
            console.error('조건 저장 실패:', error);
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