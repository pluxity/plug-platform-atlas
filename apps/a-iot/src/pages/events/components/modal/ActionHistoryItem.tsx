import React, { useState, useRef, useEffect } from 'react';
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, cn } from '@plug-atlas/ui';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ActionHistory } from '../../../../services/types';
import {
  useCreateActionHistory,
  useDeleteActionHistory,
  useEventActionHistories,
  useUpdateActionHistory,
} from '../../../../services/hooks';



interface ActionHistorySectionProps {
  eventId: number;
}

interface ActionHistoryItemProps {
  history: ActionHistory;
  eventId: number;
  onUpdate: () => void;
}

const ActionHistoryItem: React.FC<ActionHistoryItemProps> = ({ history, eventId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(history.content);

  const { trigger: updateHistory, isMutating: isUpdating } = useUpdateActionHistory(eventId);
  const { trigger: deleteHistory, isMutating: isDeleting } = useDeleteActionHistory(eventId);

  const handleUpdate = async () => {
    try {
      await updateHistory({
        id: history.id,
        data: { content: editContent }
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('조치 이력 수정 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('조치 이력을 삭제하시겠습니까?')) {
      try {
        await deleteHistory(history.id);
        onUpdate();
      } catch (error) {
        console.error('조치 이력 삭제 실패:', error);
      }
    }
  };

  return (
    <div className="group relative bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={cn(
              "w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-[color,box-shadow] outline-none",
              "focus-visible:border-blue-500 focus-visible:ring-blue-500/20 focus-visible:ring-[3px]",
              "placeholder:text-gray-400"
            )}
            rows={3}
            placeholder="조치 내용을 입력하세요..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditContent(history.content);
              }}
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={isUpdating || !editContent.trim()}
            >
              {isUpdating ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm flex-1 leading-relaxed text-gray-900">{history.content}</p>
            <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                작성자: {history.createdBy || '작성자 없음'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {history.createdAt ? new Date(history.createdAt).toLocaleString('ko-KR') : 'N/A'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

const AddActionHistoryForm: React.FC<{ eventId: number; onSuccess: () => void }> = ({ eventId, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { trigger: createHistory, isMutating } = useCreateActionHistory(eventId);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await createHistory({ content: content.trim() });
      setContent('');
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('조치 이력 추가 실패:', error);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setContent('');
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-3">
        {!isOpen && (
          <CollapsibleTrigger asChild>
            <Button
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              조치 추가
            </Button>
          </CollapsibleTrigger>
        )}

        <CollapsibleContent>
          <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  조치 내용
                </label>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="조치 내용을 입력하세요..."
                  rows={4}
                  className={cn(
                    "w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-[color,box-shadow] outline-none resize-none",
                    "focus-visible:border-blue-500 focus-visible:ring-blue-500/20 focus-visible:ring-[3px]",
                    "placeholder:text-gray-400"
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isMutating}
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isMutating || !content.trim()}
                >
                  {isMutating ? '추가 중...' : '추가'}
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default function ActionHistorySection({ eventId }: ActionHistorySectionProps) {
  const { data: histories, isLoading, mutate } = useEventActionHistories(eventId, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const handleRefresh = () => {
    mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-gray-400" />
          조치 이력
          {histories && histories.length > 0 && (
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              {histories.length}
            </span>
          )}
        </h4>
      </div>

      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">로딩 중...</div>
          </div>
        ) : histories && histories.length > 0 ? (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {histories
              .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
              .map((history) => (
                <ActionHistoryItem
                  key={history.id}
                  history={history}
                  eventId={eventId}
                  onUpdate={handleRefresh}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">조치 이력이 없습니다.</p>
          </div>
        )}
      </div>

      <AddActionHistoryForm eventId={eventId} onSuccess={handleRefresh} />
    </div>
  );
}