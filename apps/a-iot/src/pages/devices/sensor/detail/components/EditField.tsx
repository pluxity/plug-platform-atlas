import { DeviceProfile, EventCondition } from "../../../../../services/types";
import {getLevelBadge, getOperatorLabel} from "../handlers/eventConditionUtils.tsx";

interface EditableFieldKeyProps {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    profiles: DeviceProfile[];
}

export const EditableFieldKey = ({ value, onChange, isEditing, profiles }: EditableFieldKeyProps) => {
    if (!isEditing) {
        return (
            <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {value}
            </div>
        );
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
            <option value="">선택하세요</option>
            {profiles.map(profile => (
                <option key={profile.fieldKey} value={profile.fieldKey}>
                    {profile.fieldKey}
                </option>
            ))}
        </select>
    );
};

interface EditableLevelProps {
    value: EventCondition['level'];
    onChange: (value: EventCondition['level']) => void;
    isEditing: boolean;
}

export const EditableLevel = ({ value, onChange, isEditing }: EditableLevelProps) => {
    if (!isEditing) {
        return getLevelBadge(value);
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as EventCondition['level'])}
            className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
            <option value="NORMAL">일반</option>
            <option value="WARNING">경고</option>
            <option value="CAUTION">주의</option>
            <option value="DANGER">위험</option>
            <option value="DISCONNECTED">연결 끊김</option>
        </select>
    );
};

interface EditableConditionTypeProps {
    value: EventCondition['conditionType'];
    onChange: (value: EventCondition['conditionType']) => void;
    isEditing: boolean;
}

export const EditableConditionType = ({ value, onChange, isEditing }: EditableConditionTypeProps) => {
    if (!isEditing) {
        return (
            <span className="text-sm text-gray-600">
                {value === 'SINGLE' ? '단일' : '범위'}
            </span>
        );
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as EventCondition['conditionType'])}
            className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
            <option value="SINGLE">단일</option>
            <option value="RANGE">범위</option>
        </select>
    );
};

interface EditableConditionProps {
    row: EventCondition;
    isEditing: boolean;
    onChange: (field: keyof EventCondition, value: any) => void;
}

export const EditableCondition = ({ row, isEditing, onChange }: EditableConditionProps) => {
    if (!isEditing) {
        return (
            <div className="text-sm">
                {row.conditionType === 'SINGLE' ? (
                    <span className="font-mono">
                        {getOperatorLabel(row.operator)} {row.thresholdValue}
                    </span>
                ) : (
                    <span className="font-mono">
                        {row.leftValue} ~ {row.rightValue}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {row.conditionType === 'SINGLE' ? (
                <div className="flex gap-1">
                    <select
                        value={row.operator}
                        onChange={(e) => onChange('operator', e.target.value)}
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                    >
                        <option value="GE">≥</option>
                        <option value="LE">≤</option>
                    </select>
                    <input
                        type="number"
                        step="0.1"
                        value={row.thresholdValue || ''}
                        onChange={(e) => onChange('thresholdValue', parseFloat(e.target.value))}
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                    />
                </div>
            ) : (
                <div className="flex gap-1">
                    <input
                        type="number"
                        step="0.1"
                        value={row.leftValue || ''}
                        onChange={(e) => onChange('leftValue', parseFloat(e.target.value))}
                        placeholder="최소"
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        step="0.1"
                        value={row.rightValue || ''}
                        onChange={(e) => onChange('rightValue', parseFloat(e.target.value))}
                        placeholder="최대"
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                    />
                </div>
            )}
        </div>
    );
};