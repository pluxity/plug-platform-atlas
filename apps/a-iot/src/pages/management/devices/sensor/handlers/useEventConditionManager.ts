// External packages
import { useEffect, useCallback } from 'react'

// @plug-atlas packages
import { toast } from '@plug-atlas/ui'

// Internal imports
import { EventCondition, DeviceProfile } from '@/services/types'
import { useEventConditionMutations, useEventConditions } from '@/services/hooks'
import { useEventConditionStore } from '@/stores/eventCondition'

export const useEventConditionManager = (objectId: string, profiles: DeviceProfile[]) => {
    const { data: conditions, isLoading, error, mutate: refetch } = useEventConditions(objectId)
    const { updateEventConditions, deleteEventCondition } = useEventConditionMutations()

    // Store에서 상태와 액션 가져오기
    const store = useEventConditionStore()

    // 서버 데이터가 변경되면 store 업데이트
    useEffect(() => {
        if (conditions) {
            store.setConditions(conditions)
        }
    }, [conditions])

    // 컴포넌트 언마운트 시 store 초기화
    useEffect(() => {
        return () => {
            store.reset()
        }
    }, [])

    // 조건 업데이트 핸들러
    const handleEditDataChange = useCallback((index: number, field: keyof EventCondition, value: any) => {
        store.updateCondition(index, field, value, profiles)
    }, [profiles])

    // 새 조건 추가
    const handleAddNew = useCallback(() => {
        store.addCondition(objectId)
    }, [objectId])

    // 조건 제거 (신규만)
    const handleRemoveCondition = useCallback((index: number) => {
        store.removeCondition(index)
    }, [])

    // 조건 삭제 (서버)
    const handleDelete = useCallback(async (conditionId: number) => {
        try {
            store.setApiError(null)
            await deleteEventCondition(conditionId, objectId)
            toast.success("삭제 완료", {
                description: "이벤트 조건이 삭제되었습니다.",
            })
        } catch (error: any) {
            console.error('조건 삭제 실패:', error)
            const errorMessage = error?.response?.data?.message || error?.message || "이벤트 조건 삭제 중 오류가 발생했습니다."
            store.setApiError(errorMessage)
            toast.error("삭제 실패", {
                description: errorMessage,
            })
        }
    }, [objectId, deleteEventCondition])

    // 전체 저장
    const handleSaveAll = useCallback(async () => {
        try {
            store.setValidationResult([], new Set())
            store.setApiError(null)

            // Validation 체크
            const validation = validateConditions(store.conditions, profiles)
            if (!validation.isValid) {
                store.setValidationResult(validation.errors, validation.errorIndices)
                toast.error("저장 실패", {
                    description: "입력 내용을 확인해주세요.",
                })
                return
            }

            // 서버에 저장
            await updateEventConditions({
                conditions: store.conditions,
                objectId
            })

            store.clearAfterSave()
            toast.success("저장 완료", {
                description: "모든 이벤트 조건이 저장되었습니다.",
            })
        } catch (error: any) {
            console.error('조건 저장 실패:', error)
            const errorMessage = error?.response?.data?.message || error?.message || "이벤트 조건 저장 중 오류가 발생했습니다."
            store.setApiError(errorMessage)
            toast.error("저장 실패", {
                description: errorMessage,
            })
        }
    }, [objectId, profiles, updateEventConditions])

    // 전체 취소
    const handleCancelAll = useCallback(() => {
        store.resetToOriginal()
    }, [])

    return {
        conditionsData: store.conditions,
        isLoading,
        error,
        isDirty: store.isDirty,
        validationErrors: store.validationErrors,
        errorIndices: store.errorIndices,
        apiError: store.apiError,
        handleEditDataChange,
        handleAddNew,
        handleRemoveCondition,
        handleDelete,
        handleSaveAll,
        handleCancelAll,
        refetch
    }
}

