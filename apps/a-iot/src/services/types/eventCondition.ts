export interface BaseConditionFields {
    objectId: string;
    fieldKey: string;
    level: EventLevel;
    conditionType?: EventConditionType;
    operator?: EventConditionOperator;
    thresholdValue?: number;
    leftValue?: number;
    rightValue?: number;
    booleanValue?: boolean;
    notificationEnabled: boolean;
    guideMessage?: string;
    activate: boolean;
}

export interface EventCondition extends BaseConditionFields {
    id?: number;
}

export interface EventConditionRequest {
    objectId: string;
    conditions: Omit<EventCondition, 'id'>[];
}

export type EventLevel = 'NORMAL' | 'WARNING' | 'CAUTION' | 'DANGER' | 'DISCONNECTED';
export type EventConditionOperator = 'GE' | 'LE' | 'BETWEEN';
export type EventConditionType = 'SINGLE' | 'RANGE';