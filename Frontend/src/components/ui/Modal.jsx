import * as React from 'react'
import { cn } from '@/utils/constants'

const Modal = React.forwardRef(({ className, isOpen, onClose, children, ...props }, ref) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div
        ref={ref}
        className={cn(
          'relative z-50 w-full max-w-md mx-4 bg-white rounded-lg shadow-xl',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
Modal.displayName = 'Modal'

const ModalHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}
    {...props}
  />
))
ModalHeader.displayName = 'ModalHeader'

const ModalContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  />
))
ModalContent.displayName = 'ModalContent'

const ModalTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
ModalTitle.displayName = 'ModalTitle'

const ModalDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
ModalDescription.displayName = 'ModalDescription'

export { Modal, ModalHeader, ModalContent, ModalTitle, ModalDescription }