import { useState, useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { matchMachine } from './machines/matchMachine';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FAB from './components/FAB';
import EventHub from './components/EventHub';
import PreMatchSetup from './components/PreMatchSetup';
import PenaltyShootoutModule from './components/PenaltyShootoutModule';
import type { AnyEventObject } from 'xstate';
// This is the correct way to import a worker in Vite
import TimerWorker from './workers/timerWorker?worker';

export type XStateSend = (event: AnyEventObject) => void;

export default function App() {
  const [time, setTime] = useState(0);
  const [stoppageTime, setStoppageTime] = useState(0);
  const [showPenalties, setShowPenalties] = useState(false);
  const [state, send] = useMachine(matchMachine);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new TimerWorker();
    workerRef.current.onmessage = (event) => {
      if (event.data.type === 'TICK') {
        setTime(event.data.time);
        send({ type: 'TIME_UPDATE', time: event.data.time });
      }
      if (event.data.type === 'STOPPAGE_TICK') {
        setStoppageTime(event.data.time);
        send({ type: 'STOPPAGE_TIME_UPDATE', time: event.data.time });
      }
    };
    workerRef.current.postMessage('START');
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (state.context.stoppageActive) {
      workerRef.current?.postMessage('START_STOPPAGE_TIMER');
    } else {
      workerRef.current?.postMessage('STOP_STOPPAGE_TIMER');
    }
  }, [state.context.stoppageActive]);

  const handleAdjustTime = (amount: number) => {
    workerRef.current?.postMessage({ type: 'ADJUST_TIME', amount });
  };

  if (state.matches('PRE_MATCH')) {
    return <PreMatchSetup sendEvent={send} />;
  }

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-100">
      <Header />
      <Dashboard
        time={time}
        stoppageTime={stoppageTime}
        sendEvent={send}
        state={state}
        onAdjustTime={handleAdjustTime}
      />
      <FAB state={state} sendEvent={send} />
      <EventHub isOpen={state.context.eventHubOpen} sendEvent={send} state={state} />
      {showPenalties && <PenaltyShootoutModule state={state} sendEvent={send} onClose={() => setShowPenalties(false)} />}
      <button onClick={() => setShowPenalties(!showPenalties)} className="fixed bottom-8 left-8 bg-purple-600 p-4 rounded-full">Penalties</button>
    </div>
  );
}