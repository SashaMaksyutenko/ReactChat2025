import { ChatTeardropText } from '@phosphor-icons/react'
export default function Logo () {
  return (
    <div className='flex flex-row items-center space-x-2'>
      <ChatTeardropText size={32} weight='bold' />
      <div className='text-2xl font-medium text-body dark:text-white'>Chat</div>
    </div>
  )
}
