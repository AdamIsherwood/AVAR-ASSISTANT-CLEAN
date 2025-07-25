import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine';
import type { XStateSend } from '../App';

type FABProps = {
  state: StateFrom<typeof matchMachine>;
  sendEvent: XStateSend;
};

export default function FAB({ state, sendEvent }: FABProps) {
  const isLiveEditActive = state.context.liveEditActive;

  return (
    <button
      onClick={() => sendEvent({ type: 'TOGGLE_LIVE_EDIT' })}
      className={`fixed bottom-8 right-8 text-white rounded-full w-16 h-16 flex items-center justify-center text-lg font-bold shadow-lg ${
        isLiveEditActive
          ? 'bg-pink-600 hover:bg-pink-700'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isLiveEditActive ? 'DONE' : 'EDIT'}
    </button>
  );
}