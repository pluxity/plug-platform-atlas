import * as React from "react"

export interface Column<T> {
  key: keyof T
  header: string
  cell?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
}

function DataTable<T>({ data, columns, className }: DataTableProps<T>) {
  return (
    <div className={className}>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="h-12 px-4 text-left align-middle font-medium"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b">
                {columns.map((column) => (
                  <td key={String(column.key)} className="p-4 align-middle">
                    {column.cell
                      ? column.cell(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { DataTable }