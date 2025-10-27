export interface EventCondition {
    id?: number;
    objectId: string;
    fieldKey: string;
    level: 'NORMAL' | 'WARNING' | 'CAUTION' | 'DANGER' | 'DISCONNECTED';
    conditionType: 'SINGLE' | 'RANGE';
    operator: 'GE' | 'LE' | 'BETWEEN';
    thresholdValue?: number;
    leftValue?: number;
    rightValue?: number;
    booleanValue?: boolean;
    notificationEnabled: boolean;
    order: number;
    activate: boolean;
}

export interface EventConditionRequest {
    objectId: string;
    conditions: Omit<EventCondition, 'id'>[];
}