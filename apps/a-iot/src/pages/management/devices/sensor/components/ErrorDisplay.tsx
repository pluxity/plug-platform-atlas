import { Button } from '@plug-atlas/ui';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
  showRetryButton?: boolean;
}

export default function ErrorDisplay({ 
  onRetry, 
  title = '오류가 발생했습니다', 
  message = '데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.',
  showRetryButton = true 
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {showRetryButton && onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
      )}
    </div>
  );
}