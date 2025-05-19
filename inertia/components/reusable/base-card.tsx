import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import type { ReactNode } from 'react'

interface BaseCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function BaseCard({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
}: BaseCardProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className={cn(headerClassName)}>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn(contentClassName)}>{children}</CardContent>
    </Card>
  )
}
