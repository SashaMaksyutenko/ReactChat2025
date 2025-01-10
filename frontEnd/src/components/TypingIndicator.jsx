
export default function TypingIndicator() {
  return (
    <div className='flex flex-row items-center space-x-3 max-w-fit bg-gray dark:bg-boxdark-2 p-4 rounded-xl rounded-tl-none'>
      <div className='text-md text-body dark:text-white'>Typing</div>
      <div className='ticontainer'>
        <div className='flex items-center h-[17px] space-x-2'>
          <div className='tidot'></div>
          <div className='tidot'></div>
          <div className='tidot'></div>
        </div>
      </div>
    </div>
  )
}
