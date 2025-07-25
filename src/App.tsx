import { useState } from 'react';
import { useMachine } from '@xstate/react';
import { matchMachine } from './machines/matchMachine';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FAB from './components/FAB';
import EventHub from './components/EventHub';
import PreMatchSetup from './components/PreMatchSetup';
import PenaltyShootoutModule from './components/PenaltyShootoutModule';
import type { AnyEventObject } from 'xstate';

export type XStateSend = (event: AnyEventObject) => void;

export default function App() {
  const [showPenalties, setShowPenalties] = useState(false);
  const [state, send] = useMachine(matchMachine);

  if (state.matches('PRE_MATCH')) {
    return <PreMatchSetup sendEvent={send} />;
  }
  
  const handleAdjustTime = () => { /* Placeholder */ };

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-100">
      <Header />
      <Dashboard
        time={state.context.matchTime}
        stoppageTime={0} // To be connected
        sendEvent={send}
        state={state}
        onAdjustTime={handleAdjustTime}
      />
      <FAB state={state} sendEvent={send} />
      <EventHub
        isOpen={state.context.eventHubOpen}
        sendEvent={send}
        state={state}
      />
      {showPenalties && (
        <PenaltyShootoutModule
          state={state}
          sendEvent={send}
          onClose={() => setShowPenalties(false)}
        />
      )}
      <button
        onClick={() => setShowPenalties(!showPenalties)}
        className="fixed bottom-8 left-8 bg-purple-600 p-4 rounded-full"
      >
        Penalties
      </button>
    </div>
  );
}