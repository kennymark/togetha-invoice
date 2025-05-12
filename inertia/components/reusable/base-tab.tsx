import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { cn } from '~/lib/utils'

export function BaseTab({
  activeTab,
  setActiveTab,
  tab,
}: {
  activeTab?: string
  setActiveTab?: (activeTab: string) => void
  tab: ITabProps[]
}) {
  return (
    <Tabs
      defaultValue={tab[0].value}
      value={activeTab}
      onValueChange={setActiveTab}
      className='flex flex-row justify-center gap-[307px]'>
      <TabsList className='w-[366px] flex flex-col gap-[45px] h-fit bg-transparent pb-10'>
        {tab.map((item) => (
          <TabsTrigger
            key={item.name}
            value={item.value}
            className={cn(
              'w-full flex items-center justify-start gap-[7px] font-input-mono text-[15px] uppercase rounded-none tracking-[4%] data-[state=active]:shadow-none group transition-all duration-300',
              {
                'border-y border-y-white/40 py-[42px]': item.value === 'payout',
              },
            )}>
            <img
              src={item.image}
              alt={item.name}
              width={17}
              height={18}
              className='opacity-60 group-hover:opacity-100 group-data-[state=active]:opacity-100'
            />
            <span className='opacity-60 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
              {item.name}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tab.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <div className='w-full h-fit flex'>{item.element}</div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export interface ITabProps {
  value: 'profile' | 'payout' | 'settings' | 'support'
  image: string
  name: string
  element: React.ReactNode
}
