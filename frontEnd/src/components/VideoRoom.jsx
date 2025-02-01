import {
  Microphone,
  MicrophoneSlash,
  PhoneDisconnect,
  VideoCamera,
  VideoCameraSlash
} from '@phosphor-icons/react'
import { useState } from 'react'
import User01 from '../images/user/user-01.png'
import User02 from '../images/user/user-02.png'
import PropTypes from 'prop-types'
export default function VideoRoom ({ open, handleClose }) {
  const [muteAudio, setMuteAudio] = useState(false)
  const [muteVideo, setMuteVideo] = useState(false)
  const handleToggleAudio = () => {
    setMuteAudio(p => !p)
  }
  const handleToggleVideo = () => {
    setMuteVideo(p => !p)
  }
  return (
    <div
      className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
        open ? 'block' : 'hidden'
      }`}
    >
      <div className='w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12'>
        <div className='flex flex-col space-y-6'>
          {/* Video Feed Grid */}
          <div className='grid grid-cols-2 gap-4 h-50 mb-4'>
            {/* Video Feed 1 */}
            <div className='relative h-full w-full bg-gray dark:bg-boxdark-2 rounded-md flex items-center justify-center'>
              <div className='space-y-2'>
                <img
                  src={User01}
                  alt=''
                  className='h-20 w-20 rounded-full object-center object-cover'
                />
                <div className='font-medium text-sm text-center'>You</div>
                <div className='absolute top-3 right-4'>
                  {muteAudio && (
                    <MicrophoneSlash size={20} className='text-primary' />
                  )}
                </div>
              </div>
            </div>
            {/* Video Feed 2 */}
            <div className='relative h-full w-full bg-gray dark:bg-boxdark-2 rounded-md flex items-center justify-center'>
              <div className='space-y-2'>
                <img
                  src={User02}
                  alt=''
                  className='h-20 w-20 rounded-full object-center object-cover'
                />
                <div className='font-medium text-sm text-center'>Victoria</div>
                <div className='absolute top-3 right-4'>
                  <MicrophoneSlash size={20} className='text-primary' />
                </div>
              </div>
            </div>
          </div>
          {/* Call controls */}
          <div className='flex flex-row items-center justify-center space-x-4'>
            {/* Microphone button */}
            <button
              onClick={handleToggleAudio}
              className='p-3 rounded-md bg-gray dark:bg-boxdark text-black dark:text-white hover:bg-opacity-80 flex items-center justify-center'
            >
              {muteAudio ? (
                <MicrophoneSlash size={20} />
              ) : (
                <Microphone size={20} />
              )}
            </button>
            {/* Disconnecting button */}
            <button
              onClick={handleClose}
              className='p-3 rounded-full bg-red text-white hover:bg-opacity-80'
            >
              <PhoneDisconnect size={20} />
            </button>
            {/* VideoCamera button */}
            <button
              onClick={handleToggleVideo}
              className='p-3 rounded-md bg-gray dark:bg-boxdark text-black dark:text-white hover:bg-opacity-80 flex items-center justify-center'
            >
              {muteVideo ? (
                <VideoCameraSlash size={20} />
              ) : (
                <VideoCamera size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
VideoRoom.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}
