import {
  EmailButton,
  EmailHeading,
  EmailSection,
  EmailText,
  EmailWrapper,
} from '#emails/layout/layout'
import { EmailTable } from '#emails/layout/custom-components'
import { formatCurrency, formatDate } from '#emails/layout/globals'

interface InvoiceEmailProps {
  recipientName: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  amount: string
  currency: string
  paymentUrl: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: string
    amount: string
  }>
  companyName: string
  companyAddress: string
}

export default function InvoiceEmail({
  recipientName,
  invoiceNumber,
  invoiceDate,
  dueDate,
  amount,
  currency,
  paymentUrl,
  items,
  companyName,
  companyAddress,
}: InvoiceEmailProps) {
  return (
    <EmailWrapper preview={`Invoice #${invoiceNumber} from ${companyName}`}>
      <EmailHeading>Invoice #{invoiceNumber}</EmailHeading>

      <EmailText>Dear {recipientName},</EmailText>

      <EmailText>
        Please find attached the invoice for your recent transaction. The payment is due by{' '}
        {formatDate(dueDate)}.
      </EmailText>

      <div style={{ display: 'flex', gap: '24px', justifyContent: 'space-between' }}>
        <EmailSection>
          <EmailText bold>From:</EmailText>
          <EmailText compact>{companyName}</EmailText>
          <EmailText compact>{companyAddress}</EmailText>
        </EmailSection>
        <EmailSection>
          <EmailText bold>Invoice Details:</EmailText>
          <EmailText compact>Date: {formatDate(invoiceDate)}</EmailText>
          <EmailText compact>Due Date: {formatDate(dueDate)}</EmailText>
          <EmailText compact>Invoice #: {invoiceNumber}</EmailText>
        </EmailSection>
      </div>

      <EmailTable
        columns={[
          { header: 'Description', key: 'description', width: '45%' },
          { header: 'Quantity', key: 'quantity', width: '15%' },
          { header: 'Unit Price', key: 'unitPrice', width: '20%' },
          { header: 'Amount', key: 'amount', width: '20%' },
        ]}
        data={[
          ...items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: formatCurrency(item.unitPrice, currency),
            amount: formatCurrency(item.amount, currency),
          })),
          {
            description: 'Total:',
            quantity: '',
            unitPrice: '',
            amount: formatCurrency(amount, currency),
          },
        ]}
        style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}
      />

      <EmailButton href={paymentUrl}>Pay Now</EmailButton>

      <EmailText>
        If you have any questions about this invoice, please don't hesitate to contact us.
      </EmailText>
    </EmailWrapper>
  )
}
