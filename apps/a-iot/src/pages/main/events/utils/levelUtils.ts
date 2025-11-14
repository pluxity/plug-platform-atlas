import React from 'react';

export type EventLevel = 'NORMAL' | 'CAUTION' | 'WARNING' | 'DANGER' | 'DISCONNECTED';

export interface LevelConfig {
    label: string;
    text: string;
    color: string;
    badgeColor: string;
    dashboardBg: string;
    dashboardText: string;
    dashboardDot: string;
}

const levelConfigMap: Record<EventLevel, LevelConfig> = {
    NORMAL: {
        label: '정상',
        text: '정상',
        color: 'text-emerald-700 bg-emerald-50/80 border-l-4 border-emerald-500',
        badgeColor: 'bg-green-100 text-green-800',
        dashboardBg: 'bg-green-100',
        dashboardText: 'text-green-700',
        dashboardDot: 'bg-green-700'
    },
    CAUTION: {
        label: '주의',
        text: '주의',
        color: 'text-yellow-400 bg-amber-50 border-l-4 border-orange-500',
        badgeColor: 'bg-amber-50 text-yellow-400',
        dashboardBg: 'bg-amber-50',
        dashboardText: 'text-yellow-400',
        dashboardDot: 'bg-yellow-400'
    },
    WARNING: {
        label: '경고',
        text: '경고',
        color: 'text-orange-600 bg-orange-50 border-l-4 border-amber-500',
        badgeColor: 'bg-orange-50 text-orange-600',
        dashboardBg: 'bg-orange-50',
        dashboardText: 'text-orange-600',
        dashboardDot: 'bg-orange-600'
    },
    DANGER: {
        label: '위험',
        text: '위험',
        color: 'text-red-700 bg-red-50/80 border-l-4 border-red-600',
        badgeColor: 'bg-red-100 text-red-800',
        dashboardBg: 'bg-rose-100',
        dashboardText: 'text-red-700',
        dashboardDot: 'bg-red-700'
    },
    DISCONNECTED: {
        label: '연결끊김',
        text: '연결끊김',
        color: 'text-purple-700 bg-purple-50/80 border-l-4 border-purple-500',
        badgeColor: 'bg-gray-100 text-gray-800',
        dashboardBg: 'bg-indigo-100',
        dashboardText: 'text-blue-700',
        dashboardDot: 'bg-blue-700'
    }
};


export const getLevelInfo = (level: string): LevelConfig => {
    const config = levelConfigMap[level as EventLevel];
    if (config) return config;

    return {
        label: '알 수 없음',
        text: '알 수 없음',
        color: 'text-gray-700 bg-gray-50/80 border-l-4 border-gray-400',
        badgeColor: 'bg-gray-100 text-gray-800',
        dashboardBg: 'bg-gray-100',
        dashboardText: 'text-gray-600',
        dashboardDot: 'bg-gray-400'
    };
};

export const getLevelBadgeStyle = (level: string): string => {
    return getLevelInfo(level).badgeColor;
};

export const getLevelBadge = (level: string): React.ReactNode => {
    const config = getLevelInfo(level);

    return React.createElement(
        'span',
        {
            className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeColor}`
        },
        config.label
    );
};

export const getDashboardLevelStyle = (level: string) => {
    const config = getLevelInfo(level);
    return {
        bg: config.dashboardBg,
        text: config.dashboardText,
        dot: config.dashboardDot
    };
};

export const levelOptions = [
    { label: '전체 심각도', value: 'all' },
    { label: '정상', value: 'NORMAL' },
    { label: '주의', value: 'CAUTION' },
    { label: '경고', value: 'WARNING' },
    { label: '위험', value: 'DANGER' },
    { label: '연결끊김', value: 'DISCONNECTED' },
];
