import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from '@plug-atlas/ui';
import { DeviceProfile, EventCondition } from '../../../../../services/types';
import {
    getOperatorLabel,
    getLevelBadge,
    getAvailableLevelsByProfile,
    isBooleanProfile,
    getBooleanValueLabel, getProfileByFieldKey
} from '../handlers/EventConditionUtils';

interface EditableFieldKeyProps {
    value: string;
    onChange: (value: string) => void;
    profiles: DeviceProfile[];
    isEditing: boolean;
}

export const EditableFieldKey: React.FC<EditableFieldKeyProps> = ({
    value,
    onChange,
    profiles,
    isEditing
}) => {
    if (!isEditing) {
        return (
            <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {value}
            </div>
        );
    }

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Field Key 선택" />
            </SelectTrigger>
            <SelectContent>
                {profiles.map((profile) => (
                    <SelectItem key={profile.fieldKey} value={profile.fieldKey}>
                        <div className="flex flex-col">
                            <span className="font-mono text-sm">{profile.fieldKey}</span>
                            <span className="text-xs text-gray-500">
                                {profile.description} ({profile.fieldType})
                            </span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

interface EditableLevelProps {
    value: EventCondition['level'];
    onChange: (value: EventCondition['level']) => void;
    isEditing: boolean;
    profiles: DeviceProfile[];
    fieldKey: string;
}

export const EditableLevel: React.FC<EditableLevelProps> = ({
    value,
    onChange,
    isEditing,
    profiles,
    fieldKey
}) => {
    if (!isEditing) {
        return getLevelBadge(value);
    }

    const availableLevels = getAvailableLevelsByProfile(profiles, fieldKey);
    const isBoolean = isBooleanProfile(profiles, fieldKey);

    return (
        <Select value={value} onValueChange={(value: string) => onChange(value as EventCondition['level'])}>
            <SelectTrigger className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {availableLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                        <div className="flex items-center gap-2">
                            {getLevelBadge(level)}
                            {isBoolean && level === 'NORMAL' && (
                                <span className="text-xs text-gray-500">(True 상태)</span>
                            )}
                            {isBoolean && level === 'DANGER' && (
                                <span className="text-xs text-gray-500">(False 상태)</span>
                            )}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

interface EditableConditionTypeProps {
    value: EventCondition['conditionType'];
    onChange: (value: EventCondition['conditionType']) => void;
    isEditing: boolean;
    profiles: DeviceProfile[];
    fieldKey: string;
}

export const EditableConditionType: React.FC<EditableConditionTypeProps> = ({
    value,
    onChange,
    isEditing,
    profiles,
    fieldKey
}) => {
    const isBoolean = isBooleanProfile(profiles, fieldKey);
    
    if (!isEditing || isBoolean) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {isBoolean ? 'Boolean' : (value === 'SINGLE' ? '단일' : '범위')}
            </span>
        );
    }

    return (
        <Select value={value} onValueChange={(value: string) => onChange(value as EventCondition['conditionType'])}>
            <SelectTrigger className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="SINGLE">단일 조건</SelectItem>
                <SelectItem value="RANGE">범위 조건</SelectItem>
            </SelectContent>
        </Select>
    );
};

interface EditableConditionProps {
    row: EventCondition;
    onChange: (field: keyof EventCondition, value: any) => void;
    isEditing: boolean;
    profiles: DeviceProfile[];
}

export const EditableCondition: React.FC<EditableConditionProps> = ({
    row,
    onChange,
    isEditing,
    profiles
}) => {
    const isBoolean = isBooleanProfile(profiles, row.fieldKey);

    if (!isEditing) {
        if (isBoolean) {
            return (
                <div className="text-sm">
                    <div className="font-medium">{getBooleanValueLabel(row.booleanValue ?? true)}</div>
                    <div className="text-xs text-gray-500">Boolean 조건</div>
                </div>
            );
        }

        if (row.conditionType === 'RANGE') {
            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {row.leftValue} {getOperatorLabel('BETWEEN')} {row.rightValue}
                    </div>
                    <div className="text-xs text-gray-500">범위 조건</div>
                </div>
            );
        }

        return (
            <div className="text-sm">
                <div className="font-medium">
                    {getOperatorLabel(row.operator)} {row.thresholdValue}
                </div>
                <div className="text-xs text-gray-500">단일 조건</div>
            </div>
        );
    }

    if (isBoolean) {
        return (
            <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">트리거 조건</div>
                <Select 
                    value={row.booleanValue ? 'true' : 'false'} 
                    onValueChange={(value) => onChange('booleanValue', value === 'true')}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">
                            <div className="flex flex-col">
                                <span>참 (True)</span>
                                <span className="text-xs text-gray-500">값이 true일 때 알림</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="false">
                            <div className="flex flex-col">
                                <span>거짓 (False)</span>
                                <span className="text-xs text-gray-500">값이 false일 때 알림</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        );
    }

    if (row.conditionType === 'RANGE') {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        step="0.01"
                        value={row.leftValue ?? ''}
                        onChange={(e) => onChange('leftValue', parseFloat(e.target.value) || undefined)}
                        placeholder="최소값"
                        className="w-16 text-sm"
                    />
                    <span className="text-xs text-gray-500">≤ 값 ≤</span>
                    <Input
                        type="number"
                        step="0.01"
                        value={row.rightValue ?? ''}
                        onChange={(e) => onChange('rightValue', parseFloat(e.target.value) || undefined)}
                        placeholder="최대값"
                        className="w-16 text-sm"
                    />
                    <span
                        className="text-xs text-gray-500">{getProfileByFieldKey(profiles, row.fieldKey)?.fieldUnit}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700">단일 조건</div>
            <div className="flex items-center gap-2">
                <Select 
                    value={row.operator || 'GE'} 
                    onValueChange={(value: string) => onChange('operator', value as EventCondition['operator'])}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GE">
                            <div className="flex flex-col">
                                <span>이상</span>
                                <span className="text-xs text-gray-400">≥</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="LE">
                            <div className="flex flex-col">
                                <span>이하</span>
                                <span className="text-xs text-gray-400">≤</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    type="number"
                    step="0.01"
                    value={row.thresholdValue ?? ''}
                    onChange={(e) => onChange('thresholdValue', parseFloat(e.target.value) || undefined)}
                    placeholder="기준값"
                    className="w-24 text-sm"
                />
            </div>
            <div className="text-xs text-gray-500">
                값이 {row.thresholdValue ?? '기준값'} {getOperatorLabel(row.operator || 'GE')}일 때 알림
            </div>
        </div>
    );
};