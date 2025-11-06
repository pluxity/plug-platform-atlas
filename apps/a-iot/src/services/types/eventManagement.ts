export interface Event {
    eventId: number,
    deviceId: string,
    objectId: string,
    occurredAt: string,
    minValue: number,
    maxValue: number,
    status: string,
    eventName: string,
    fieldKey: string,
    guideMessage: string,
    audit: string,
}

export interface EventsQueryParams {
    from?: string;
    to?: string;
    siteId?: number;
    status?: EventStatus;
}

export interface TimeSeriesQueryParams {
    interval: EventCollectInterval;
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

export interface EventStatusRequest {
    result: EventStatus;
}
export type EventStatus = 'PENDING' | 'WORKING' | 'COMPLETED'
export type EventCollectInterval = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';