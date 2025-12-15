import { useState } from 'react'
import { getStatusColor } from '@/utils/constants'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Check, X } from 'lucide-react'

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
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed min-w-[640px]">
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
              <tr key={rowIdx} className="bg-white border-b border-gray-200">
                {columns.map((col, colIdx) => {
                  const value = col.render ? col.render(row[col.accessor]) : row[col.accessor]
                  const displayValue = typeof value === 'string' && value.includes('|') 
                    ? value.split('|') 
                    : value
                  
                  return (
                    <td key={colIdx} className="py-3 px-6 break-words">
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
                      ) : Array.isArray(displayValue) ? (
                        <div className="flex flex-col">
                          {displayValue.map((line, idx) => (
                            <span key={idx} className={col.className || ''}>
                              {line}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className={col.className || ''}>
                          {displayValue}
                        </span>
                      )}
                    </td>
                  )
                })}
                {showActions && (
                  <td className="py-3 px-6 flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 p-2"
                      onClick={() => onAccept && onAccept(row)}
                      title="Accept"
                    >
                      <Check size={18} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="p-2"
                      onClick={() => onDecline && onDecline(row)}
                      title="Decline"
                    >
                      <X size={18} />
                    </Button>
                  </td>
                )}
                {customActions && (
                  <td className="py-3 px-6">
                    <div className="flex gap-2">
                      {customActions(row).map((action, idx) => {
                        const Icon = action.icon
                        return (
                          <button
                            key={idx}
                            onClick={action.onClick}
                            className={action.className || 'p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl'}
                            title={action.title || action.label}
                            disabled={action.disabled}
                          >
                            {Icon ? <Icon size={20} /> : action.label}
                          </button>
                        )
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + entriesPerPage, filteredData.length)} of{' '}
            {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">Show</span>
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
            <span className="text-sm text-gray-600 hidden sm:inline">entries</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-xs md:text-sm"
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => setCurrentPage(page)}
              className={`text-xs md:text-sm ${currentPage === page ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
            >
              {page}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-xs md:text-sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
