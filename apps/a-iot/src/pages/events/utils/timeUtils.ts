import {AlertTriangle, CheckCircle, Clock, TrendingUp} from "lucide-react";

export const formatDate = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'yyyyMMddHHmmss':
      return `${year}${month}${day}${hour}${minute}${second}`;
    case 'yyyyMMddHHmm':
      return `${year}${month}${day}${hour}${minute}00`;
    default:
      return date.toString();
  }
};

export const subtractDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

export const startOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const endOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export const getTimeRange = (range: string) => {
  const now = new Date();
  let fromDate: Date;
  let toDate: Date;

  switch (range) {
    case 'today':
      fromDate = startOfDay(now);
      toDate = endOfDay(now);
      break;
    case 'yesterday':
      const yesterday = subtractDays(now, 1);
      fromDate = startOfDay(yesterday);
      toDate = endOfDay(yesterday);
      break;
    case '7days':
      fromDate = startOfDay(subtractDays(now, 7));
      toDate = endOfDay(now);
      break;
    case '30days':
      fromDate = startOfDay(subtractDays(now, 30));
      toDate = endOfDay(now);
      break;
    default:
      fromDate = startOfDay(now);
      toDate = endOfDay(now);
  }

  return {
    from: formatDate(fromDate, 'yyyyMMddHHmmss'),
    to: formatDate(toDate, 'yyyyMMddHHmmss'),
    fromForSeries: formatDate(fromDate, 'yyyyMMddHHmm'),
    toForSeries: formatDate(toDate, 'yyyyMMddHHmm'),
  };
};

export const getStatusInfo = (status: string) => {
    switch (status) {
        case 'PENDING':
            return { icon: Clock, color: 'text-yellow-600 bg-yellow-50', text: '대기중' };
        case 'WORKING':
            return { icon: TrendingUp, color: 'text-blue-600 bg-blue-50', text: '진행중' };
        case 'COMPLETED':
            return { icon: CheckCircle, color: 'text-green-600 bg-green-50', text: '완료' };
        default:
            return { icon: AlertTriangle, color: 'text-gray-600 bg-gray-50', text: '알 수 없음' };
    }
};

export const getLevelInfo = (level: string) => {
    switch (level) {
        case 'NORMAL':
            return {
                color: 'text-emerald-700 bg-emerald-50/80 border-l-4 border-emerald-500',
                text: '정상'
            };
        case 'WARNING':
            return {
                color: 'text-amber-700 bg-amber-50/80 border-l-4 border-amber-500',
                text: '경고'
            };
        case 'CAUTION':
            return {
                color: 'text-orange-700 bg-orange-50/80 border-l-4 border-orange-500',
                text: '주의'
            };
        case 'DANGER':
            return {
                color: 'text-red-700 bg-red-50/80 border-l-4 border-red-600',
                text: '위험'
            };
        case 'DISCONNECTED':
            return {
                color: 'text-purple-700 bg-purple-50/80 border-l-4 border-purple-500',
                text: '연결끊김'
            };
        default:
            return {
                color: 'text-gray-700 bg-gray-50/80 border-l-4 border-gray-400',
                text: '알 수 없음'
            };
    }
};

export const timeRangeOptions = [
    { label: '전체', value: 'all' },
    { label: '오늘', value: 'today' },
    { label: '어제', value: 'yesterday' },
    { label: '최근 7일', value: '7days' },
    { label: '최근 30일', value: '30days' },
];

export const statusOptions = [
    { label: '전체 상태', value: 'all' },
    { label: '대기중', value: 'PENDING' },
    { label: '진행중', value: 'WORKING' },
    { label: '완료', value: 'COMPLETED' },
];

export const levelOptions = [
    { label: '전체 심각도', value: 'all' },
    { label: '정상', value: 'NORMAL' },
    { label: '경고', value: 'WARNING' },
    { label: '주의', value: 'CAUTION' },
    { label: '위험', value: 'DANGER' },
    { label: '연결끊김', value: 'DISCONNECTED' },
];

export const sensorTypeOptions = [
    { label: '전체 센서', value: 'all' },
    { label: '온습도', value: 'TEMPERATURE_HUMIDITY' },
    { label: '화재', value: 'FIRE' },
    { label: '변위계', value: 'DISPLACEMENT_GAUGE' },
];

export const intervalOptions = [
    { label: '시간별', value: 'HOUR' },
    { label: '일별', value: 'DAY' },
    { label: '주별', value: 'WEEK' },
    { label: '월별', value: 'MONTH' },
];

export const formatTimestampByInterval = (timestamp: string, interval: string): string => {
    switch (interval) {
        case 'HOUR':
            // Keep as is
            return timestamp;

        case 'DAY':
            // Format: "2025-11-01" -> keep as is
            return timestamp;

        case 'WEEK':
            // Format: "2025-42" -> "10월 2째주"
            if (timestamp.includes('-')) {
                const parts = timestamp.split('-');
                if (parts.length === 2 && parts[0] && parts[1]) {
                    const year = parts[0];
                    const weekStr = parts[1];
                    const weekNum = parseInt(weekStr);

                    // Calculate the date of the first day of this week
                    const jan1 = new Date(parseInt(year), 0, 1);
                    const daysToFirstMonday = (8 - jan1.getDay()) % 7;
                    const firstMonday = new Date(parseInt(year), 0, 1 + daysToFirstMonday);
                    const weekDate = new Date(firstMonday.getTime() + (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);

                    const month = weekDate.getMonth() + 1;
                    const weekOfMonth = Math.ceil(weekDate.getDate() / 7);

                    const weekLabels = ['', '1', '2', '3', '4', '5'];
                    return `${month}월 ${weekLabels[weekOfMonth]}째주`;
                }
            }
            return timestamp;

        case 'MONTH':
            // Format: "2025-10" -> "11월"
            if (timestamp.includes('-')) {
                const parts = timestamp.split('-');
                if (parts.length === 2 && parts[1]) {
                    const month = parseInt(parts[1]);
                    return `${month}월`;
                }
            }
            return timestamp;

        default:
            return timestamp;
    }
};
