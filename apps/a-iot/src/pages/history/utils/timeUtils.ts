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

export const timeRangeOptions = [
    { label: '오늘', value: 'today' },
    { label: '어제', value: 'yesterday' },
    { label: '최근 7일', value: '7days' },
    { label: '최근 30일', value: '30days' },
];

export const statusOptions = [
    { label: '전체', value: 'all' },
    { label: '대기중', value: 'PENDING' },
    { label: '진행중', value: 'WORKING' },
    { label: '완료', value: 'COMPLETED' },
];

export const intervalOptions = [
    { label: '시간별', value: 'HOUR' },
    { label: '일별', value: 'DAY' },
    { label: '주별', value: 'WEEK' },
    { label: '월별', value: 'MONTH' },
];
