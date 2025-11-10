export interface Event {
    eventId: number,
    deviceId: string,
    objectId: string,
    occurredAt: string,
    minValue: number,
    maxValue: number,
    status: string,
    level: string,
    eventName: string,
    fieldKey: string,
    guideMessage: string,
    longitude: number,
    latitude: number,
    updatedAt: string,
    updatedBy: string,
}

export interface EventsQueryParams {
    from?: string;
    to?: string;
    siteId?: number;
    status?: EventStatus;
    level?: EventLevel;
    sensorType?: SensorType;
    size?: number;
    lastId?: number;
}

export interface PaginatedEventsResponse {
    content: Event[];
    nextCursor: number | null;
    hasNext: boolean;
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

export type EventStatus = 'PENDING' | 'WORKING' | 'COMPLETED';
export type EventLevel = 'NORMAL' | 'WARNING' | 'CAUTION' | 'DANGER' | 'DISCONNECTED';
export type SensorType = 'TEMPERATURE_HUMIDITY' | 'FIRE' | 'DISPLACEMENT_GAUGE';
export type EventCollectInterval = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';