import { getLevelInfo } from '../../utils/levelUtils.ts';

interface ValueRangeIndicatorProps {
  value: number;
  minValue: number;
  maxValue: number;
  level: string;
}

export default function ValueRangeIndicator({ value, minValue, maxValue, level }: ValueRangeIndicatorProps) {
  const range = maxValue - minValue;
  const position = range > 0 ? ((value - minValue) / range) * 100 : 50;
  const clampedPosition = Math.max(0, Math.min(100, position));

  const levelInfo = getLevelInfo(level);
  let statusMessage = '';

  if (value < minValue) {
    statusMessage = `${levelInfo.text} - 임계값보다 낮음`;
  } else if (value > maxValue) {
    statusMessage = `${levelInfo.text} - 임계값 초과`;
  } else {
    statusMessage = `${levelInfo.text} - 상태 범위`;
  }

  return (
    <div className="space-y-4">
      <div className="relative px-2">
        <div className="relative h-4 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-full shadow-inner">
          <div className="absolute inset-y-0 left-0 w-1 bg-blue-700 rounded-l-full"></div>
          <div className="absolute inset-y-0 right-0 w-1 bg-red-700 rounded-r-full"></div>
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/60"></div>
        </div>

        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-3 border-gray-800 rounded-full shadow-lg z-10 transition-all duration-300"
          style={{ left: `${clampedPosition}%` }}
        >
          <div className="absolute inset-0 bg-gray-800 rounded-full animate-ping opacity-20"></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-xs font-medium text-gray-500 uppercase">최소 임계값</span>
          </div>
          <div className="text-xl font-bold text-blue-600 tabular-nums">{minValue}</div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 uppercase">최대 임계값</span>
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          </div>
          <div className="font-bold text-red-600 tabular-nums">{maxValue}</div>
        </div>
      </div>

      <div className={`mt-4 px-4 py-3 rounded-lg border ${levelInfo.color} !border-l-1 text-sm font-medium text-center`}>
        {statusMessage}
      </div>
    </div>
  );
}
