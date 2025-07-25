import MatchClock from './MatchClock';
import MatchControls from './MatchControls';
import StoppageControls from './StoppageControls';
import AddedTimeDisplay from './AddedTimeDisplay';
import EventLog from './EventLog';
import ClockAdjustment from './ClockAdjustment';
import { generatePdfReport } from '../lib/reportGenerator';
import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine';
import type { XStateSend } from '../App';

type DashboardProps = {
  time: number;
  stoppageTime: number;
  sendEvent: XStateSend;
  state: StateFrom<typeof matchMachine>;
  onAdjustTime: (amount: number) => void;
};

export default function Dashboard({
  time,
  stoppageTime,
  sendEvent,
  state,
  onAdjustTime,
}: DashboardProps) {
  const handleJsonExport = (
    context: StateFrom<typeof matchMachine>['context'],
  ) => {
    const jsonString = JSON.stringify(context, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'match-report.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="grid grid-cols-3 gap-4 p-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="uppercase">Match Clock & Controls</h2>
        <MatchClock timeInSeconds={time} state={state} />
        <MatchControls state={state} sendEvent={sendEvent} />
        {state.context.liveEditActive && <ClockAdjustment onAdjust={onAdjustTime} />}
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="uppercase">Stoppage System</h2>
        <StoppageControls state={state} sendEvent={sendEvent} />
        <AddedTimeDisplay
          accurateTime={stoppageTime}
          frozenTime={state.context.announcedAddedTime}
        />
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="uppercase">Event Log</h2>
       {state.context.liveEditActive ? (
      <EventLog state={state} sendEvent={sendEvent} />
      ) : (
     <button
      onClick={() => sendEvent({ type: 'TOGGLE_EVENT_HUB' })}
    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-indigo-700"
  >
    Log Event
  </button>
)}
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="uppercase">Booking Module</h2>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="uppercase">Substitution Module</h2>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="uppercase">Goal Module</h2>
      </div>
      {state.matches('MATCH_OVER') && (
        <div className="col-span-3 bg-gray-700 rounded-lg p-6 border border-gray-600 text-center">
          <h2 className="text-2xl font-bold mb-4">Match Over</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleJsonExport(state.context)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
            >
              Generate JSON Report
            </button>
            <button
              onClick={() => generatePdfReport(state.context)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
            >
              Generate PDF Report
            </button>
          </div>
        </div>
      )}
    </main>
  );
}