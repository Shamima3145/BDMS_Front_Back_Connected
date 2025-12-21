import { X, Download } from 'lucide-react'
import { PDFViewer } from '@react-pdf/renderer'
import { Button } from '@components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

const PDFPreviewModal = ({ isOpen, onClose, pdfDocument, fileName, onDownload, isDownloading }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">PDF Preview</h2>
                <p className="text-sm text-gray-600">{fileName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-100">
              {pdfDocument && (
                <PDFViewer
                  width="100%"
                  height="100%"
                  showToolbar={true}
                  className="border-0"
                >
                  {pdfDocument}
                </PDFViewer>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>Preview your donation history report before downloading</p>
                <Button
                  onClick={onDownload}
                  disabled={isDownloading}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <Download size={16} className="mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default PDFPreviewModal
