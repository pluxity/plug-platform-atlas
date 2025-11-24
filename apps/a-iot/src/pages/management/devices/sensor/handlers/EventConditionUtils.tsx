// Internal imports
import { DeviceProfile, EventCondition, EventLevel } from '@/services/types'

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
})

export const isBooleanProfile = (profiles: DeviceProfile[], fieldKey: string): boolean => {
    const profile = profiles.find(p => p.fieldKey === fieldKey)
    return profile?.fieldType === 'Boolean'
}

export const getConditionConfigByProfile = (profiles: DeviceProfile[], fieldKey: string): Partial<EventCondition> => {
    const profile = profiles.find(p => p.fieldKey === fieldKey)

    if (!profile) {
        return {}
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
        }
    }

    return {
        level: 'NORMAL',
        conditionType: 'SINGLE',
        operator: 'GE',
        booleanValue: undefined,
        thresholdValue: undefined,
        leftValue: undefined,
        rightValue: undefined
    }
}

export const getAvailableLevelsByProfile = (profiles: DeviceProfile[], fieldKey: string): EventLevel[] => {
    const isBoolean = isBooleanProfile(profiles, fieldKey)

    if (isBoolean) {
        return ['NORMAL', 'DANGER']
    }

    return ['NORMAL', 'CAUTION', 'WARNING', 'DANGER']
}

export const getProfileByFieldKey = (profiles: DeviceProfile[], fieldKey: string): DeviceProfile | undefined => {
    return profiles.find(p => p.fieldKey === fieldKey)
}
