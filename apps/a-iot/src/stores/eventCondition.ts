import { create } from 'zustand'
import { EventCondition, DeviceProfile } from '@/services/types'
import {
    createDefaultCondition,
    getConditionConfigByProfile,
    isBooleanProfile
} from '@/pages/management/devices/sensor/handlers/EventConditionUtils'

interface EventConditionState {
    // 상태
    conditions: EventCondition[]
    originalConditions: EventCondition[]
    isDirty: boolean
    validationErrors: string[]
    errorIndices: Set<number>
    apiError: string | null

    // 액션
    setConditions: (conditions: EventCondition[]) => void
    updateCondition: (index: number, field: keyof EventCondition, value: any, profiles: DeviceProfile[]) => void
    addCondition: (objectId: string) => void
    removeCondition: (index: number) => void
    setValidationResult: (errors: string[], indices: Set<number>) => void
    setApiError: (error: string | null) => void
    resetToOriginal: () => void
    clearAfterSave: () => void
    reset: () => void
}

export const useEventConditionStore = create<EventConditionState>((set, get) => ({
    // 초기 상태
    conditions: [],
    originalConditions: [],
    isDirty: false,
    validationErrors: [],
    errorIndices: new Set(),
    apiError: null,

    // 서버에서 데이터 로드 시
    setConditions: (conditions) => {
        const sorted = sortConditions(conditions)
        set({
            conditions: sorted.map(c => ({ ...c })),
            originalConditions: sorted,
            isDirty: false,
            validationErrors: [],
            errorIndices: new Set(),
            apiError: null
        })
    },

    // 조건 업데이트
    updateCondition: (index, field, value, profiles) => {
        const { conditions } = get()
        if (!conditions[index]) return

        let updatedCondition = { ...conditions[index], [field]: value }

        // fieldKey 변경 시 관련 설정도 업데이트
        if (field === 'fieldKey') {
            const conditionConfig = getConditionConfigByProfile(profiles, value)
            updatedCondition = { ...updatedCondition, ...conditionConfig }
        }

        // conditionType 변경 시 관련 필드 초기화
        if (field === 'conditionType') {
            const isBoolean = isBooleanProfile(profiles, updatedCondition.fieldKey || '')

            if (isBoolean) {
                updatedCondition.conditionType = 'SINGLE'
                updatedCondition.operator = 'GE'
            } else {
                if (value === 'SINGLE') {
                    updatedCondition.operator = 'GE'
                    updatedCondition.leftValue = undefined
                    updatedCondition.rightValue = undefined
                } else if (value === 'RANGE') {
                    updatedCondition.operator = 'BETWEEN'
                    updatedCondition.thresholdValue = undefined
                }
            }
        }

        const newConditions = [...conditions]
        newConditions[index] = updatedCondition

        set({
            conditions: newConditions,
            isDirty: true
        })
    },

    // 새 조건 추가
    addCondition: (objectId) => {
        const { conditions } = get()
        const newCondition: EventCondition = {
            ...createDefaultCondition(objectId),
            id: undefined
        }

        set({
            conditions: [newCondition, ...conditions],
            isDirty: true
        })
    },

    // 조건 제거 (신규 조건만)
    removeCondition: (index) => {
        const { conditions } = get()
        set({
            conditions: conditions.filter((_, i) => i !== index),
            isDirty: true
        })
    },

    // 검증 결과 설정
    setValidationResult: (errors, indices) => {
        set({
            validationErrors: errors,
            errorIndices: indices
        })
    },

    // API 에러 설정
    setApiError: (error) => {
        set({ apiError: error })
    },

    // 원본으로 되돌리기 (취소)
    resetToOriginal: () => {
        const { originalConditions } = get()
        set({
            conditions: originalConditions.map(c => ({ ...c })),
            isDirty: false,
            validationErrors: [],
            errorIndices: new Set(),
            apiError: null
        })
    },

    // 저장 성공 후 정리
    clearAfterSave: () => {
        const { conditions } = get()
        set({
            originalConditions: conditions.map(c => ({ ...c })),
            isDirty: false,
            validationErrors: [],
            errorIndices: new Set(),
            apiError: null
        })
    },

    // 완전 초기화
    reset: () => {
        set({
            conditions: [],
            originalConditions: [],
            isDirty: false,
            validationErrors: [],
            errorIndices: new Set(),
            apiError: null
        })
    }
}))

// 정렬 함수
function sortConditions(conditions: EventCondition[]): EventCondition[] {
    const getLevelPriority = (level: string): number => {
        const levelOrder: Record<string, number> = {
            'NORMAL': 1,
            'CAUTION': 2,
            'WARNING': 3,
            'DANGER': 4,
            'DISCONNECTED': 5
        }
        return levelOrder[level] || 999
    }

    return [...conditions].sort((a, b) => {
        // 1. Field Key로 정렬
        const fieldKeyCompare = (a.fieldKey || '').localeCompare(b.fieldKey || '')
        if (fieldKeyCompare !== 0) return fieldKeyCompare

        // 2. 조건 값으로 정렬
        const aValue = a.leftValue ?? a.thresholdValue ?? Number.MAX_SAFE_INTEGER
        const bValue = b.leftValue ?? b.thresholdValue ?? Number.MAX_SAFE_INTEGER
        const valueCompare = aValue - bValue
        if (valueCompare !== 0) return valueCompare

        // 3. 레벨로 정렬
        return getLevelPriority(a.level) - getLevelPriority(b.level)
    })
}
