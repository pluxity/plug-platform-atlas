import * as React from "react"
import { cn } from "../../lib/utils"

export interface Column<T> {
  key: keyof T
  header: string
  cell?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
  onRowClick?: (row: T, index: number) => void
  onRowEdit?: (row: T, index: number) => void
  onRowDelete?: (row: T, index: number) => void
  selectable?: boolean
  selectedRows?: number[]
  onSelectionChange?: (selectedIndexes: number[]) => void
  getRowId?: (row: T, index: number) => string
}

function DataTable<T>({
  data,
  columns,
  className,
  onRowClick,
  onRowEdit,
  onRowDelete,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId,
}: DataTableProps<T>) {
  const hasActions = onRowEdit || onRowDelete

  const handleSelectRow = (index: number) => {
    if (!onSelectionChange) return

    const isSelected = selectedRows.includes(index)
    if (isSelected) {
      onSelectionChange(selectedRows.filter(i => i !== index))
    } else {
      onSelectionChange([...selectedRows, index])
    }
  }

  const handleSelectAll = () => {
    if (!onSelectionChange) return

    if (selectedRows.length === data.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(data.map((_, i) => i))
    }
  }

  return (
    <div className={className}>
      <div className="rounded-md border border-[#bbbecf]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#bbbecf] bg-[#dfe4eb]">
              {selectable && (
                <th className="h-12 px-4 text-center align-middle font-medium w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="h-12 px-4 text-center align-middle font-medium text-muted-foreground"
                >
                  {column.header}
                </th>
              ))}
              {hasActions && (
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                  액션
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const rowId = getRowId ? getRowId(row, index) : String(index)
              const isSelected = selectedRows.includes(index)

              return (
                <tr
                  key={rowId}
                  className={cn(
                    "border-b border-[#bbbecf] transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    isSelected && "bg-primary-50"
                  )}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selectable && (
                    <td className="p-4 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleSelectRow(index)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={String(column.key)} className="p-4 text-center align-middle">
                      {column.cell
                        ? column.cell(row[column.key], row)
                        : String(row[column.key])}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        {onRowEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRowEdit(row, index)
                            }}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
                            title="수정"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </button>
                        )}
                        {onRowDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRowDelete(row, index)
                            }}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-error-50 hover:text-error-600 h-8 w-8"
                            title="삭제"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { DataTable }