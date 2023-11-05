import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)

  const [state, setState] = useState<'paused' | 'running'>('paused')

  const [timeType, setTimeType] = useState<'break' | 'session'>('session')
  const [timeLeft, setTimeLeft] = useState(25 * 60)

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const getTimeLeft = () => {
    let minutes = Math.floor(timeLeft / 60)
    let seconds = timeLeft % 60
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // SETTINGS CHANGES
  const changeSettings = (type: 'break' | 'session', value: number) => {
    if (state !== 'paused') return

    const newValue = type === 'break'
      ? breakLength + value
      : sessionLength + value

    if (newValue > 0 && newValue <= 60) {
      type === 'break'
        ? setBreakLength(newValue)
        : setSessionLength(newValue)
    }
  }

  useEffect(() => {
    setTimeLeft((timeType === 'break' ? breakLength : sessionLength) * 60)
  }, [sessionLength, breakLength, timeType])

  // STATE CHANGES
  const handleReset = () => {
    setState('paused')

    const audio = document.getElementById('beep') as HTMLAudioElement
    audio.pause()
    audio.currentTime = 0

    setBreakLength(5)
    setSessionLength(25)
    setTimeLeft((timeType === 'break' ? breakLength : sessionLength) * 60)
    
    setTimeType('session')
  }

  const handleTimer = () => {
    if (intervalId) clearInterval(intervalId)
    setIntervalId(setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft === 0) {
          const audio = document.getElementById('beep') as HTMLAudioElement
          audio.currentTime = 0
          audio.play()

          if (intervalId) clearInterval(intervalId)
          setTimeType(timeType === 'break' ? 'session' : 'break')
          return 0
        }
        return timeLeft - 1
      })
    }, 1000))
  }

  useEffect(() => {
    if (state === 'running') handleTimer()
    if (intervalId) clearInterval(intervalId)
  }, [state, timeType])

  return (
    <div>
      <header>25 + 5 Clock</header>
      <main>
        <div id='settings'>
          {(['break', 'session'] as Array<'break' | 'session'>).map((type) => (
            <div id={`${type}-settings`} key={type} className='settings'>
              <p id={`${type}-label`}>
                {type === 'break' ? 'Break' : 'Session'} Length
              </p>
              <div id={`${type}-controls`} className='controls'>
                <button
                  id={`${type}-decrement`}
                  onClick={() => changeSettings(type, -1)}
                >
                  Down
                </button>
                <p id={`${type}-length`}>{type === 'break' ? breakLength : sessionLength}</p>
                <button
                  id={`${type}-increment`}
                  onClick={() => changeSettings(type, 1)}
                >
                  Up
                </button>
              </div>
            </div>        
          ))}
        </div>

        <div id='timer'>
          <p id='timer-label'>{timeType === 'break' ? 'Break' : 'Session'}</p>
          <p id='time-left'>{getTimeLeft()}</p>
        </div>

        <div id='controls'>
          <button
            id='start_stop'
            onClick={() => setState((prev) => prev === 'paused' ? 'running' : 'paused')}
          >
            Start / Stop
          </button>
          <button
            id='reset'
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </main>
      <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
    </div>
  )
}

export default App
