export interface DeviceProfile {
    id: number;
    fieldKey: string;
    description: string;
    fieldUnit: string;
    fieldType: string;
}

export interface DeviceType {
    id: number;
    objectId: string;
    description: string;
    version: string;
    profiles: DeviceProfile[];
}
