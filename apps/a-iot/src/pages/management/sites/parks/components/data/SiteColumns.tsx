import { Site } from '../../../../../../services/types';

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
            cell: (value: any) => <div className="font-medium">{value}</div>,
        },
        {
          key: 'thumbnail' as keyof Site,
          header: '이미지',
          cell: (value: any) => <img src={value?.url || '/aiot/images/icons/map/marker.png'} className="w-12 h-12 rounded-full m-auto" alt={value?.originalFileName || 'thumbnail'}/>,
        },
        {
            key: 'description' as keyof Site,
            header: '설명',
            cell: (value: any) => (
                <div className="max-w-xs truncate text-muted-foreground">
                    {value}
                </div>
            ),
        },
        {
            key: 'createdAt' as keyof Site,
            header: '생성일',
            cell: (value: any) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(value).toLocaleDateString('ko-KR')}
                </div>
            ),
        },
    ];
}