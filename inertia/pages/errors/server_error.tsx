import { SEO } from '~/components/seo'

export default function ServerError(props: { error: any }) {
  return (
    <>
      <div className='container'>
        <div className='title'>Server Error</div>
        <SEO title='Server Error' description='Server Error' />

        <span>{props.error.message}</span>
      </div>
    </>
  )
}
