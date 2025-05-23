import React from 'react'
import { EmailColumn, EmailRow, EmailText, EmailContainer } from '#emails/layout/layout'
import {
  baseCellStyle,
  baseHeaderStyle,
  baseTableStyle,
  colors,
  mergeStyles,
} from '#emails/layout/styles'

interface EmailInfoProps {
  title: string
  content?: string
  children?: React.ReactNode
}

export function EmailInfo({ title, content, children }: EmailInfoProps) {
  return (
    <EmailContainer style={{ margin: '0px' }}>
      <EmailText
        compact
        style={{
          fontSize: '14px',
          color: colors.text.secondary,
          fontWeight: '500',
          marginBottom: '4px',
        }}>
        {title}
      </EmailText>
      {children ?? (
        <EmailText
          compact
          style={{
            minWidth: '150px',
            fontSize: '14px',
            fontWeight: '600',
            color: colors.text.primary,
          }}>
          {content || 'N/A'}
        </EmailText>
      )}
    </EmailContainer>
  )
}

interface GriderProps {
  children: React.ReactNode
  spacing?: number
  col?: number
  mb?: number
  style?: React.CSSProperties
}

export function EmailGrider({ children, spacing = 6, col = 2, mb = 6, style }: GriderProps) {
  const childrenArray = React.Children.toArray(children)
  const rows: React.ReactElement[] = []

  for (let i = 0; i < childrenArray.length; i += col) {
    const rowChildren = childrenArray.slice(i, i + col)
    rows.push(
      <EmailRow key={i} style={{ marginBottom: `${mb}px`, ...style }}>
        {rowChildren.map((child, index) => (
          <EmailColumn
            key={React.isValidElement(child) ? child.key : index}
            style={{
              width: `${100 / col}%`,
              padding: `${spacing / 2}px`,
            }}>
            {child}
          </EmailColumn>
        ))}
      </EmailRow>,
    )
  }

  return <>{rows}</>
}

interface EmailTableProps<T extends string> {
  columns: { header: string; key: T; width?: string }[]
  data: Record<T, any>[]
  style?: React.CSSProperties
  headerStyle?: React.CSSProperties
  cellStyle?: React.CSSProperties
}

export function EmailTable<T extends string>({
  columns,
  data,
  style,
  headerStyle,
  cellStyle,
}: EmailTableProps<T>) {
  const mergedHeaderStyle = mergeStyles(baseHeaderStyle, headerStyle)

  return (
    <table style={mergeStyles(baseTableStyle, style)}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} style={{ ...mergedHeaderStyle, width: column.width }}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={`${rowIndex}-${column.key}`} style={mergeStyles(baseCellStyle, cellStyle)}>
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
