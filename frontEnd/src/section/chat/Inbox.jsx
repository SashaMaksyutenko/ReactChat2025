import { useState } from 'react'
import DropDown from '../../components/DropDown'
import EmojiPicker from '../../components/EmojiPicker'
import User01 from '../../images/user/user-01.png'
import UserInfo from './UserInfo'
import { useDispatch } from 'react-redux'
import {
  PaperPlaneTilt,
  VideoCamera,
  Phone,
  Gif,
  Microphone
} from '@phosphor-icons/react'
import Giphy from '../../components/Giphy'
import { ToggleAudioModal } from '../../redux/slices/app'
import Attachment from '../../components/Attachment'
import MsgSeparator from '../../components/MsgSeparator'
import TypingIndicator from '../../components/TypingIndicator'
import {
  DocumentMessage,
  TextMessage,
  VoiceMessage
} from '../../components/Messages'
export default function Inbox () {
  const dispatch = useDispatch()
  const [userInfoOpen, setUserInfoOpen] = useState(false)
  const [gifOpen, setGifOpen] = useState(false)
  const handleToggleGif = e => {
    e.preventDefault()
    setGifOpen(prev => !prev)
  }
  const handleToggleUserInfo = () => {
    setUserInfoOpen(prev => !prev)
  }
  const handleMicClick = e => {
    e.preventDefault()
    dispatch(ToggleAudioModal(true))
  }
  return (
    <>
      <div
        className={`flex h-full flex-col border-l border-stroke dark:border-strokedark ${
          userInfoOpen ? 'xl:w-1/2' : 'xl:w-3/4'
        }`}
      >
        {/* chat Header */}
        <div className='sticky flex items-center flex-row justify-between border-b border-stroke dark:border-strokedark px-6 py-4.5'>
          <div className='flex items-center' onClick={handleToggleUserInfo}>
            <div className='mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full'>
              <img
                src={User01}
                alt='avatar'
                className='h-full w-full object-cover object-center'
              />
            </div>
            <div>
              <h5 className='font-medium text-black dark:text-white'>
                Henry Dholi
              </h5>
              <p className='text-sm'>Reply to message</p>
            </div>
          </div>
          <div className='flex flex-row items-center space-x-8'>
            <button>
              <VideoCamera size={24} />
            </button>
            <button>
              <Phone size={24} />
            </button>
            <DropDown />
          </div>
        </div>
        {/* list of messages */}
        <div className='max-h-full space-y-3.5 overflow-auto no-scrollbar px-6 py-7.5 grow'>
          <TextMessage
            author='Sasha'
            content='Hi. Take a look at this link-> https://www.npmjs.com/'
            read_receipt='read'
            incoming={false}
            timestamp='2:44pm'
          />
          <div className='max-w-125 ml-auto'>
            <div className='mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3'>
              <p className='text-white'>
                Ok. I will check it out later. Thanks for sharing with me this
                resourse
              </p>
            </div>
            <p className='text-xs'>19:35pm</p>
          </div>
          <MsgSeparator />
          <DocumentMessage
            author='Sasha'
            incoming={true}
            read_receipt='read'
            timestamp='4:23pm'
          />
          <VoiceMessage
            incoming={false}
            read_receipt='delivered'
            timestamp='4:27pm'
          />
          <div className='max-w-125'>
            <p className='mb-2.5 text-sm font-medium'>Andri Thomas</p>
            <div className='mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2'>
              <p>So what?</p>
            </div>
            <p className='text-xs'>20:20pm</p>
          </div>
          <div className='max-w-125 ml-auto'>
            <div className='mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3'>
              <p className='text-white'>Victor calling!!!</p>
            </div>
            <p className='text-xs'>20:35pm</p>
          </div>
          <div className='max-w-125'>
            <p className='mb-2.5 text-sm font-medium'>Andri Thomas</p>
            <div className='mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2'>
              <p>I`m not scared. Dont go there</p>
            </div>
            <p className='text-xs'>20:50pm</p>
          </div>
          <div className='max-w-125 ml-auto'>
            <div className='mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3'>
              <p className='text-white'>I better stay at home</p>
            </div>
            <p className='text-xs'>21:00pm</p>
          </div>
          <TypingIndicator />
        </div>
        {/* input */}
        <div className='sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark'>
          <form className='flex items-center justify-between space-x-4.5'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Type something here'
                className='h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
              />
              <div className='absolute right-5 top-1/2 -translate-y-1/2 items-center justify-end space-x-4'>
                <button onClick={handleMicClick} className='hover:text-primary'>
                  <Microphone size={20} />
                </button>
                <button className='hover:text-primary'>
                  <Attachment />
                </button>
                <button onClick={handleToggleGif}>
                  <Gif size={20} />
                </button>
                <button className='hover:text-primary'>
                  <EmojiPicker />
                </button>
              </div>
            </div>
            <button className='flex items-center justify-center h-12 max-w-13 w-full rounded-md bg-primary text-white hover:bg-opacity-90'>
              <PaperPlaneTilt size={24} weight='bold' />
            </button>
          </form>
          {gifOpen && <Giphy />}
        </div>
      </div>
      {userInfoOpen && (
        <div className='w-1/4 '>
          <UserInfo handleToggleUserInfo={handleToggleUserInfo} />
        </div>
      )}
    </>
  )
}
