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
} from "./EventConditionUtils";
import { useEventConditionMutations, useEventConditions } from "../../../../services/hooks";
import { CreateConditionData } from "../../../../services/types/eventCondition";

export const useEventConditionManager = (objectId: string, profiles: DeviceProfile[]) => {
    const [editingData, setEditingData] = useState<EventCondition[]>([]);
    const [originalData, setOriginalData] = useState<EventCondition[]>([]);
    const [newConditions, setNewConditions] = useState<CreateConditionData[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const { data: conditions, isLoading, error, mutate: refetch } = useEventConditions(objectId);
    const { createEventConditions, updateEventConditions, deleteEventCondition } = useEventConditionMutations();

    const conditionsData = conditions || [];

    useEffect(() => {
        if (conditionsData.length > 0) {
            const deepCopyConditions = conditionsData.map(condition => ({ ...condition }));
            setOriginalData([...conditionsData]);
            setEditingData(deepCopyConditions);
        } else {
            setOriginalData([]);
            setEditingData([]);
        }
        setHasUnsavedChanges(false);
    }, [conditionsData]);

    const checkForChanges = (currentEditing: EventCondition[], currentNew: CreateConditionData[]) => {
        const hasExistingChanges = currentEditing.some((current, index) => {
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

        // 새 조건이나 삭제된 조건 확인
        const hasNewConditions = currentNew.length > 0;
        const hasDeletedConditions = currentEditing.length !== originalData.length;

        return hasExistingChanges || hasNewConditions || hasDeletedConditions;
    };

    // 기존 조건 수정
    const handleEditDataChange = (index: number, field: keyof EventCondition, value: any) => {
        setEditingData(prev => {
            const updated = [...prev];
            if (!updated[index]) return prev;

            let updatedCondition = { ...updated[index], [field]: value };

            // fieldKey 변경 시 조건 재설정
            if (field === 'fieldKey') {
                const conditionConfig = getConditionConfigByProfile(profiles, value);
                updatedCondition = { ...updatedCondition, ...conditionConfig };
            }

            // conditionType 변경 시 관련 필드 재설정
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
            
            // 변경사항 확인 및 상태 업데이트
            const hasChanges = checkForChanges(updated, newConditions);
            setHasUnsavedChanges(hasChanges);
            
            return updated;
        });
    };

    // 새 조건 추가
    const handleAddNew = () => {
        const newCondition = createDefaultCondition(objectId);
        setNewConditions(prev => {
            const updated = [...prev, newCondition];
            setHasUnsavedChanges(checkForChanges(editingData, updated));
            return updated;
        });
    };

    // 새 조건 수정
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
                        const isBoolean = isBooleanProfile(profiles, updatedCondition.fieldKey || '');

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

            setHasUnsavedChanges(checkForChanges(editingData, updated));
            return updated;
        });
    };

    // 새 조건 제거
    const handleRemoveNewCondition = (index: number) => {
        setNewConditions(prev => {
            const updated = prev.filter((_, i) => i !== index);
            setHasUnsavedChanges(checkForChanges(editingData, updated));
            return updated;
        });
    };

    // 기존 조건 삭제
    const handleDelete = async (conditionId: number) => {
        if (window.confirm('이 컨디션을 삭제하시겠습니까?')) {
            setEditingData(prev => {
                const updated = prev.filter(condition => condition.id !== conditionId);
                setHasUnsavedChanges(checkForChanges(updated, newConditions));
                return updated;
            });
        }
    };

    // 전체 저장
    const handleSaveAll = async () => {
        // 모든 조건 유효성 검사
        const invalidExistingConditions = editingData.filter(condition => {
            const conditionData = toCreateConditionData(condition);
            return !validateConditionData(conditionData, profiles);
        });

        const invalidNewConditions = newConditions.filter(condition => 
            !validateConditionData(condition, profiles)
        );

        if (invalidExistingConditions.length > 0 || invalidNewConditions.length > 0) {
            alert(`${invalidExistingConditions.length + invalidNewConditions.length}개의 조건에 필수 필드가 누락되었습니다.`);
            return;
        }

        try {
            // 기존 조건 업데이트
            if (editingData.length > 0) {
                await updateEventConditions({
                    objectId,
                    conditions: editingData
                });
            }

            // 새 조건 생성
            if (newConditions.length > 0) {
                const apiConditions = newConditions.map(condition => toApiConditionData(condition, profiles));
                await createEventConditions({
                    objectId,
                    conditions: apiConditions
                });
            }

            // 삭제된 조건들 처리 (기존 조건 중 제거된 것들)
            const deletedConditions = originalData.filter(original => 
                !editingData.some(current => current.id === original.id)
            );

            for (const deletedCondition of deletedConditions) {
                if (deletedCondition.id) {
                    await deleteEventCondition(deletedCondition.id);
                }
            }

            // 상태 초기화
            setNewConditions([]);
            setHasUnsavedChanges(false);
            
            // 데이터 새로고침
            await refetch();
        } catch (error) {
            alert('이벤트 조건 저장에 실패했습니다.');
        }
    };

    // 전체 취소
    const handleCancelAll = () => {
        if (hasUnsavedChanges && !window.confirm('변경사항이 있습니다. 모든 변경사항을 취소하시겠습니까?')) {
            return;
        }

        // 원본 데이터로 복원
        const deepCopyOriginal = originalData.map(condition => ({ ...condition }));
        setEditingData(deepCopyOriginal);
        setNewConditions([]);
        setHasUnsavedChanges(false);
    };

    const getConditionSummary = (condition: CreateConditionData | EventCondition | undefined): string => {
        return formatConditionSummary(condition, profiles);
    };

    return {
        // 데이터 - editingData가 곧 conditionsData
        conditionsData: editingData,
        newConditions,
        isLoading,
        error,
        hasUnsavedChanges,
        
        // 핸들러들
        handleEditDataChange,
        handleAddNew,
        handleNewConditionChange,
        handleRemoveNewCondition,
        handleDelete,
        handleSaveAll,
        handleCancelAll,
        getConditionSummary,
        refetch
    };
};