import React from "react"

const Table = ({
  columns,
  renderRow,
  data
}: {
  columns: { header: string, accessor: string, className?: string }[]
  renderRow: (item: any) => React.ReactNode
  data: any[]
}) => {
  return (
    <div className="w-full mt-4 overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((column) => (
              <th key={column.accessor} className={`px-4 py-3 ${column.className || ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item) => renderRow(item))}</tbody>
      </table>
    </div>
  )
}

export default Table

