import { Button } from '~/components/ui'
import { BaseSheet } from '~/components/reusable'
import { Send, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import usePageProps from '~/hooks/use-page-props'

type DevEmail = {
  id: string
  subject: string
  from: string
  to: string[]
  url: string
  date: string
}

export default function DevEmails() {
  const [emails, setEmails] = useState<DevEmail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { devEmails } = usePageProps()

  console.log('devEmails', devEmails)

  useEffect(() => {
    if (devEmails) {
      setEmails(devEmails)
      setIsLoading(false)
    }
  }, [devEmails])

  if (isLoading || !emails || emails.length === 0) {
    return null
  }

  return (
    <BaseSheet
      trigger={
        <Button variant='ghost' size='icon' aria-label='Dev Emails' className='relative'>
          <Send className='size-5' />
          <span className='absolute top-1 right-1 text-white text-[8px] flex justify-center items-center h-3 w-3 rounded-full bg-yellow-400 '>
            {emails.length}
          </span>
        </Button>
      }
      title='Dev Emails'
      side='right'
      size='md'>
      <div className='flex flex-col gap-2 p-4'>
        <h3 className='text-lg font-medium'>Dev Emails</h3>
        {emails.map((email: DevEmail) => (
          <div
            key={email.id}
            className='p-4 rounded-lg border border-border hover:bg-secondary/5 transition-colors'>
            <h3 className='font-medium mb-2'>Subject: {email.subject}</h3>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex flex-col gap-2'>
                <span>
                  <b>from:</b> {email.from}
                </span>
                <span>
                  <b>to:</b> {email.to[0]}
                </span>
              </div>
              <p className='text-xs font-medium'>{new Date(email.date).toLocaleString()}</p>
              <Button
                variant='ghost'
                size='sm'
                className='gap-2'
                onClick={() => window.open(email.url, '_blank')}>
                <ExternalLink className='size-4' />
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </BaseSheet>
  )
}
