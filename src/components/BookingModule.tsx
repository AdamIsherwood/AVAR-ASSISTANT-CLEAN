import { useState, useEffect } from 'react';
import type { StateFrom } from 'xstate';
import type { XStateSend } from '../App';
import type { matchMachine } from '../machines/matchMachine';

type BookingModuleProps = {
  state: StateFrom<typeof matchMachine>;
  sendEvent: XStateSend;
  editingEventId: string | null;
};

export default function BookingModule({ state, sendEvent, editingEventId }: BookingModuleProps) {
  const { home, away, bookings } = state.context;
  const [activeTeam, setActiveTeam] = useState<'home' | 'away'>('home');
  const [selectedCard, setSelectedCard] = useState<'yellow' | 'red' | 'second-yellow' | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [selectedPersonType, setSelectedPersonType] = useState<'player' | 'staff'>('player');
  const [showStaff, setShowStaff] = useState(false);

  useEffect(() => {
    if (editingEventId) {
      const bookingToEdit = bookings.find((b) => b.eventId === editingEventId);
      if (bookingToEdit) {
        setSelectedCard(bookingToEdit.cardType as any);
        setSelectedPlayerId(bookingToEdit.playerId);
      }
    }
  }, [editingEventId, bookings]);

  const activeRoster = activeTeam === 'home' ? home.roster : away.roster;

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
          booking: {
            playerId: selectedPlayerId,
            cardType: selectedCard,
            isPlayer: selectedPersonType === 'player',
          },
        });
      }
    }
  };

  const handleTeamSwitch = (team: 'home' | 'away') => {
    setActiveTeam(team);
    setSelectedPlayerId('');
    setSelectedPersonType('player');
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-semibold">{editingEventId ? 'Edit Booking' : 'Log Booking'}</h3>
      <div className="flex border-b border-gray-600">
        <button onClick={() => handleTeamSwitch('home')} className={`py-2 px-4 font-semibold ${activeTeam === 'home' ? 'bg-gray-700 rounded-t-lg' : 'text-gray-400'}`}>HOME</button>
        <button onClick={() => handleTeamSwitch('away')} className={`py-2 px-4 font-semibold ${activeTeam === 'away' ? 'bg-gray-700 rounded-t-lg' : 'text-gray-400'}`}>AWAY</button>
      </div>
      <div className="space-y-1">
        <label htmlFor="person-select" className="block text-sm font-medium text-gray-300">Select Person</label>
        <select id="person-select" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" value={selectedPlayerId} onChange={(e) => { setSelectedPlayerId(e.target.value); setSelectedPersonType('player'); }}>
          <option value="">Select Person...</option>
          {activeRoster.map((player) => (
            <option key={player.playerId} value={player.playerId} disabled={player.status === 'DISMISSED'} className={player.status === 'DISMISSED' ? 'text-gray-500' : ''}>
              {player.number} - {player.name}{player.status === 'DISMISSED' ? ' (Dismissed)' : ''}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => setShowStaff(!showStaff)} className="w-full text-sm text-gray-400 hover:text-white py-1 uppercase">OFF PITCH</button>
      {showStaff && (
        <div className="border-t border-gray-600 pt-4 mt-4 space-y-2">
          <h4 className="text-md font-semibold text-gray-300">Team Staff</h4>
          <button onClick={() => { setSelectedPlayerId('manager'); setSelectedPersonType('staff'); }} className={`w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg ${selectedPlayerId === 'manager' ? 'ring-2 ring-blue-500' : ''}`}>Manager</button>
          <button className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Add Other Staff</button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button onClick={() => setSelectedCard('yellow')} className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg ${selectedCard === 'yellow' ? 'ring-2 ring-yellow-400' : ''}`}>Yellow Card</button>
        <button onClick={() => setSelectedCard('red')} className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg ${selectedCard === 'red' ? 'ring-2 ring-red-500' : ''}`}>Red Card</button>
      </div>
      <div className="pt-4">
        <button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">{editingEventId ? 'Update Booking' : 'Save Booking'}</button>
      </div>
    </div>
  );
}