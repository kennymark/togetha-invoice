import EmailLayout from '#emails/layout'
import { Button, Heading, Text } from '@react-email/components'

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
    <EmailLayout preview={`Invoice #${invoiceNumber} from ${companyName}`}>
      <Heading style={{ color: '#007291', marginBottom: '24px' }}>Invoice #{invoiceNumber}</Heading>

      <Text style={{ marginBottom: '16px' }}>Dear {recipientName},</Text>

      <Text style={{ marginBottom: '24px' }}>
        Please find attached the invoice for your recent transaction. The payment is due by{' '}
        {dueDate}.
      </Text>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Text style={{ marginBottom: '8px', fontWeight: 'bold' }}>From:</Text>
          <Text style={{ marginBottom: '4px' }}>{companyName}</Text>
          <Text style={{ marginBottom: '16px' }}>{companyAddress}</Text>
        </div>
        <div>
          <Text style={{ marginBottom: '8px', fontWeight: 'bold' }}>Invoice Details:</Text>
          <Text style={{ marginBottom: '4px' }}>Date: {invoiceDate}</Text>
          <Text style={{ marginBottom: '4px' }}>Due Date: {dueDate}</Text>
          <Text style={{ marginBottom: '4px' }}>Invoice #: {invoiceNumber}</Text>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 'bold' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 'bold' }}>Quantity</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 'bold' }}>Unit Price</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 'bold' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={`${item.description}-${item.amount}`}
              style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 0' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '8px 0' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '8px 0' }}>{item.unitPrice}</td>
              <td style={{ textAlign: 'right', padding: '8px 0' }}>{item.amount}</td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={3}
              style={{ textAlign: 'right', padding: '16px 8px 0 0', fontWeight: 'bold' }}>
              Total:
            </td>
            <td style={{ textAlign: 'right', padding: '16px 0 0 0', fontWeight: 'bold' }}>
              {currency} {amount}
            </td>
          </tr>
        </tbody>
      </table>

      <Button
        href={paymentUrl}
        style={{
          background: '#007291',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '24px',
        }}>
        Pay Now
      </Button>

      <Text style={{ fontSize: '14px', color: '#666' }}>
        If you have any questions about this invoice, please don't hesitate to contact us.
      </Text>
    </EmailLayout>
  )
}
