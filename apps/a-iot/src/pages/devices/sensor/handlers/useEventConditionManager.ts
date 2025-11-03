import { useState, useEffect } from 'react';
import { EventCondition, DeviceProfile } from '../../../../services/types';
import {
    createDefaultCondition,
    toCreateConditionData,
    toApiConditionData,
    validateConditionData,
    isBooleanProfile,
    getConditionConfigByProfile,
    formatConditionSummary
} from "./EventConditionUtils.tsx";
import { useEventConditionMutations, useEventConditions } from "../../../../services/hooks";
import { CreateConditionData } from "../../../../services/types/eventCondition.ts";

export const useEventConditionManager = (objectId: string, profiles: DeviceProfile[]) => {
    const [editingData, setEditingData] = useState<{ [key: number]: EventCondition }>({});
    const [originalData, setOriginalData] = useState<{ [key: number]: EventCondition }>({});
    const [newConditions, setNewConditions] = useState<CreateConditionData[]>([]);
    const [isAddingMode, setIsAddingMode] = useState(false);

    const { data: conditions, isLoading, error, mutate: refetch } = useEventConditions(objectId);
    const { createEventConditions, updateEventConditions, deleteEventCondition } = useEventConditionMutations();

    const conditionsData = conditions || [];

    useEffect(() => {
        if (conditionsData.length > 0) {
            const originalDataMap = conditionsData.reduce((acc, condition, index) => {
                acc[index] = { ...condition };
                return acc;
            }, {} as { [key: number]: EventCondition });

            setOriginalData(originalDataMap);

            setEditingData(prev => {
                const newEditingData: { [key: number]: EventCondition } = {};

                Object.keys(prev).forEach(indexStr => {
                    const index = parseInt(indexStr);
                    const originalCondition = originalDataMap[index];

                    if (originalCondition && prev[index]?.id === originalCondition.id) {
                        newEditingData[index] = <EventCondition>prev[index];
                    }
                });

                return newEditingData;
            });
        } else {
            setOriginalData({});
            setEditingData({});
        }
    }, [conditionsData]);

    const hasChanges = (index: number): boolean => {
        const original = originalData[index];
        const current = editingData[index];

        if (!original || !current) return false;

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
    };

    const handleEditDataChange = (index: number, field: keyof EventCondition, value: any) => {

        setEditingData(prev => {
            const existingData = prev[index];

            if (!existingData) {
                const originalCondition = originalData[index] || conditionsData[index];
                if (!originalCondition) {
                    return prev;
                }

                return {
                    ...prev,
                    [index]: {
                        ...originalCondition,
                        [field]: value
                    }
                };
            }

            let updatedData = { ...existingData, [field]: value };

            if (field === 'fieldKey') {
                const conditionConfig = getConditionConfigByProfile(profiles, value);
                updatedData = { ...updatedData, ...conditionConfig };
            }

            if (field === 'conditionType') {
                const isBoolean = isBooleanProfile(profiles, updatedData.fieldKey);

                if (isBoolean) {
                    updatedData.conditionType = 'SINGLE';
                    updatedData.operator = 'GE';
                } else {
                    if (value === 'SINGLE') {
                        updatedData.operator = 'GE';
                        updatedData.leftValue = undefined;
                        updatedData.rightValue = undefined;
                    } else if (value === 'RANGE') {
                        updatedData.operator = 'BETWEEN';
                        updatedData.thresholdValue = undefined;
                    }
                }
            }

            return {
                ...prev,
                [index]: updatedData
            };
        });
    };

    const handleSaveRow = async (index: number) => {
        const updatedCondition = editingData[index];
        if (!updatedCondition?.id) return;

        const conditionToValidate = toCreateConditionData(updatedCondition);
        if (!validateConditionData(conditionToValidate, profiles)) {
            alert('필수 필드를 모두 입력해주세요.');
            return;
        }

        try {
            const updatedConditions = conditionsData.map(condition => {
                if (condition.id === updatedCondition.id) {
                    return updatedCondition;
                }
                return condition;
            });

            await updateEventConditions({
                objectId,
                conditions: updatedConditions
            });

            setEditingData(prev => {
                const newData = { ...prev };
                delete newData[index];
                return newData;
            });

            await refetch();
        } catch (error) {
            alert('이벤트 컨디션 수정에 실패했습니다.');
        }
    };

    const handleCancelRow = (index: number) => {
        setEditingData(prev => {
            const newData = { ...prev };
            delete newData[index];
            return newData;
        });
    };

    const handleAddNew = () => {
        if (!isAddingMode) {
            setIsAddingMode(true);
            setNewConditions([createDefaultCondition(objectId)]);
        } else {
            setNewConditions(prev => [...prev, createDefaultCondition(objectId)]);
        }
    };

    const handleSaveNew = async () => {
        const invalidConditions = newConditions.filter(condition => !validateConditionData(condition, profiles));
        if (invalidConditions.length > 0) {
            alert(`${invalidConditions.length}개의 조건에 필수 필드가 누락되었습니다.`);
            return;
        }

        try {
            const apiConditions = newConditions.map(condition => toApiConditionData(condition, profiles));

            await createEventConditions({
                objectId: objectId,
                conditions: apiConditions
            });

            setIsAddingMode(false);
            setNewConditions([]);
            await refetch();
        } catch (error) {
            alert('이벤트 컨디션 생성에 실패했습니다.');
        }
    };

    const handleCancelNew = () => {
        setIsAddingMode(false);
        setNewConditions([]);
    };

    const handleNewConditionChange = (index: number, field: keyof CreateConditionData, value: any) => {

        setNewConditions(prev => {
            const updated = prev.map((condition, i) => {
                if (i === index) {
                    let updatedCondition = { ...condition, [field]: value };

                    if (field === 'fieldKey') {
                        const conditionConfig = getConditionConfigByProfile(profiles, value);
                        updatedCondition = { ...updatedCondition, ...conditionConfig };

                    }

                    if (field === 'conditionType') {
                        const isBoolean = isBooleanProfile(profiles, updatedCondition.fieldKey);

                        if (!isBoolean) {
                            if (value === 'SINGLE') {
                                updatedCondition.operator = 'GE';
                                updatedCondition.leftValue = undefined;
                                updatedCondition.rightValue = undefined;
                                if (updatedCondition.thresholdValue === undefined) {
                                    updatedCondition.thresholdValue = 1.0;
                                }
                            } else if (value === 'RANGE') {
                                updatedCondition.operator = 'BETWEEN';
                                updatedCondition.thresholdValue = undefined;
                                if (updatedCondition.leftValue === undefined) {
                                    updatedCondition.leftValue = 1.0;
                                }
                                if (updatedCondition.rightValue === undefined) {
                                    updatedCondition.rightValue = 2.0;
                                }
                            }
                        }
                    }

                    return updatedCondition;
                }
                return condition;
            });

            return updated;
        });
    };

    const handleRemoveNewCondition = (index: number) => {
        setNewConditions(prev => {
            const updated = prev.filter((_, i) => i !== index);
            if (updated.length === 0) {
                setIsAddingMode(false);
            }
            return updated;
        });
    };

    const handleDelete = async (conditionId: number) => {
        if (window.confirm('이 컨디션을 삭제하시겠습니까?')) {
            try {
                await deleteEventCondition(conditionId, objectId);
                await refetch();
            } catch (error) {
                alert('이벤트 컨디션 삭제에 실패했습니다.');
            }
        }
    };

    const getConditionSummary = (condition: CreateConditionData | EventCondition | undefined): string => {
        return formatConditionSummary(condition, profiles);
    };

    return {
        conditionsData,
        isLoading,
        error,
        editingData,
        newConditions,
        isAddingMode,
        hasChanges,
        handleEditDataChange,
        handleSaveRow,
        handleCancelRow,
        handleAddNew,
        handleSaveNew,
        handleCancelNew,
        handleNewConditionChange,
        handleRemoveNewCondition,
        handleDelete,
        getConditionSummary,
        refetch
    };
};