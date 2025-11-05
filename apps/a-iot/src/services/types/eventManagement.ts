export interface Event {
    eventId: number,
    deviceId: string,
    objectId: string,
    occurredAt: string,
    minValue: number,
    maxValue: number,
    actionResult: string,
    eventName: string,
    fieldKey: string,
    guideMessage: string
}

export interface EventsQueryParams {
    from?: string;
    to?: string;
    siteId?: number;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface TimeSeriesQueryParams {
    interval: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
    from: string;
    to: string;
}

export interface TimeSeriesData {
    meta: {
        targetId: string;
        query: {
            timeUnit: string;
            from: string;
            to: string;
            metrics: string[];
        }
    };
    timestamps: string[];
    metrics: {
        [key: string]: {
            unit: string;
            values: number[];
        }
    }
}

export interface EventStatusUpdateRequest {
    result: 'PENDING' | 'COMPLETED' | 'FAILED';
}