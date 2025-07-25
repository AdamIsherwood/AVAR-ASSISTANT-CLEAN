// src/components/StoppageControls.tsx
import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine'; // Corrected path
import type { XStateSend } from '../App';
import StoppageReasons from '../components/StoppageReasons'; // Corrected path

type StoppageControlsProps = {
  state: StateFrom<typeof matchMachine>;
  sendEvent: XStateSend;
};

export default function StoppageControls({ state, sendEvent }: StoppageControlsProps) {
  const isStoppageActive = state.context.stoppageActive;

  return (
    <div>
      <button
        onClick={() => sendEvent({ type: isStoppageActive ? 'END_STOPPAGE' : 'START_STOPPAGE' })}
        className={`text-white font-bold py-4 px-6 rounded-lg w-full text-xl ${
          isStoppageActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'
        }`}
      >
        {isStoppageActive ? 'BALL BACK IN PLAY' : 'BALL OUT OF PLAY'}
      </button>

      {isStoppageActive && <StoppageReasons sendEvent={sendEvent} />}
    </div>
  );
}