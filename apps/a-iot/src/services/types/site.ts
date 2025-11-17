import type {FileResponse} from "@plug-atlas/types";

export interface Site {
    id: number;
    name: string;
    description: string;
    location: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    thumbnail: FileResponse | null;
}

export interface SiteCreateRequest {
    name: string;
    location: string;
    description?: string;
    thumbnailId?: number;
}

export interface SiteUpdateRequest {
    name: string;
    location: string;
    description?: string;
    thumbnailId?: number;
}