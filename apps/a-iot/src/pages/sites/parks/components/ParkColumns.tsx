import { Button } from '@plug-atlas/ui';
import { Edit, Trash2 } from 'lucide-react';
import { Site } from '../../../../services/hooks/park/parkType';

export function createParkColumns(
    onEdit: (park: Site) => void,
    onDelete: (park: Site) => void,
    isUpdating: boolean,
    isDeleting: boolean
) {
    return [
        {
            key: 'id',
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }: any) => <div className="font-medium">{row.getValue('id')}</div>,
        },
        {
            key: 'name',
            accessorKey: 'name',
            header: '공원명',
            cell: ({ row }: any) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            key: 'description',
            accessorKey: 'description',
            header: '설명',
            cell: ({ row }: any) => (
                <div className="max-w-xs truncate text-muted-foreground">
                    {row.getValue('description')}
                </div>
            ),
        },
        {
            key: 'location',
            accessorKey: 'location',
            header: '위치',
            cell: ({ row }: any) => (
                <div className="max-w-xs truncate text-muted-foreground">
                    {row.getValue('location')}
                </div>
            ),
        },
        {
            key: 'createdAt',
            accessorKey: 'createdAt',
            header: '생성일',
            cell: ({ row }: any) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.getValue('createdAt')).toLocaleDateString('ko-KR')}
                </div>
            ),
        },
        {
            key: 'actions',
            id: 'actions',
            header: '작업',
            cell: ({ row }: any) => {
                const park = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(park)}
                            className="h-8 w-8 p-0"
                            disabled={isUpdating}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(park)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
}