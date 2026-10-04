// © Janus — yashxsanjay
import { cn } from '@/shared/utils/cn'
import type { LabelHTMLAttributes } from 'react'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-sm font-medium text-text-muted', className)}
      {...props}
    />
  )
}
