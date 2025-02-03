import { useRef, useState, useEffect } from 'react'
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import _ from 'lodash'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useDispatch } from 'react-redux'
import { ToggleGifModal } from '../redux/slices/app'
const gf = new GiphyFetch('3UxUaZao026trL9giBx5eoYUOw5wzHVG')
export default function Giphy () {
  const dispatch = useDispatch()
  const gridRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [gifs, setGifs] = useState([]) // store GIFs
  const fetchGifs = async offset => {
    return gf.search(value, { offset, limit: 10 })
  }
  const debouncedFetchGifs = _.debounce(async () => {
    setIsLoading(true)
    setError(null) // clear any previous errors
    try {
      const newGifs = await fetchGifs(0)
      setGifs(newGifs.data)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, 500) // debounce time (500ms)
  useEffect(() => {
    // fetch GIFs initialy based on the search term
    const fetchInitialGifs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const initialGifs = await fetchGifs(0)
        setGifs(initialGifs.data)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInitialGifs()
  }, [])
  const handleGifClick = (gif, e) => {
    e.preventDefault()
    const gifUrl = gif.images.original.url
    dispatch(
      ToggleGifModal({
        value: true,
        url: gifUrl
      })
    )
  }
  return (
    <div ref={gridRef} className='w-full mt-3'>
      <input
        type='text'
        placeholder='Search for Gif...'
        className='border border-stroke dark:border-strokedark rounded-md p-2 w-full mb-2 outline-none bg-transparent'
        value={value}
        onChange={e => {
          setValue(e.target.value)
          debouncedFetchGifs() //call debounced function on every change
        }}
      />
      {isLoading && <p>Loading GIFs...</p>}
      {error && <p className='text-red'>Error: {error}</p>}
      <div className='h-48 overflow-auto no-scrollbar'>
        {gifs.length > 0 ? (
          <Grid
            width={gridRef.current?.offsetWidth}
            columns={6}
            gutter={6}
            fetchGifs={fetchGifs}
            key={value}
            onGifClick={handleGifClick}
            data={gifs}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full space-y-2'>
            <MagnifyingGlass size={48} weight='bold' />
            <span className='text-xl text-body dark:text-white font-semibold'>
              Please search for any Gif
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
