import { Card, CardContent, CardHeader, CardTitle } from '@plug-atlas/ui';
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
        대기중: data.metrics?.pendingCnt?.values[index] || 0,
        진행중: data.metrics?.workingCnt?.values[index] || 0,
        완료: data.metrics?.completedCnt?.values[index] || 0,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">이벤트 추이</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                            dataKey="대기중"
                            fill="#dc2626"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="진행중"
                            fill="#f59e0b"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="완료"
                            fill="#16a34a"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
