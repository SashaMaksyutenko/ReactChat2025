import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import AudioFile from '../assets/audio/file_example.mp3'
export default function Waveform (props) {
  const { incoming } = props
  const waveformRef = useRef(null)
  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  useEffect(() => {
    if (waveformRef.current) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        wavecolor: '#3C50E0',
        progressColor: '#80CAEE',
        url: AudioFile,
        renderFunction: (channels, ctx) => {
          const { width, height } = ctx.canvas
          const scale = channels[0].length / width
          const step = 6
          ctx.translate(0, height / 2)
          ctx.strokeStyle = ctx.fillStyle
          ctx.beginPath()
          for (let i = 0; i < width; i += step * 2) {
            const index = Math.floor(i * scale)
            const value = Math.abs(channels[0][index])
            let x = i
            let y = value * height
            ctx.moveTo(x, 0)
            ctx.lineTo(x, y)
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true)
            ctx.lineTo(x + step, 0)
            x = x + step
            y = -y
            ctx.moveTo(x, 0)
            ctx.lineTo(x, y)
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false)
            ctx.lineTo(x + step, 0)
          }
          ctx.stroke()
          ctx.closePath()
        }
      })
      setWavesurfer(ws)
      return () => {
        ws.destroy()
      }
    }
  }, [])
  const formatTime = time => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floot(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  const handePlayPause = () => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause()
      } else {
        wavesurfer.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  return <div></div>
}
