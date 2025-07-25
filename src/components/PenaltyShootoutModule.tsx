import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine';
import type { XStateSend } from '../App';

type PenaltyShootoutModuleProps = {
  state: StateFrom<typeof matchMachine>;
  sendEvent: XStateSend;
  onClose: () => void;
};

export default function PenaltyShootoutModule({ state, sendEvent, onClose }: PenaltyShootoutModuleProps) {
  const homeScore = state.context.penalties.home.filter(k => k === 'goal').length;
  const awayScore = state.context.penalties.away.filter(k => k === 'goal').length;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8">Penalty Shootout</h1>
      <div className="text-6xl font-bold mb-8">
        HOME {homeScore} - {awayScore} AWAY
      </div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => sendEvent({ type: 'PENALTY_KICK_RECORDED', teamId: 'home', outcome: 'goal' })}
          className="bg-green-600 p-4 rounded-lg"
        >
          Record Goal (Home)
        </button>
        <button
          onClick={() => sendEvent({ type: 'PENALTY_KICK_RECORDED', teamId: 'home', outcome: 'miss' })}
          className="bg-red-600 p-4 rounded-lg"
        >
          Record Miss (Home)
        </button>
      </div>
      <div className="w-1/2 text-center">
        <h2 className="text-2xl mb-2">Home Kicks</h2>
        <div className="flex justify-center space-x-2">
          {state.context.penalties.home.map((kick, index) => (
            <span key={index} className={kick === 'goal' ? 'text-green-400' : 'text-red-400'}>
              {kick.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-xl">
        &times; Close
      </button>
    </div>
  );
}