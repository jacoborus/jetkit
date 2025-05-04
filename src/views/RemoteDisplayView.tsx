import { useEffect, useState } from 'react'
import { useRemoteStore } from '@/store/remote-store'

export default function RemoteDisplayView() {
  const shared = useRemoteStore();
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const currentLevel = shared.levels[shared.level]
  const nextLevel = shared.levels[shared.level + 1]
  const duration = currentLevel?.duration || 0

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (shared.running) {
      interval = setInterval(() => {
        const totalTime = getTotalTime(new Date(shared.startedAt).getTime(), duration);

        if (totalTime < 0) {
          shared.changeLevel(shared.level + 1);
          return;
        }

        const [mins, secs] = getMinSecs(totalTime);
        if (mins !== minutes) setMinutes(mins);
        if (secs !== seconds) setSeconds(secs);
      }, 200)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [shared, minutes, seconds, duration])

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Timer Display */}
        <div className="card bg-base-100 shadow-xl mb-4">
          <div className="card-body items-center text-center">
            <h1 className="text-6xl font-bold font-mono">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </h1>
          </div>
        </div>

        {/* Level Information */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Level */}
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title">Current Level:</h2>
              {currentLevel?.type === 'game' && (
                <>
                  <div className="text-2xl font-bold">
                    Blinds: {currentLevel?.blinds.join(' / ')}
                  </div>
                  <div className="text-xl">
                    Ante: {currentLevel?.ante}
                  </div>
                </>
              )}
              {currentLevel?.type === 'break' && (
                <>
                  <div className="text-2xl font-bold">
                    Duration: {currentLevel?.duration}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Next Level */}
          {nextLevel && (
            <div className="card bg-secondary text-secondary-content">
              <div className="card-body">
                <h2 className="card-title">Next Level:</h2>
                {nextLevel.type === 'game' && (
                  <>
                    <div className="text-2xl font-bold">
                      Blinds: {nextLevel.blinds.join(' / ')}
                    </div>
                    <div className="text-xl">
                      Ante: {nextLevel.ante}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getTotalTime(startedAt: number, duration: number) {
  const roundTime = duration * 60_000;
  const elapsedTime = Date.now() - startedAt;
  return roundTime - elapsedTime;
}

function getMinSecs(totalTime: number): [number, number] {
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor(totalTime / 1000) % 60;
  return [minutes, seconds];
}
