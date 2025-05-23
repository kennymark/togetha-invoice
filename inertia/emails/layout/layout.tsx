import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { baseStyles, footerStyles, mergeStyles } from '#emails/layout/styles'
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react'
import { appUrl } from '#emails/layout/globals'

// Reusable components
export function EmailWrapper({
  children,
  style,
  noFooterMargin = false,
  preview,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  noFooterMargin?: boolean
  preview?: string
}) {
  return (
    <Html lang='en'>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,200..800&display=swap'
          rel='stylesheet'
        />
      </Head>
      {preview && <Preview>{preview}</Preview>}
      <Body style={baseStyles.body}>
        <Container style={mergeStyles(baseStyles.baseContainer, style)}>
          <Logo />
          {children}
          <Footer noMargin={noFooterMargin} />
        </Container>
      </Body>
    </Html>
  )
}

function Logo() {
  return (
    <Container
      style={{
        height: '43px',
        width: '116px',
        margin: '0px',
        marginBottom: '29px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(263.02deg, rgba(58, 101, 171, 0.2) 0%, rgba(10, 174, 205, 0.2) 100%)',
      }}>
      <Img
        src={'https://togetha.co.uk/logo/togetha-fill-black-alt.svg'}
        alt='Togetha Logo'
        height={'25px'}
      />
    </Container>
  )
}

function Footer({ noMargin = false }: { noMargin?: boolean }) {
  return (
    <EmailSection
      style={mergeStyles(footerStyles.footer, { marginTop: noMargin ? '0px' : '57px' })}>
      <EmailContainer style={footerStyles.container}>
        <EmailText style={footerStyles.text}>
          <EmailLink href={appUrl} style={footerStyles.link}>
            togetha
          </EmailLink>
          {'  '}
          is a property of Moradia LTD, Moradia Ltd, Company Number 14769293 The Registrar of
          Companies for England and Wales, 1st Floor, 86-90 Paul Street, London, EC2A 4NE ©{' '}
          {new Date().getFullYear()} Togetha. All rights reserved.
        </EmailText>
      </EmailContainer>
    </EmailSection>
  )
}

export function EmailSignature() {
  return (
    <EmailContainer style={{ display: 'flex', flexDirection: 'column', margin: '0px' }}>
      <EmailText style={{ marginBottom: '0px', margin: '0px' }}>Best regards,</EmailText>
      <EmailText style={{ marginBottom: '0px', margin: '0px' }}>The togetha Team</EmailText>
    </EmailContainer>
  )
}

export function EmailContainer({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return <Container style={style}>{children}</Container>
}

export function EmailHeading({
  children,
  style,
  compact = false,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  compact?: boolean
}) {
  return (
    <Heading
      style={mergeStyles(baseStyles.heading, {
        ...style,
        ...(compact ? { margin: 0, marginBottom: 0 } : {}),
      })}>
      {children}
    </Heading>
  )
}

export function EmailSubheading({
  children,
  style,
  compact = false,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  compact?: boolean
}) {
  return (
    <Heading
      style={mergeStyles(baseStyles.subheading, {
        ...style,
        ...(compact ? { margin: 0, marginBottom: 0 } : {}),
      })}>
      {children}
    </Heading>
  )
}

export function EmailText({
  children,
  style,
  compact = false,
  bold = false,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  compact?: boolean
  bold?: boolean
}) {
  return (
    <Text
      style={mergeStyles(baseStyles.text, {
        ...style,
        ...(compact ? { marginTop: 0 } : {}),
        ...(bold ? { fontWeight: 'bold' } : {}),
      })}>
      {children}
    </Text>
  )
}

export function EmailLink({
  href,
  children,
  style,
}: {
  href: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <Link href={href} style={mergeStyles(baseStyles.link, style)}>
      {children}
    </Link>
  )
}

export function EmailButton({
  href,
  children,
  style,
}: {
  href: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <Button href={href} style={mergeStyles(baseStyles.button, style)}>
      {children}
    </Button>
  )
}

export function EmailHr({ style }: { style?: React.CSSProperties }) {
  return <Hr style={mergeStyles(baseStyles.hr, style)} />
}

export function EmailImg({
  src,
  alt,
  style,
}: {
  src: string
  alt: string
  style?: React.CSSProperties
}) {
  return <Img src={src} alt={alt} style={mergeStyles(baseStyles.image, style)} />
}

export function EmailList({
  items,
  ordered = false,
  style,
  children,
}: {
  items?: string[]
  children?: React.ReactNode
  ordered?: boolean
  style?: React.CSSProperties
}) {
  const ListComponent = ordered ? 'ol' : 'ul'
  return (
    <ListComponent style={mergeStyles(baseStyles.list, style)}>
      {items
        ? items.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={index} style={baseStyles.listItem}>
              {item}
            </li>
          ))
        : children}
    </ListComponent>
  )
}

export function EmailListItem({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return <li style={mergeStyles(baseStyles.listItem, style)}>{children}</li>
}

export function EmailSection({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return <Section style={mergeStyles(baseStyles.section, style)}>{children}</Section>
}

export function EmailColumn({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return <Column style={mergeStyles(baseStyles.column, style)}>{children}</Column>
}

export function EmailRow({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return <Row style={style}>{children}</Row>
}

export default {
  EmailWrapper,
  EmailContainer,
  EmailHeading,
  EmailText,
  EmailLink,
  EmailButton,
  EmailHr,
  EmailImg,
  EmailList,
  EmailSection,
  EmailColumn,
  EmailRow,
}
