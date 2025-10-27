import React, { useState, useEffect } from 'react';
import { Button } from '@plug-atlas/ui';
import { X } from 'lucide-react';
import {DeviceProfile, EventCondition} from "../../../../../services/types";


interface EventConditionFormProps {
    objectId: string;
    profiles: DeviceProfile[];
    condition?: EventCondition | null;
    onSubmit: (condition: Omit<EventCondition, 'id'>) => void;
    onClose: () => void;
}

export default function EventConditionForm({
                                               objectId,
                                               profiles,
                                               condition,
                                               onSubmit,
                                               onClose
                                           }: EventConditionFormProps) {
    const [formData, setFormData] = useState<Omit<EventCondition, 'id'>>({
        objectId,
        fieldKey: '',
        level: 'NORMAL',
        conditionType: 'SINGLE',
        operator: 'GE',
        thresholdValue: 0.1,
        leftValue: 0.1,
        rightValue: 0.1,
        booleanValue: true,
        notificationEnabled: true,
        order: 0,
        activate: true,
    });

    useEffect(() => {
        if (condition) {
            const { id, ...rest } = condition;
            setFormData(rest);
        }
    }, [condition]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleFieldChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                        {condition ? '이벤트 컨디션 수정' : '새 이벤트 컨디션'}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Field Key 선택 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field Key
                        </label>
                        <select
                            value={formData.fieldKey}
                            onChange={(e) => handleFieldChange('fieldKey', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">선택하세요</option>
                            {profiles.map(profile => (
                                <option key={profile.fieldKey} value={profile.fieldKey}>
                                    {profile.fieldKey} ({profile.description})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 레벨 선택 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            알림 레벨
                        </label>
                        <select
                            value={formData.level}
                            onChange={(e) => handleFieldChange('level', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="NORMAL">일반</option>
                            <option value="WARNING">경고</option>
                            <option value="CRITICAL">위험</option>
                        </select>
                    </div>

                    {/* 컨디션 타입 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            컨디션 타입
                        </label>
                        <select
                            value={formData.conditionType}
                            onChange={(e) => handleFieldChange('conditionType', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="SINGLE">단일 조건</option>
                            <option value="RANGE">범위 조건</option>
                        </select>
                    </div>

                    {formData.conditionType === 'SINGLE' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    연산자
                                </label>
                                <select
                                    value={formData.operator}
                                    onChange={(e) => handleFieldChange('operator', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="GE">이상 (≥)</option>
                                    <option value="LE">이하 (≤)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    임계값
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.thresholdValue || ''}
                                    onChange={(e) => handleFieldChange('thresholdValue', parseFloat(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </>
                    )}

                    {/* 범위 조건 설정 */}
                    {formData.conditionType === 'RANGE' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    최소값
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.leftValue || ''}
                                    onChange={(e) => handleFieldChange('leftValue', parseFloat(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    최대값
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.rightValue || ''}
                                    onChange={(e) => handleFieldChange('rightValue', parseFloat(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </>
                    )}

                    {/* 옵션 */}
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="activate"
                                checked={formData.activate}
                                onChange={(e) => handleFieldChange('activate', e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="activate" className="text-sm text-gray-700">
                                활성화
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="notification"
                                checked={formData.notificationEnabled}
                                onChange={(e) => handleFieldChange('notificationEnabled', e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="notification" className="text-sm text-gray-700">
                                알림 활성화
                            </label>
                        </div>
                    </div>

                    {/* 순서 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            실행 순서
                        </label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => handleFieldChange('order', parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                        />
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1">
                            {condition ? '수정' : '추가'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            취소
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}