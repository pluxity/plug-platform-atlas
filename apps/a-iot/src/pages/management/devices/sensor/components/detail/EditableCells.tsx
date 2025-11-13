import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from '@plug-atlas/ui';
import { DeviceProfile, EventCondition } from '../../../../../../services/types';
import {
    getAvailableLevelsByProfile,
    isBooleanProfile,
    getProfileByFieldKey
} from '../../handlers/EventConditionUtils.tsx';
import { getLevelBadge } from '../../../../../main/events/utils/levelUtils.ts';

interface EditableFieldKeyProps {
    value: string;
    onChange: (value: string) => void;
    profiles: DeviceProfile[];
    isMissing?: boolean;
}

export const EditableFieldKey: React.FC<EditableFieldKeyProps> = ({
    value,
    onChange,
    profiles,
    isMissing = false
}) => {
    return (
        <div className="space-y-1">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className={isMissing ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Field Key 선택" />
                </SelectTrigger>
                <SelectContent>
                    {profiles.map((profile) => (
                        <SelectItem key={profile.fieldKey} value={profile.fieldKey}>
                            <div className="flex gap-2 items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700">{profile.description}</span>
                                    <span className="text-xs text-gray-500">{profile.fieldKey}</span>
                                    {/*<span className={`px-1.5 py-0.5 rounded text-xs font-medium ${*/}
                                    {/*    profile.fieldType === 'BOOLEAN' */}
                                    {/*        ? 'bg-purple-100 text-purple-800' */}
                                    {/*        : 'bg-blue-100 text-blue-800'*/}
                                    {/*}`}>*/}
                                    {/*    {profile.fieldType}*/}
                                    {/*</span>*/}
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

interface EditableLevelProps {
    value: EventCondition['level'];
    onChange: (value: EventCondition['level']) => void;
    profiles: DeviceProfile[];
    fieldKey: string;
}

export const EditableLevel: React.FC<EditableLevelProps> = ({
    value,
    onChange,
    profiles,
    fieldKey
}) => {
    const availableLevels = getAvailableLevelsByProfile(profiles, fieldKey);

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
    profiles: DeviceProfile[];
    fieldKey: string;
    row: EventCondition;
}

export const EditableConditionType: React.FC<EditableConditionTypeProps> = ({
    value,
    onChange,
    profiles,
    fieldKey
}) => {
    const isBoolean = isBooleanProfile(profiles, fieldKey);
    
    if (isBoolean) {
        return <div className="text-gray-400 text-sm text-center">-</div>;
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
    profiles: DeviceProfile[];
    requiredStatus?: {
        fieldKey: boolean;
        level: boolean;
        booleanValue: boolean;
        thresholdValue: boolean;
        leftValue: boolean;
        rightValue: boolean;
    };
}

const safeParseFloat = (value: string): number | undefined => {
    if (!value.trim()) return undefined;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
};

export const EditableCondition: React.FC<EditableConditionProps> = ({
    row,
    onChange,
    profiles,
    requiredStatus
}) => {
    const isBoolean = isBooleanProfile(profiles, row.fieldKey || '');

    if (isBoolean) {
        return (
            <div className="space-y-2">
                <Select
                    value={row.booleanValue !== undefined ? row.booleanValue.toString() : ''}
                    onValueChange={(value: string) => {
                        const boolValue = value === 'true';
                        onChange('booleanValue', boolValue);
                        onChange('operator', 'GE');
                        onChange('thresholdValue', boolValue ? 1 : 0);
                    }}
                >
                    <SelectTrigger className={`w-full ${requiredStatus?.booleanValue ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="값 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>True (참)</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="false">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>False (거짓)</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                
                {row.booleanValue !== undefined && (
                    <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {row.booleanValue 
                            ? `값이 True일 때 ${getLevelText(row.level)} 이벤트 발생` 
                            : `값이 False일 때 ${getLevelText(row.level)} 이벤트 발생`
                        }
                    </div>
                )}
            </div>
        );
    }

    if (row.conditionType === 'RANGE') {
        const profile = getProfileByFieldKey(profiles, row.fieldKey || '');
        const unit = profile?.fieldUnit;

        const hasRangeError = row.leftValue !== undefined && row.rightValue !== undefined &&
                             row.leftValue >= row.rightValue;

        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        step="0.01"
                        value={row.leftValue ?? ''}
                        onChange={(e) => onChange('leftValue', safeParseFloat(e.target.value))}
                        placeholder="최소값"
                        className={`w-24 text-sm ${hasRangeError || requiredStatus?.leftValue ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    <span className="text-xs text-gray-500 w-10">≤ 값 ≤</span>
                    <Input
                        type="number"
                        step="0.01"
                        value={row.rightValue ?? ''}
                        onChange={(e) => onChange('rightValue', safeParseFloat(e.target.value))}
                        placeholder="최대값"
                        className={`w-24 text-sm ${hasRangeError || requiredStatus?.rightValue ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {unit && (
                        <span className="text-xs text-gray-500 font-medium">
                            {unit}
                        </span>
                    )}
                </div>
                {hasRangeError && (
                    <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        최소값은 최대값보다 작아야 합니다
                    </div>
                )}
            </div>
        );
    }

    const profile = getProfileByFieldKey(profiles, row.fieldKey || '');
    const unit = profile?.fieldUnit;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    step="0.01"
                    value={row.thresholdValue ?? ''}
                    onChange={(e) => onChange('thresholdValue', safeParseFloat(e.target.value))}
                    placeholder="기준값"
                    className={`w-24 text-sm ${requiredStatus?.thresholdValue ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {unit && (
                    <span className="text-xs text-gray-500 font-medium">
                        {unit}
                    </span>
                )}
                <Select
                    value={row.operator || 'GE'}
                    onValueChange={(value: string) => onChange('operator', value as EventCondition['operator'])}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GE">이상</SelectItem>
                        <SelectItem value="LE">이하</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const getLevelText = (level: EventCondition['level']): string => {
    switch (level) {
        case 'NORMAL': return '정상';
        case 'CAUTION': return '주의';
        case 'WARNING': return '경고';
        case 'DANGER': return '위험';
        case 'DISCONNECTED': return '연결끊김';
        default: return level;
    }
};