import env from '#start/env'
import { MeiliSearch } from 'meilisearch'

const meiliSearchClient = new MeiliSearch({
  host: env.get('MEILISEARCH_HOST'),
  apiKey: env.get('MEILISEARCH_API_KEY'),
})

export default meiliSearchClient
