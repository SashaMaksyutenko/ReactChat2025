// import 'react'
// import { ChatList, MessageInbox, Sidebar } from '../section/chat'
// import GifModal from '../components/GifModal'
// import VoiceRecorder from '../components/VoiceRecorder'
// import MediaPicker from '../components/MediaPicker'
// import DocumentPicker from '../components/DocumentPicker'
// export default function Messages() {
//   return (
//     <div className='h-screen overflow-hidden'>
//       <div className='h-full rounded-sm border-stroke bg-white shadow-default dark:border-stroke-dark dark:bg-boxdark xl:flex'>
//         {/* sidebar */}
//         <Sidebar />
//         {/* chatList */}
//         <ChatList/>
//         {/* inbox */}
//         <MessageInbox/>
//       </div>
//       <GifModal/>
//       <VoiceRecorder/>
//       <MediaPicker/>
//       <DocumentPicker/>
//     </div>
//   )
// }
import { ChatList, MessageInbox } from '../section/chat'
import GifModal from '../components/GifModal'
import VoiceRecorder from '../components/VoiceRecorder'
import MediaPicker from '../components/MediaPicker'
import DocumentPicker from '../components/DocumentPicker'
export default function Messages () {
  return (
    <>
      <div className='flex w-full'>
        {/* ChatList */}
        <ChatList />
        {/* Inbox */}
        <MessageInbox />
      </div>
      <GifModal />
      <VoiceRecorder />
      <MediaPicker />
      <DocumentPicker />
    </>
  )
}
