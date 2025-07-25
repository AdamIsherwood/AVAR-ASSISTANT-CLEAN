import type { XStateSend } from '../App';

type PreMatchSetupProps = {
  sendEvent: XStateSend;
};

export default function PreMatchSetup({ sendEvent }: PreMatchSetupProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Pre-Match Setup Hub</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Teams & Rosters Section */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Teams & Rosters</h2>
          <p className="text-gray-400">Placeholder for team and roster setup...</p>
        </div>

        {/* Competition Rules Section */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Competition Rules</h2>
          <p className="text-gray-400">Placeholder for competition rule selection...</p>
        </div>
      </div>

      {/* Start Match Button */}
      <button
        onClick={() => sendEvent({ type: 'NEXT' })}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-lg text-2xl"
      >
        START MATCH
      </button>
    </div>
  );
}