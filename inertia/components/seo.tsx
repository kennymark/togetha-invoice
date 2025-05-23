import { Head } from '@inertiajs/react'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogUrl?: string
  ogType?: string
  twitterCard?: string
  canonicalUrl?: string
  noindex?: boolean
  nofollow?: boolean
  locale?: string
  alternateLanguages?: Record<string, string>
}

export function SEO({
  title,
  description,
  keywords = 'invoice, invoicing, invoicing software, invoice generator, invoice creator, invoice maker, invoice template, invoice design, invoice generator, invoice creator, invoice maker, invoice template, invoice design',
  ogImage = '/android-chrome-192x192.png',
  ogUrl = 'https://togetha-invoice-production.up.railway.app/',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noindex = false,
  nofollow = false,
  locale = 'en_US',
  alternateLanguages,
}: SEOProps) {
  try {
    const fullTitle = `${title} | Togetha Invoice`
    const robots = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`

    return (
      <Head>
        {/* Primary Meta Tags */}
        <title>{fullTitle}</title>
        <meta name='title' content={fullTitle} />
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <meta name='robots' content={robots} />
        <meta name='language' content={locale} />
        <meta name='revisit-after' content='7 days' />
        <meta name='author' content='Your Company Name' />

        {/* Canonical URL */}
        {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}

        {/* Open Graph / Facebook */}
        <meta property='og:type' content={ogType} />
        <meta property='og:url' content={ogUrl} />
        <meta property='og:title' content={fullTitle} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={ogImage} />
        <meta property='og:locale' content={locale} />
        <meta property='og:site_name' content='Your Company Name' />

        {/* Twitter */}
        <meta property='twitter:card' content={twitterCard} />
        <meta property='twitter:url' content={ogUrl} />
        <meta property='twitter:title' content={fullTitle} />
        <meta property='twitter:description' content={description} />
        <meta property='twitter:image' content={ogImage} />

        {/* Alternate Languages */}
        {alternateLanguages &&
          Object.entries(alternateLanguages).map(([lang, url]) => (
            <link key={lang} rel='alternate' hrefLang={lang} href={url} />
          ))}
      </Head>
    )
  } catch (error) {
    console.error('Error in SEO component:', error)
    return null
  }
}
