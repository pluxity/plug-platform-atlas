import { useState } from 'react';
import type { Site } from '../../../../../../services/types';
import type { FileResponse } from '@plug-atlas/types';
import { Skeleton } from "@plug-atlas/ui";

function ThumbnailCell({ value }: { value: Site[keyof Site] }) {
  const thumbnail = value as FileResponse | null;
  const [hasError, setHasError] = useState(false);

  if (hasError || !thumbnail) {
    return (
      <div className="flex justify-center">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    );
  }

  return (
    <img
      src={thumbnail?.url}
      className="w-12 h-12 rounded-full m-auto"
      alt={thumbnail?.originalFileName ?? 'thumbnail'}
      onError={() => setHasError(true)}
    />
  );
}

export function createSiteColumns(
) {
    return [
        {
            key: 'id' as keyof Site,
            header: 'ID',
            cell: (value: Site[keyof Site]) => <div className="font-medium">{String(value)}</div>,
        },
        {
            key: 'name' as keyof Site,
            header: '공원명',
            cell: (value: Site[keyof Site]) => <div className="font-medium">{String(value)}</div>,
        },
        {
          key: 'thumbnail' as keyof Site,
          header: '이미지',
          cell: (value: Site[keyof Site]) => <ThumbnailCell value={value} />,
        },
        {
            key: 'description' as keyof Site,
            header: '설명',
            cell: (value: Site[keyof Site]) => (
                <div className="max-w-xs truncate text-muted-foreground">
                    {String(value)}
                </div>
            ),
        },
        {
            key: 'createdAt' as keyof Site,
            header: '생성일',
            cell: (value: Site[keyof Site]) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(String(value)).toLocaleDateString('ko-KR')}
                </div>
            ),
        },
    ];
}