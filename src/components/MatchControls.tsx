import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine';
import type { XStateSend } from '../App';

type MatchControlsProps = {
  sendEvent: XStateSend;
  state: StateFrom<typeof matchMachine>;
};

export default function MatchControls({ sendEvent, state }: MatchControlsProps) {
  const buttonText = (() => {
    if (state.matches('PRE_MATCH')) {
      return 'Start 1st Half';
    }
    if (state.matches('FIRST_HALF')) {
      return 'End 1st Half';
    }
    if (state.matches('HALF_TIME')) {
      return 'Start 2nd Half';
    }
    return 'Next Phase';
  })();

  const isPaused = state.matches('MATCH_PAUSED');

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => sendEvent({ type: 'NEXT' })}
        className="bg-green-600 text-white font-bold py-4 px-6 rounded-lg w-full text-xl hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={isPaused}
      >
        {buttonText}
      </button>
      {isPaused ? (
        <button
          onClick={() => sendEvent({ type: 'CONTINUE' })}
          className="bg-blue-600 text-white font-bold py-4 px-6 rounded-lg w-full text-xl hover:bg-blue-700"
        >
          CONTINUE
        </button>
      ) : (
        <button
          onClick={() => sendEvent({ type: 'PAUSE' })}
          className="bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg w-full text-xl hover:bg-yellow-700"
        >
          PAUSE
        </button>
      )}
      {!state.matches('PRE_MATCH') && (
        <button
          onClick={() => sendEvent({ type: 'RESET' })}
          className="bg-red-600 text-white font-bold py-4 px-6 rounded-lg w-full text-xl hover:bg-red-700"
        >
          RESET
        </button>
      )}
    </div>
  );
}