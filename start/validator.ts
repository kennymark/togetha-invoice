import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  required: 'The {{ field }} field is required',
  email: '{{ field }} must be a valid email',
  notIn: 'This value is not allowed for the {{ field }} field',
  unique:
    'There is already a user associated with this {{ field }} please use a different {{ field }}',
  exists: 'This {{ field }} already exists',
  enum: '{{ field }} must be one of {{ choices }}',
  requiredWhen: '{{ field }} is required when {{ otherField }} {{ operator }} {{ values }}',
  'file.size': 'The file size must be under {{ options.size }}',
  'file.extname': 'The upload file should be {{ options.extnames }}',
  string: '{{ field }} must be a string',
})
