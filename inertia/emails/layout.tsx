import { Body, Container, Head, Html, Preview, Tailwind } from '@react-email/components'
import type * as React from 'react'

interface EmailLayoutProps {
  preview?: string
  children: React.ReactNode
}

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={{ background: '#f6f9fc', fontFamily: 'system-ui, sans-serif, serif' }}>
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  brand: '#007291',
                },
              },
            },
          }}>
          <Container style={{ background: '#fff', padding: '32px', borderRadius: '8px', maxWidth: 480 }}>{children}</Container>
        </Tailwind>
      </Body>
    </Html>
  )
}
