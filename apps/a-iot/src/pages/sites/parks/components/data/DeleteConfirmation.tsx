import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@plug-atlas/ui';

interface DeleteConfirmationProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    itemName: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function DeleteConfirmation({
                                               isOpen,
                                               onOpenChange,
                                               itemName,
                                               onConfirm,
                                               isLoading = false
                                           }: DeleteConfirmationProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>공원 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                        정말로 "{itemName}" 공원을 삭제하시겠습니까?
                        이 작업은 되돌릴 수 없습니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isLoading}
                    >
                        {isLoading ? '삭제 중...' : '삭제'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}