// src/db/database.ts
import Dexie, { type Table } from 'dexie';
// This import fixes the 'Cannot find name BaseEvent' error
import type { BaseEvent } from '../lib/eventSourcing';

export class AppDatabase extends Dexie {
  public events!: Table<BaseEvent>;

  public constructor() {
    super('AVAR_Assistant_DB');
    this.version(1).stores({
      events: '++id, eventId',
    });
  }
}

// Create a single instance of the database
export const db = new AppDatabase();

/**
 * Saves a single event to the 'events' table in the database.
 * @param event The event object to save.
 */
export const saveEvent = async (event: BaseEvent): Promise<void> => {
  try {
    // We use the 'db' instance directly here
    await db.events.add(event);
  } catch (error) {
    console.error("Failed to save event:", error);
  }
};

// Add this new function to the end of src/db/database.ts

/**
 * Loads all events from the 'events' table in the database.
 * @returns A promise that resolves to an array of all events.
 */
export const loadAllEvents = async (): Promise<BaseEvent[]> => {
  try {
    // The toArray() method from Dexie fetches all records from the table.
    const events = await db.events.toArray();
    return events;
  } catch (error) {
    console.error("Failed to load events:", error);
    // Return an empty array in case of an error to prevent the app from crashing.
    return [];
  }
};