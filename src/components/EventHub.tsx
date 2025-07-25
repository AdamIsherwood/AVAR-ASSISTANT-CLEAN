import { useState } from 'react';
import SubstitutionModule from './SubstitutionModule';
import BookingModule from './BookingModule';
import GoalModule from './GoalModule';
import VARModule from './VARModule';
import type { XStateSend } from '../App';
import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine';

type EventHubProps = {
  isOpen: boolean;
  sendEvent: XStateSend;
  state: StateFrom<typeof matchMachine>;
};

export default function EventHub({ isOpen, sendEvent, state }: EventHubProps) {
  const [activeTab, setActiveTab] = useState('SUBSTITUTION');

  const tabs = ['SUBSTITUTION', 'BOOKING', 'GOAL', 'VAR'];

  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/3 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <button onClick={() => sendEvent({ type: 'TOGGLE_EVENT_HUB' })}>
          Close
        </button>
        <div className="flex border-b border-gray-700 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-semibold ${
                activeTab === tab ? 'bg-gray-700 rounded-t-lg' : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {activeTab === 'SUBSTITUTION' && <SubstitutionModule state={state} sendEvent={sendEvent} />}
          {activeTab === 'BOOKING' && <BookingModule state={state} sendEvent={sendEvent} />}
          {activeTab === 'GOAL' && <GoalModule sendEvent={sendEvent} />}
          {activeTab === 'VAR' && <VARModule sendEvent={sendEvent} />}
        </div>
      </div>
    </div>
  );
}