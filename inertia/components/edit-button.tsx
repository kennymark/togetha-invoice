import { Edit2 } from 'iconsax-react'
import { Button } from './ui/button'

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type='button' variant='ghost' className='p-1 hover:bg-gray-100' onClick={onClick}>
      <Edit2 color='#6D747A' size={16} />
    </Button>
  )
}
