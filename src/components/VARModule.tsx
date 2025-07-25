import type { XStateSend } from '../App';

type VARModuleProps = {
  sendEvent: XStateSend;
};

const varEventTypes = [
  'VAR - GOAL',
  'VAR - NO GOAL',
  'VAR - RED CARD',
  'VAR - NO RED CARD',
  'VAR - MISTAKEN IDENTITY',
];

export default function VARModule({ sendEvent }: VARModuleProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-semibold">Log VAR Outcome</h3>
      <div className="grid grid-cols-1 gap-2">
        {varEventTypes.map((eventType) => (
          <button
            key={eventType}
            onClick={() =>
              sendEvent({ type: 'VAR_OUTCOME', review: { outcome: eventType } })
            }
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-md text-md"
          >
            {eventType}
          </button>
        ))}
      </div>
    </div>
  );
}