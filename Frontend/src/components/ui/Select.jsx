import * as React from 'react'
import { cn } from '@/utils/constants'

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = 'Select'

const SelectOption = React.forwardRef(({ className, ...props }, ref) => (
  <option
    ref={ref}
    className={cn('relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none', className)}
    {...props}
  />
))
SelectOption.displayName = 'SelectOption'

export { Select, SelectOption }
