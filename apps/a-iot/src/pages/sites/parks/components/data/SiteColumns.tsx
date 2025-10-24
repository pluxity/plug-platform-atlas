import { Site } from '../../../../../services/types/site/site';

export function createSiteColumns(
) {
    return [
        {
            key: 'id' as keyof Site,
            header: 'ID',
            cell: (value: Site[keyof Site]) => <div className="font-medium">{value}</div>,
        },
        {
            key: 'name' as keyof Site,
            header: '공원명',
            cell: (value: any) => <div className="font-medium">{value}</div>,
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
            key: 'location' as keyof Site,
            header: '위치',
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