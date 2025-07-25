import type { XStateSend } from '../App';

type GoalModuleProps = {
  sendEvent: XStateSend;
};

export default function GoalModule({ sendEvent }: GoalModuleProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-semibold">Log Goal</h3>

      {/* Team Tabs */}
      <div className="flex border-b border-gray-600">
        <button className="py-2 px-4 bg-gray-700 rounded-t-lg font-semibold">
          HOME
        </button>
        <button className="py-2 px-4 text-gray-400 font-semibold">
          AWAY
        </button>
      </div>

      {/* Scorer Select */}
      <div className="space-y-1">
        <label
          htmlFor="scorer-select"
          className="block text-sm font-medium text-gray-300"
        >
          Select Scorer
        </label>
        <select
          id="scorer-select"
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
        >
          <option>Select Scorer...</option>
        </select>
      </div>

      {/* Own Goal Button */}
      <div className="pt-2">
        <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg">
          Own Goal
        </button>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={() =>
            sendEvent({
              type: 'GOAL_SCORED',
              goal: { teamId: 'home', playerId: 'p456' },
            })
          }
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Save Goal
        </button>
      </div>
    </div>
  );
}