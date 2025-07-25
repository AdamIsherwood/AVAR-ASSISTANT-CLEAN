import { useState } from 'react';
import type { StateFrom } from 'xstate';
import type { XStateSend } from '../App';
import type { matchMachine } from '../machines/matchMachine';

type SubstitutionModuleProps = {
  state: StateFrom<typeof matchMachine>;
  sendEvent: XStateSend;
};

export default function SubstitutionModule({
  state,
  sendEvent,
}: SubstitutionModuleProps) {
  const { home, away } = state.context;
  const [activeTeam, setActiveTeam] = useState<'home' | 'away'>('home');
  const [playerInId, setPlayerInId] = useState('');
  const [playerOutId, setPlayerOutId] = useState('');

  const activeRoster = activeTeam === 'home' ? home.roster : away.roster;

  const handleSave = () => {
    if (playerInId && playerOutId) {
      sendEvent({
        type: 'SUBSTITUTION_MADE',
        teamId: activeTeam,
        playerInId,
        playerOutId,
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-semibold">Log Substitution</h3>

      {/* Counts Display */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-center bg-gray-900 p-3 rounded-lg">
        <div className="text-sm">
          <span className="font-bold block text-gray-400">HOME</span>
          {home.substitutionsUsed} subs / {home.substitutionWindowsUsed} windows
        </div>
        <div className="text-sm">
          <span className="font-bold block text-gray-400">AWAY</span>
          {away.substitutionsUsed} subs / {away.substitutionWindowsUsed} windows
        </div>
      </div>

      {/* Team Tabs */}
      <div className="flex border-b border-gray-600">
        <button
          onClick={() => setActiveTeam('home')}
          className={`py-2 px-4 font-semibold ${
            activeTeam === 'home' ? 'bg-gray-700 rounded-t-lg' : 'text-gray-400'
          }`}
        >
          HOME
        </button>
        <button
          onClick={() => setActiveTeam('away')}
          className={`py-2 px-4 font-semibold ${
            activeTeam === 'away' ? 'bg-gray-700 rounded-t-lg' : 'text-gray-400'
          }`}
        >
          AWAY
        </button>
      </div>

      {/* Player Out */}
      <div className="space-y-1">
        <label
          htmlFor="player-out"
          className="block text-sm font-medium text-gray-300"
        >
          Player Out
        </label>
        <select
          id="player-out"
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
          value={playerOutId}
          onChange={(e) => setPlayerOutId(e.target.value)}
        >
          <option value="">Select Player...</option>
          {activeRoster.map((player) => (
            <option key={player.playerId} value={player.playerId}>
              {player.number} - {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* Player In */}
      <div className="space-y-1">
        <label
          htmlFor="player-in"
          className="block text-sm font-medium text-gray-300"
        >
          Player In
        </label>
        <select
          id="player-in"
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
          value={playerInId}
          onChange={(e) => setPlayerInId(e.target.value)}
        >
          <option value="">Select Player...</option>
          {activeRoster.map((player) => (
            <option key={player.playerId} value={player.playerId}>
              {player.number} - {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* Concussion Sub */}
      <div className="flex items-center space-x-2 pt-2">
        <input
          id="concussion-sub"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="concussion-sub" className="text-sm text-gray-300">
          Concussion Sub
        </label>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Save Substitution
        </button>
      </div>
    </div>
  );
}