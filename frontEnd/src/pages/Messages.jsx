import 'react'
import { ChatList, MessageInbox, Sidebar } from '../section/chat'
export default function Messages() {
  return (
    <div className='h-screen overflow-hidden'>
      <div className='h-full rounded-sm border-stroke bg-white shadow-default dark:border-stroke-dark dark:bg-boxdark xl:flex'>
        {/* sidebar */}
        <Sidebar />
        {/* chatList */}
        <ChatList/>
        {/* inbox */}
        <MessageInbox/>
      </div>
    </div>
  )
}
