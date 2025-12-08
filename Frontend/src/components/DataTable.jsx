import { useState } from 'react'
import { getStatusColor } from '@/utils/constants'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

const DataTable = ({
  data,
  columns,
  onAccept,
  onDecline,
  showActions = false,
  customActions,
  entriesPerPage = 5,
  onEntriesChange,
  onSearch,
  searchPlaceholder = 'Search...',
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const totalPages = Math.max(1, Math.ceil(filteredData.length / entriesPerPage))
  const startIndex = (currentPage - 1) * entriesPerPage
  const visibleData = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setCurrentPage(1)
    if (onSearch) onSearch(value)
  }

  const handleEntriesChange = (e) => {
    const value = Number(e.target.value)
    setCurrentPage(1)
    if (onEntriesChange) onEntriesChange(value)
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                >
                  {col.header}
                </th>
              ))}
              {(showActions || customActions) && (
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="py-3 px-6">
                    {col.accessor === 'status' ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          row[col.accessor]
                        )}`}
                      >
                        {row[col.accessor]}
                      </span>
                    ) : col.accessor === 'eligibilityStatus' ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          row[col.accessor]?.includes('✓')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {row[col.accessor]}
                      </span>
                    ) : col.accessor === 'blood' ? (
                      <span className="font-extrabold text-red-600">
                        {row[col.accessor]}
                      </span>
                    ) : (
                      <span className={col.className || ''}>
                        {row[col.accessor]}
                      </span>
                    )}
                  </td>
                ))}
                {showActions && (
                  <td className="py-3 px-6 flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => onAccept && onAccept(row)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDecline && onDecline(row)}
                    >
                      Decline
                    </Button>
                  </td>
                )}
                {customActions && (
                  <td className="py-3 px-6">
                    <div className="flex flex-col gap-2">
                      {customActions(row).map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          onClick={action.onClick}
                          className={action.className || ''}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + entriesPerPage, filteredData.length)} of{' '}
            {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select
              className="w-20  border border-gray-300 hover:border-gray-400 rounded"
              value={entriesPerPage}
              onChange={handleEntriesChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'bg-gray-600 hover:bg-gray-700' : ''}
            >
              {page}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
