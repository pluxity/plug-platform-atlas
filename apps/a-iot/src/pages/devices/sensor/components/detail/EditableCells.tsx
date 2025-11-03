import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from '@plug-atlas/ui';
import { DeviceProfile, EventCondition } from '../../../../../services/types';
import {
    getOperatorLabel,
    getLevelBadge,
    getAvailableLevelsByProfile,
    isBooleanProfile,
    getProfileByFieldKey
} from '../../handlers/EventConditionUtils';

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
        const profile = getProfileByFieldKey(profiles, value);
        return (
            <div className="space-y-1">
                <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {value}
                </div>
                {profile && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>{profile.description}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            profile.fieldType === 'BOOLEAN' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {profile.fieldType}
                        </span>
                    </div>
                )}
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
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">{profile.fieldKey}</span>
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                    profile.fieldType === 'BOOLEAN' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {profile.fieldType}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 mt-0.5">
                                {profile.description}
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
                                <span className="text-xs text-gray-500">(True 상태용)</span>
                            )}
                            {isBoolean && level === 'DANGER' && (
                                <span className="text-xs text-gray-500">(False 상태용)</span>
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
    onChange: (field: keyof EventCondition, value: any) => void;
    isEditing: boolean;
    profiles: DeviceProfile[];
    fieldKey: string;
    row: EventCondition;
}

export const EditableConditionType: React.FC<EditableConditionTypeProps> = ({
    value,
    onChange,
    isEditing,
    profiles,
    fieldKey
}) => {
    const isBoolean = isBooleanProfile(profiles, fieldKey);
    
    // Boolean 타입의 경우 타입 컬럼 숨김
    if (isBoolean) {
        return <div className="text-gray-400 text-sm text-center">-</div>;
    }
    
    // 숫자형 타입의 경우
    if (!isEditing) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {value === 'SINGLE' ? '단일' : '범위'}
            </span>
        );
    }

    return (
        <Select value={value || 'SINGLE'} onValueChange={(value: string) => onChange('conditionType', value as EventCondition['conditionType'])}>
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

    if (isBoolean) {
        return <div className="text-gray-400 text-sm text-center">-</div>;
    }

    if (!isEditing) {
        if (row.conditionType === 'RANGE') {
            const profile = getProfileByFieldKey(profiles, row.fieldKey);
            const unit = profile?.fieldUnit ? ` ${profile.fieldUnit}` : '';
            
            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {row.leftValue}{unit} ~ {row.rightValue}{unit}
                    </div>
                    <div className="text-xs text-gray-500">범위 조건</div>
                </div>
            );
        }

        const profile = getProfileByFieldKey(profiles, row.fieldKey);
        const unit = profile?.fieldUnit ? ` ${profile.fieldUnit}` : '';

        return (
            <div className="text-sm">
                <div className="font-medium">
                    {getOperatorLabel(row.operator || 'GE')} {row.thresholdValue}{unit}
                </div>
                <div className="text-xs text-gray-500">단일 조건</div>
            </div>
        );
    }

    if (row.conditionType === 'RANGE') {
        const profile = getProfileByFieldKey(profiles, row.fieldKey);
        const unit = profile?.fieldUnit;

        return (
            <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">범위 조건</div>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        step="0.01"
                        value={row.leftValue ?? ''}
                        onChange={(e) => onChange('leftValue', parseFloat(e.target.value) || undefined)}
                        placeholder="최소값"
                        className="w-20 text-sm"
                    />
                    <span className="text-xs text-gray-500">≤ 값 ≤</span>
                    <Input
                        type="number"
                        step="0.01"
                        value={row.rightValue ?? ''}
                        onChange={(e) => onChange('rightValue', parseFloat(e.target.value) || undefined)}
                        placeholder="최대값"
                        className="w-20 text-sm"
                    />
                    {unit && (
                        <span className="text-xs text-gray-500 font-medium">
                            {unit}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    const profile = getProfileByFieldKey(profiles, row.fieldKey);
    const unit = profile?.fieldUnit;

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
                        <SelectItem value="GE">≥ (이상)</SelectItem>
                        <SelectItem value="LE">≤ (이하)</SelectItem>
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
                {unit && (
                    <span className="text-xs text-gray-500 font-medium">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
};