// Validation 함수
function validateConditions(conditions: EventCondition[], profiles: DeviceProfile[]): {
    isValid: boolean
    errors: string[]
    errorIndices: Set<number>
} {
    const errors: string[] = []
    const errorIdxSet = new Set<number>()

    // 필수 필드 체크
    conditions.forEach((condition, index) => {
        let hasError = false

        if (!condition.fieldKey) {
            errors.push(`${index + 1}번째 조건: Field Key를 선택해주세요`)
            hasError = true
        }

        const profile = profiles.find(p => p.fieldKey === condition.fieldKey)
        const isBoolean = profile?.fieldType === 'Boolean'

        if (isBoolean && condition.booleanValue == null) {
            errors.push(`${index + 1}번째 조건: Boolean 값을 선택해주세요`)
            hasError = true
        }

        if (!isBoolean && condition.conditionType === 'SINGLE' && condition.thresholdValue == null) {
            errors.push(`${index + 1}번째 조건: 기준값을 입력해주세요`)
            hasError = true
        }

        if (condition.conditionType === 'RANGE') {
            if (condition.leftValue == null) {
                errors.push(`${index + 1}번째 조건: 최소값을 입력해주세요`)
                hasError = true
            }
            if (condition.rightValue == null) {
                errors.push(`${index + 1}번째 조건: 최대값을 입력해주세요`)
                hasError = true
            }
            if (condition.leftValue != null && condition.rightValue != null && condition.leftValue >= condition.rightValue) {
                errors.push(`${index + 1}번째 조건: 최소값은 최대값보다 작아야 합니다`)
                hasError = true
            }
        }

        if (hasError) {
            errorIdxSet.add(index)
        }
    })

    // Field Key별로 그룹화 (인덱스 포함)
    const groupByFieldKey = new Map<string, { condition: EventCondition; index: number }[]>()
    conditions.forEach((condition, index) => {
        if (!condition.fieldKey) return

        if (!groupByFieldKey.has(condition.fieldKey)) {
            groupByFieldKey.set(condition.fieldKey, [])
        }
        groupByFieldKey.get(condition.fieldKey)!.push({ condition, index })
    })

    // 겹침 체크 함수
    const checkConditionOverlap = (cond1: EventCondition, cond2: EventCondition, profile: any): boolean => {
        const isBoolean = profile?.fieldType === 'Boolean'

        if (isBoolean) {
            if (cond1.booleanValue != null && cond2.booleanValue != null) {
                return cond1.booleanValue === cond2.booleanValue
            }
            return false
        }

        if ((cond1.booleanValue != null) || (cond2.booleanValue != null)) {
            return false
        }

        const hasRange = cond1.conditionType === 'RANGE' || cond2.conditionType === 'RANGE'

        if (!hasRange) {
            if (cond1.conditionType === 'SINGLE' && cond2.conditionType === 'SINGLE') {
                if (cond1.thresholdValue == null || cond2.thresholdValue == null) {
                    return false
                }
                // 같은 operator면 항상 겹침 (GE 10과 GE 20은 둘 다 20 이상을 포함)
                if (cond1.operator === cond2.operator) {
                    return true
                }
                // GE와 LE가 다르면 겹치지 않음 (서로 다른 방향)
                return false
            }
            return false
        }

        if (cond1.conditionType === 'RANGE' && cond2.conditionType === 'RANGE') {
            if (cond1.leftValue == null || cond1.rightValue == null ||
                cond2.leftValue == null || cond2.rightValue == null) {
                return false
            }
            return !(cond1.rightValue < cond2.leftValue || cond2.rightValue < cond1.leftValue)
        }

        const single = cond1.conditionType === 'SINGLE' ? cond1 : cond2
        const range = cond1.conditionType === 'RANGE' ? cond1 : cond2

        if (single.thresholdValue == null || range.leftValue == null || range.rightValue == null) {
            return false
        }

        if (single.operator === 'GE') {
            return single.thresholdValue <= range.rightValue
        }
        if (single.operator === 'LE') {
            return single.thresholdValue >= range.leftValue
        }

        return false
    }

    // 조건값 설명 함수
    const getConditionDescription = (cond: EventCondition, profile: any): string => {
        const isBoolean = profile?.fieldType === 'Boolean'

        if (isBoolean && cond.booleanValue != null) {
            return cond.booleanValue ? 'True' : 'False'
        }

        if (cond.conditionType === 'RANGE' && cond.leftValue != null && cond.rightValue != null) {
            const unit = profile?.fieldUnit ? ` ${profile.fieldUnit}` : ''
            return `${cond.leftValue}${unit} ~ ${cond.rightValue}${unit}`
        }

        if (cond.conditionType === 'SINGLE' && cond.thresholdValue != null) {
            const unit = profile?.fieldUnit ? ` ${profile.fieldUnit}` : ''
            const op = cond.operator === 'GE' ? '이상' : '이하'
            return `${cond.thresholdValue}${unit} ${op}`
        }

        return '미설정'
    }

    // 각 Field Key 그룹 내에서 검사
    groupByFieldKey.forEach((items, fieldKey) => {
        const profile = profiles.find(p => p.fieldKey === fieldKey)
        const fieldName = profile?.description || fieldKey

        // 같은 레벨끼리 그룹화
        const groupByLevel = new Map<string, { condition: EventCondition; index: number }[]>()
        items.forEach(item => {
            if (!groupByLevel.has(item.condition.level)) {
                groupByLevel.set(item.condition.level, [])
            }
            groupByLevel.get(item.condition.level)!.push(item)
        })

        // 각 레벨 그룹 내에서 겹침 검사
        groupByLevel.forEach((levelItems, level) => {
            const levelNames: Record<string, string> = {
                'NORMAL': '정상',
                'CAUTION': '주의',
                'WARNING': '경고',
                'DANGER': '위험',
                'DISCONNECTED': '연결끊김'
            }
            const levelName = levelNames[level] || level
            const isBoolean = profile?.fieldType === 'Boolean'

            // Boolean 타입은 같은 레벨에 하나만 허용
            if (isBoolean && levelItems.length > 1) {
                errors.push(`${fieldName} (${levelName}): Boolean 타입은 같은 레벨에 하나의 조건만 설정할 수 있습니다`)
                levelItems.forEach(item => errorIdxSet.add(item.index))
                return
            }

            for (let i = 0; i < levelItems.length; i++) {
                for (let j = i + 1; j < levelItems.length; j++) {
                    const item1 = levelItems[i]
                    const item2 = levelItems[j]

                    if (!item1 || !item2) continue

                    if (checkConditionOverlap(item1.condition, item2.condition, profile)) {
                        const desc1 = getConditionDescription(item1.condition, profile)
                        const desc2 = getConditionDescription(item2.condition, profile)
                        errors.push(`${fieldName} (${levelName}): 조건값이 겹칩니다 - "${desc1}"와 "${desc2}"`)
                        errorIdxSet.add(item1.index)
                        errorIdxSet.add(item2.index)
                    }
                }
            }
        })
    })

    return {
        isValid: errors.length === 0,
        errors: Array.from(new Set(errors)),
        errorIndices: errorIdxSet
    }
}
