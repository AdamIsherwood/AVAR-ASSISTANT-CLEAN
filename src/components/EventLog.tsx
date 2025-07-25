import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine';
import type { XStateSend } from '../App';

type EventLogProps = {
  state: StateFrom<typeof matchMachine>;
  sendEvent: XStateSend;
};

export default function EventLog({ state, sendEvent }: EventLogProps) {
  // A helper type for our booking objects
  type Booking = { eventId: string; playerId: string; cardType: string; deleted?: boolean };

  return (
    <ul className="space-y-2 mt-4">
      {state.context.bookings.map((booking: Booking) => (
        <li
          key={booking.eventId}
          className={`flex justify-between items-center p-2 rounded-md ${
            booking.deleted ? 'bg-red-900 line-through' : 'bg-gray-700'
          }`}
        >
          <span>{booking.cardType} card for {booking.playerId}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => sendEvent({ type: 'START_EDIT_BOOKING', eventId: booking.eventId })}
              className="text-blue-400 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => sendEvent({ type: 'DELETE_BOOKING', eventId: booking.eventId })}
              className="text-red-400 text-sm"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}