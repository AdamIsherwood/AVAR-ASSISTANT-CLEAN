// src/db/database.test.ts

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db, saveEvent, loadAllEvents } from './database';
import type { BaseEvent } from '../lib/eventSourcing';

describe('Database Functions', () => {

  // Before ALL tests, open the database connection
  beforeAll(async () => {
    await db.open();
  });

  // After ALL tests, close the connection
  afterAll(() => {
    db.close();
  });

  // Before EACH test, clear the events table to ensure a clean slate
  beforeEach(async () => {
    await db.events.clear();
  });

  it('should save an event to the events table', async () => {
    // Arrange
    const newEvent: BaseEvent = { eventId: 'evt-save-1', eventType: 'SAVE_TEST_EVENT' };
    
    // Act
    await saveEvent(newEvent);

    // Assert
    const savedEvent = await db.events.get({ eventId: 'evt-save-1' });
    expect(savedEvent).toBeDefined();
  });

  it('should load all events from the database', async () => {
    // Arrange
    await db.events.bulkAdd([
      { eventId: 'evt-load-1', eventType: 'LOAD_TEST', payload: {} },
      { eventId: 'evt-load-2', eventType: 'LOAD_TEST', payload: {} },
    ]);

    // Act
    // @ts-ignore - Expecting an error as loadAllEvents doesn't exist
    const loadedEvents = await loadAllEvents();

    // Assert
    expect(loadedEvents.length).toBe(2);
  });

});