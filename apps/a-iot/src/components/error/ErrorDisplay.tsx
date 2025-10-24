import { Button } from '@plug-atlas/ui';

interface ErrorDisplayProps {
    onRetry: () => void;
}

export default function ErrorDisplay({ onRetry }: ErrorDisplayProps) {
    return (
        <div className="p-6">
            <div className="text-center">
                <p className="text-destructive">데이터를 불러오는 중 오류가 발생했습니다.</p>
                <Button onClick={onRetry} className="mt-4">
                    다시 시도
                </Button>
            </div>
        </div>
    );
}