import { useState } from 'react';
import { EventCondition } from '../../../../../services/types';
import {
    CreateConditionData,
    createDefaultCondition, DeleteHandlers,
    EditHandlers,
    NewConditionHandlers
} from "./eventConditionUtils.tsx";
import {useEventConditionMutations, useEventConditions} from "../../../../../services/hooks";


export const useEventConditionManager = (objectId: string) => {
    const [editingRows, setEditingRows] = useState<Set<number>>(new Set());
    const [editingData, setEditingData] = useState<{ [key: number]: EventCondition }>({});
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newCondition, setNewCondition] = useState<CreateConditionData>(createDefaultCondition(objectId));

    const { data: conditions, isLoading, error, mutate: refetch } = useEventConditions(objectId);
    const { createEventConditions, updateEventConditions, deleteEventCondition } = useEventConditionMutations();

    const conditionsData = conditions || [];

    // 편집 핸들러들
    const editHandlers: EditHandlers = {
        handleStartEdit: (row: EventCondition, index: number) => {
            setEditingRows(prev => new Set(prev).add(index));
            setEditingData(prev => ({ ...prev, [index]: { ...row } }));
        },

        handleCancelEdit: (index: number) => {
            setEditingRows(prev => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
            });
            setEditingData(prev => {
                const { [index]: _, ...rest } = prev;
                return rest;
            });
        },

        handleSaveEdit: async (index: number) => {
            const updatedCondition = editingData[index];
            if (!updatedCondition?.id) return;

            try {
                const updatedConditions = conditionsData.map(condition =>
                    condition.id === updatedCondition.id ? updatedCondition : condition
                );

                await updateEventConditions({
                    objectId,
                    conditions: updatedConditions
                });

                editHandlers.handleCancelEdit(index);
                refetch();
            } catch (error) {
                console.error('이벤트 컨디션 수정 실패:', error);
            }
        },

        handleEditDataChange: (index: number, field: keyof EventCondition, value: any) => {
            setEditingData(prev => {
                const existingData = prev[index];
                if (!existingData) {
                    const originalCondition = conditionsData[index];
                    if (!originalCondition) return prev;

                    return {
                        ...prev,
                        [index]: {
                            ...originalCondition,
                            [field]: value
                        }
                    };
                }

                return {
                    ...prev,
                    [index]: {
                        ...existingData,
                        [field]: value
                    }
                };
            });
        },

        getEditingValue: (index: number, field: keyof EventCondition, originalValue: any) => {
            const editingRow = editingData[index];
            return editingRow ? editingRow[field] : originalValue;
        }
    };

    // 새 조건 핸들러들
    const newConditionHandlers: NewConditionHandlers = {
        handleAddNew: () => {
            setIsAddingNew(true);
        },

        handleSaveNew: async () => {
            try {
                await createEventConditions({
                    objectId,
                    conditions: [newCondition]
                });
                setIsAddingNew(false);
                setNewCondition(createDefaultCondition(objectId));
                await refetch();
            } catch (error) {
                console.error('이벤트 컨디션 생성 실패:', error);
            }
        },

        handleCancelNew: () => {
            setIsAddingNew(false);
            setNewCondition(createDefaultCondition(objectId));
        }
    };

    // 삭제 핸들러들
    const deleteHandlers: DeleteHandlers = {
        handleDeleteSelected: async () => {
            if (selectedRows.length === 0) return;

            if (window.confirm(`선택된 ${selectedRows.length}개의 컨디션을 삭제하시겠습니까?`)) {
                try {
                    const deletePromises = selectedRows.map(async (index) => {
                        const condition = conditionsData[index];
                        if (condition?.id) {
                            return deleteEventCondition(condition.id, objectId);
                        }
                    });

                    await Promise.all(deletePromises);
                    setSelectedRows([]);
                    refetch();
                } catch (error) {
                    console.error('이벤트 컨디션 삭제 실패:', error);
                }
            }
        }
    };

    return {
        // 상태
        conditionsData,
        isLoading,
        error,
        editingRows,
        selectedRows,
        isAddingNew,
        newCondition,
        // 상태 설정
        setSelectedRows,
        setNewCondition,
        // 핸들러들
        editHandlers,
        newConditionHandlers,
        deleteHandlers,
        // 기타
        refetch
    };
};