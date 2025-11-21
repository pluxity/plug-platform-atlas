import React from 'react';
import {AlertTriangle, CheckCircle, Clock, TrendingUp} from "lucide-react";

// ==================== 상태(Status) 관련 유틸리티 ====================

export type EventStatus = 'ACTIVE' | 'IN_PROGRESS' | 'RESOLVED';

export interface StatusConfig {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    text: string;
    badgeColor: string;
}

// 상태별 설정
const statusConfigMap: Record<EventStatus, StatusConfig> = {
    ACTIVE: {
        icon: Clock,
        color: 'text-yellow-600 bg-yellow-50',
        text: '미조치',
        badgeColor: 'bg-red-100 text-red-800 border-l-4 border-red-600'
    },
    IN_PROGRESS: {
        icon: TrendingUp,
        color: 'text-blue-600 bg-blue-50',
        text: '진행중',
        badgeColor: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600'
    },
    RESOLVED: {
        icon: CheckCircle,
        color: 'text-green-600 bg-green-50',
        text: '완료',
        badgeColor: 'bg-green-100 text-green-800 border-l-4 border-green-600'
    }
};

/**
 * 상태 정보를 가져옵니다
 * @param status - 이벤트 상태
 * @returns 상태 설정 객체 (icon, color, text, badgeColor)
 */
export const getStatusInfo = (status: string): StatusConfig => {
    const config = statusConfigMap[status as EventStatus];
    if (config) return config;

    // 알 수 없는 상태
    return {
        icon: AlertTriangle,
        color: 'text-gray-600 bg-gray-50',
        text: '알 수 없음',
        badgeColor: 'bg-gray-100 text-gray-800 border-l-4 border-gray-400'
    };
};

/**
 * 상태 뱃지 스타일을 가져옵니다 (Dashboard용)
 * @param status - 이벤트 상태
 * @returns Tailwind CSS 클래스 문자열
 */
export const getStatusBadgeStyle = (status: string): string => {
    return getStatusInfo(status).badgeColor;
};

export const statusOptions = [
    { label: '전체 상태', value: 'all' },
    { label: '미조치', value: 'ACTIVE' },
    { label: '진행중', value: 'IN_PROGRESS' },
    { label: '완료', value: 'RESOLVED' },
];
