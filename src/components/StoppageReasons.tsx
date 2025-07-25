// src/components/StoppageReasons.tsx
import type { XStateSend } from '../App';

type StoppageReasonsProps = {
  sendEvent: XStateSend;
};

export default function StoppageReasons({ sendEvent }: StoppageReasonsProps) {
  const reasons = [
    'VAR CHECK', 'TIME WASTING', 'INJURY TREATMENT', 'OTHER',
    'SUBSTITUTION', 'YELLOW CARD', 'RED CARD', 'GOAL CELEBRATION'
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {reasons.map((reason) => (
        <button
          key={reason}
          onClick={() => sendEvent({ type: 'SET_STOPPAGE_REASON', reason })}
          className="bg-gray-700 text-white font-semibold py-2 px-2 rounded-lg text-xs hover:bg-gray-600"
        >
          {reason}
        </button>
      ))}
    </div>
  );
}