import { cn } from '~/lib/utils'

export default function StatsGrider({
  children,
  cols = 2,
}: { children: React.ReactNode; cols?: 2 | 3 }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 mb-2',
        cols === 2 && 'md:grid-cols-2',
        cols === 3 && 'xl:grid-cols-3',
      )}>
      {children}
    </div>
  )
}
