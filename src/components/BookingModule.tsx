import { useState, useEffect } from 'react';
import type { StateFrom } from 'xstate';
import type { XStateSend } from '../App';
import type { matchMachine } from '../machines/matchMachine';

type BookingModuleProps = {
  state: StateFrom<typeof matchMachine>;
  sendEvent: XStateSend;
  editingEventId: string | null;
};

export default function BookingModule({
  state,
  sendEvent,
  editingEventId,
}: BookingModuleProps) {
  const { home, bookings } = state.context;
  const [selectedCard, setSelectedCard] = useState<'yellow' | 'red' | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  useEffect(() => {
    if (editingEventId) {
      const bookingToEdit = bookings.find((b) => b.eventId === editingEventId);
      if (bookingToEdit) {
        setSelectedCard(bookingToEdit.cardType);
        setSelectedPlayerId(bookingToEdit.playerId);
      }
    } else {
      setSelectedCard(null);
      setSelectedPlayerId('');
    }
  }, [editingEventId, bookings]);

  const handleSave = () => {
    if (selectedCard && selectedPlayerId) {
      if (editingEventId) {
        sendEvent({
          type: 'UPDATE_BOOKING',
          eventId: editingEventId,
          bookingUpdate: { playerId: selectedPlayerId, cardType: selectedCard },
        });
      } else {
        sendEvent({
          type: 'CARD_ISSUED',
          booking: { playerId: selectedPlayerId, cardType: selectedCard },
        });
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-semibold">{editingEventId ? 'Edit Booking' : 'Log Booking'}</h3>

      {/* Team Tabs */}
      <div className="flex border-b border-gray-600">
        <button className="py-2 px-4 bg-gray-700 rounded-t-lg font-semibold">
          HOME
        </button>
        <button className="py-2 px-4 text-gray-400 font-semibold">
          AWAY
        </button>
      </div>

      {/* Person Select */}
      <div className="space-y-1">
        <label
          htmlFor="person-select"
          className="block text-sm font-medium text-gray-300"
        >
          Select Person
        </label>
        <select
          id="person-select"
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
        >
          <option value="">Select Person...</option>
          {home.roster.map((player) => (
            <option key={player.playerId} value={player.playerId}>
              {player.number} - {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* Card Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={() => setSelectedCard('yellow')}
          className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg ${
            selectedCard === 'yellow' ? 'ring-2 ring-yellow-400' : ''
          }`}
        >
          Yellow Card
        </button>
        <button
          onClick={() => setSelectedCard('red')}
          className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg ${
            selectedCard === 'red' ? 'ring-2 ring-red-500' : ''
          }`}
        >
          Red Card
        </button>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          {editingEventId ? 'Update Booking' : 'Save Booking'}
        </button>
      </div>
    </div>
  );
}