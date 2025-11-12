import { Card, CardContent } from '@plug-atlas/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from "../../../services/types";
import { formatTimestampByInterval } from '../utils/timeUtils';
import type { EventCollectInterval } from '../../../services/types';

interface EventTimeSeriesProps {
    data: TimeSeriesData | null;
    isLoading: boolean;
    interval: EventCollectInterval;
}

export default function EventTimeSeries({ data, isLoading, interval }: EventTimeSeriesProps) {
    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-8">
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-sm text-gray-500">차트 데이터 로딩 중...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || !data.timestamps || data.timestamps.length === 0) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-gray-500">차트 데이터가 없습니다.</p>
                </CardContent>
            </Card>
        );
    }

    const chartData = data.timestamps.map((timestamp, index) => ({
        timestamp: formatTimestampByInterval(timestamp, interval),
        미조치: data.metrics?.activeCnt?.values[index] || 0,
        진행중: data.metrics?.inProgressCnt?.values[index] || 0,
        완료: data.metrics?.resolvedCnt?.values[index] || 0,
    }));

    return (
        <Card>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="timestamp"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '14px' }}
                        />
                        <Bar
                            dataKey="미조치"
                            stackId="stack"
                            fill="#dc2626"
                        />
                        <Bar
                            dataKey="진행중"
                            stackId="stack"
                            fill="#f59e0b"
                        />
                        <Bar
                            dataKey="완료"
                            stackId="stack"
                            fill="#16a34a"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
