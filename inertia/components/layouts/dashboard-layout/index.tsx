import Footer from './footer'
import Header from './header'
import DashboardSidebar from './sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen'>
      <DashboardSidebar>
        <div className='min-h-screen flex flex-col bg-[#F7F7F7]'>
          <Header />
          <main className='p-6 max-w-[1280px] mx-auto w-full'>{children}</main>
          <Footer />
        </div>
      </DashboardSidebar>
    </div>
  )
}
