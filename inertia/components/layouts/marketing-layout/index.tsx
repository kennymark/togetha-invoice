import Header from './header'
import Footer from './footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen h-full w-full'>
      <Header />
      <main className='w-full flex flex-col items-centers flex-1'>{children}</main>
      <Footer />
    </div>
  )
}
