import {FileResponse} from "@plug-atlas/types";

export interface ActionHistory {
    id: number;
    deviceId: string;
    eventName:string;
    eventHistoryId: number;
    content: string;
    files: FileResponse;
    createdAt?: string;
    updatedAt?: string;
    author?: string;
}

export interface ActionHistoryRequest {
    content: string;
    fileIds?: number | number[];
}