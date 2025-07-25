// src/lib/eventSourcing.test.ts

import { describe, it, expect } from 'vitest';
import { appendEvent, createProjection, createEventDispatcher, type BaseEvent } from './eventSourcing';

describe('appendEvent', () => {
  it('should append a new event to the event log', () => {
    const eventLog: BaseEvent[] = [];
    const newEvent: BaseEvent = { eventId: 'evt-1', eventType: 'TEST_EVENT' };
    const updatedLog = appendEvent(eventLog, newEvent);
    expect(updatedLog.length).toBe(1);
    expect(updatedLog[0]).toEqual(newEvent);
  });
});

describe('createProjection', () => {
  it('should project a final state from an event log', () => {
    type CounterState = { count: number };
    type CounterEvent = BaseEvent & { payload?: { amount?: number } };
    const counterProjection = {
      initialState: { count: 0 } as CounterState,
      handlers: {
        'INCREMENT': (state: CounterState, event: CounterEvent) => ({ ...state, count: state.count + (event.payload?.amount || 1) }),
        'DECREMENT': (state: CounterState, event: CounterEvent) => ({ ...state, count: state.count - (event.payload?.amount || 1) }),
      }
    };
    const eventLog: CounterEvent[] = [
      { eventId: '1', eventType: 'INCREMENT', payload: { amount: 2 } },
      { eventId: '2', eventType: 'DECREMENT', payload: { amount: 1 } },
      { eventId: '3', eventType: 'INCREMENT', payload: { amount: 5 } },
    ];
    const finalState = createProjection(eventLog, counterProjection);
    expect(finalState.count).toBe(6);
  });
});

describe('createEventDispatcher', () => {
  it('should dispatch an event, update the log, and update the state', () => {
    type CounterState = { count: number };
    type CounterEvent = BaseEvent & { payload?: { amount?: number } };
    const counterProjection = {
      initialState: { count: 0 } as CounterState,
      handlers: {
        'INCREMENT': (state: CounterState, event: CounterEvent) => ({ ...state, count: state.count + (event.payload?.amount || 1) }),
      }
    };
    const dispatcher = createEventDispatcher(counterProjection);
    const eventToDispatch: CounterEvent = { eventId: '4', eventType: 'INCREMENT', payload: { amount: 10 } };
    dispatcher.dispatch(eventToDispatch);
    expect(dispatcher.getState().count).toBe(10);
    expect(dispatcher.getEventLog().length).toBe(1);
    expect(dispatcher.getEventLog()[0]).toEqual(eventToDispatch);
  });
});