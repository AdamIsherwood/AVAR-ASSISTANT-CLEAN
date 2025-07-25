// src/lib/session.test.ts

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '../db/database';
import { hasSavedSession, restoreSession } from './session';
import type { BaseEvent } from './eventSourcing';

describe('Session Functions', () => {

  beforeAll(async () => {
    await db.open();
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(async () => {
    await db.events.clear();
  });

  describe('hasSavedSession', () => {
    it('should return false when there are no events in the database', async () => {
      const result = await hasSavedSession();
      expect(result).toBe(false);
    });

    it('should return true when there are events in the database', async () => {
      await db.events.add({ eventId: 'ses-1', eventType: 'SESSION_TEST' });
      const result = await hasSavedSession();
      expect(result).toBe(true);
    });
  });

  describe('restoreSession', () => {
    it('should load events from DB and restore the dispatcher state', async () => {
      // Arrange: Define specific types for this test's state and events
      type CounterState = { count: number };
      type CounterEvent = BaseEvent & { payload: { amount: number } };

      const counterProjection = {
        initialState: { count: 0 } as CounterState,
        handlers: {
          // Add explicit types to the handler function
          'ADD': (state: CounterState, event: CounterEvent) => ({ ...state, count: state.count + event.payload.amount }),
        }
      };
      await db.events.bulkAdd([
        { eventId: 'res-1', eventType: 'ADD', payload: { amount: 5 } },
        { eventId: 'res-2', eventType: 'ADD', payload: { amount: 10 } },
      ]);

      // Act
      // @ts-ignore - Expecting an error as restoreSession doesn't exist
      const dispatcher = await restoreSession(counterProjection);

      // Assert
      expect(dispatcher).toBeDefined();
      expect(dispatcher.getState().count).toBe(15);
      expect(dispatcher.getEventLog().length).toBe(2);
    });
  });
});