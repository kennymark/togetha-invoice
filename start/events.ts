import CacheService from '#services/cache_service'
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'
import string from '@adonisjs/core/helpers/string'

function generateShortId(length = 9): string {
  return string.generateRandom(length)
}

emitter.on('mail:sent', async (event) => {
  // console.table(event.message)
  // @ts-ignore
  const responseString = event.response.original.response as unknown as string
  const testMessageUrl = getTestMessageUrl(responseString)
  const id = generateShortId()
  const msg = {
    id,
    subject: event.message.subject,
    from: event.message.from,
    to: event.message.to,
    url: testMessageUrl,
    date: new Date().toISOString(),
  }

  const emails = await CacheService.get('emails', [])

  const newEmails = [msg, ...emails]

  const twoDays = 60 * 60 * 24 * 2

  await CacheService.set(`emails`, newEmails, twoDays).then(
    () => console.log('Emails cached'),
    (err) => console.error('Error caching emails', err),
  )

  console.log('Mail sent:', {
    to: event.message.to,
    from: event.message.from,
    subject: event.message.subject,
    response: responseString,
    testMessageUrl,
  })
})

const getTestMessageUrl = (info: any) => {
  const web = 'https://ethereal.email/message'
  // given this response, extract the MSGID
  const msgIdRegex = /MSGID=([^ ]+)/
  const msgIdMatch = info.match(msgIdRegex)
  const msgId = msgIdMatch ? msgIdMatch[1] : null
  if (msgId) {
    return `${web}/${msgId}`
  }
  return `No MSGID found in response`
}

emitter.onError((error) => logger.error(error))
emitter.on('queued:mail:error', (event) => {
  console.log('queued:mail:error', event)
})
