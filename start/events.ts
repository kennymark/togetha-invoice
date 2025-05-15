import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

emitter.on('mail:sent', (event) => {
  // console.table(event.message)
  // @ts-ignore
  const responseString = event.response.original.response as unknown as string
  const testMessageUrl = getTestMessageUrl(responseString)
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
