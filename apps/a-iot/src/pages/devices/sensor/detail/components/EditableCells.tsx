import { DeviceProfile, EventCondition } from "../../../../../services/types";

interface EditableFieldKeyProps {
    value: string;
    onChange: (value: string) => void;
    profiles: DeviceProfile[];
    isEditing?: boolean;
}

export const EditableFieldKey = ({ value, onChange, profiles, isEditing = true }: EditableFieldKeyProps) => {
    // 값이 undefined나 null인 경우 빈 문자열로 처리
    const safeValue = value || '';

    return (
        <select
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            disabled={!isEditing}
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
    isEditing?: boolean;
}

export const EditableLevel = ({ value, onChange, isEditing = true }: EditableLevelProps) => {
    // 값이 undefined인 경우 기본값 설정
    const safeValue = value || 'NORMAL';

    return (
        <select
            value={safeValue}
            onChange={(e) => onChange(e.target.value as EventCondition['level'])}
            className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            disabled={!isEditing}
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
    isEditing?: boolean;
}

export const EditableConditionType = ({ value, onChange, isEditing = true }: EditableConditionTypeProps) => {
    // 값이 undefined인 경우 기본값 설정
    const safeValue = value || 'SINGLE';

    return (
        <select
            value={safeValue}
            onChange={(e) => onChange(e.target.value as EventCondition['conditionType'])}
            className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            disabled={!isEditing}
        >
            <option value="SINGLE">단일</option>
            <option value="RANGE">범위</option>
        </select>
    );
};

interface EditableConditionProps {
    row: EventCondition;
    isEditing?: boolean;
    onChange: (field: keyof EventCondition, value: any) => void;
}

export const EditableCondition = ({ row, onChange, isEditing = true }: EditableConditionProps) => {
    // 안전한 값들 설정
    const safeRow = {
        ...row,
        operator: row.operator || 'GE',
        conditionType: row.conditionType || 'SINGLE',
        thresholdValue: row.thresholdValue ?? 0,
        leftValue: row.leftValue ?? 0,
        rightValue: row.rightValue ?? 0
    };

    return (
        <div className="space-y-1">
            {safeRow.conditionType === 'SINGLE' ? (
                <div className="flex gap-1">
                    <select
                        value={safeRow.operator}
                        onChange={(e) => onChange('operator', e.target.value)}
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                        disabled={!isEditing}
                    >
                        <option value="GE">≥</option>
                        <option value="LE">≤</option>
                    </select>
                    <input
                        type="number"
                        step="0.1"
                        value={safeRow.thresholdValue || ''}
                        onChange={(e) => onChange('thresholdValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                        disabled={!isEditing}
                        placeholder="값 입력"
                    />
                </div>
            ) : (
                <div className="flex gap-1">
                    <input
                        type="number"
                        step="0.1"
                        value={safeRow.leftValue || ''}
                        onChange={(e) => onChange('leftValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="최소"
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                        disabled={!isEditing}
                    />
                    <input
                        type="number"
                        step="0.1"
                        value={safeRow.rightValue || ''}
                        onChange={(e) => onChange('rightValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="최대"
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                        disabled={!isEditing}
                    />
                </div>
            )}
        </div>
    );
};