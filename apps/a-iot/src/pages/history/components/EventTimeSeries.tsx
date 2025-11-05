import { Card, CardContent } from '@plug-atlas/ui';
import {TimeSeriesData} from "../../../services/types";

interface EventTimeSeriesProps {
    data: TimeSeriesData[];
    isLoading: boolean;
}

export default function EventTimeSeries({ data, isLoading }: EventTimeSeriesProps) {
    return (
        <Card>
            <CardContent>
                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">차트 데이터 로딩 중...</p>
                ) : data && data.length > 0 ? (
                    <div className="space-y-2">
                        {data.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {item.meta?.targetId || `데이터 ${index + 1}`}
                </span>
                                <span className="text-sm font-medium">
                  {item.timestamps ? item.timestamps.length : 0}건
                </span>
                            </div>
                        ))}
                        {data.length > 5 && (
                            <p className="text-xs text-gray-500 text-center">
                                ... 외 {data.length - 5}개 데이터
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">차트 데이터가 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}