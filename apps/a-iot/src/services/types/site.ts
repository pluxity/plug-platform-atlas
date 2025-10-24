export interface Site {
    id: number;
    name: string;
    description: string;
    location: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface SiteCreateRequest {
    name: string;
    location: string;
    description: string;
}

export interface SiteUpdateRequest {
    name: string;
    location: string;
    description: string;
}