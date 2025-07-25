import { useEffect, useRef, useState } from 'react';
// This is the correct way to import a worker from the src directory
import TimerWorker from '../workers/timerWorker?worker';

export default function TimerTest() {
  const [stoppageTime, setStoppageTime] = useState(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new TimerWorker();
    workerRef.current.onmessage = (event) => {
      if (event.data.type === 'STOPPAGE_TICK') {
        setStoppageTime(event.data.time);
      }
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleStart = () => {
    workerRef.current?.postMessage('START_STOPPAGE_TIMER');
  };

  const handleStop = () => {
    workerRef.current?.postMessage('STOP_STOPPAGE_TIMER');
  };

  return (
    <div className="bg-purple-800 p-4 m-4 rounded-lg">
      <h2 className="text-2xl font-bold">Diagnostic Timer Test</h2>
      <p className="text-4xl my-4">{stoppageTime} seconds</p>
      <div className="flex space-x-2">
        <button onClick={handleStart} className="bg-green-600 p-2 rounded">
          Start Stoppage
        </button>
        <button onClick={handleStop} className="bg-red-600 p-2 rounded">
          Stop Stoppage
        </button>
      </div>
    </div>
  );
}