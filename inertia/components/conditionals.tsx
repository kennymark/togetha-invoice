interface ConditionalProps {
  condition: boolean
  children: React.ReactNode
}

export function OnlyShowIf({ condition, children }: ConditionalProps) {
  if (!condition) return null
  return <>{children}</>
}

export function DontShowIf({ condition, children }: ConditionalProps) {
  if (condition) return null
  return <>{children}</>
}
