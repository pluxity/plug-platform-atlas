export interface EventCondition {
    id?: number;
    objectId: string;
    fieldKey: string;
    level: 'NORMAL' | 'WARNING' | 'CAUTION' | 'DANGER' | 'DISCONNECTED';
    conditionType?: 'SINGLE' | 'RANGE';
    operator?: 'GE' | 'LE' | 'BETWEEN';
    thresholdValue?: number;
    leftValue?: number;
    rightValue?: number;
    booleanValue?: boolean;
    notificationEnabled: boolean;
    guideMessage?: string;
    activate: boolean;
}

export interface EventConditionRequest {
    objectId: string;
    conditions: Omit<EventCondition, 'id'>[];
}

export type EventLevel = 'NORMAL' | 'WARNING' | 'CAUTION' | 'DANGER' | 'DISCONNECTED';
export type EventConditionOperator = 'GE' | 'LE' | 'BETWEEN';