// src/lib/session.ts

import { db } from '../db/database';

/**
 * Checks if there are any events in the database to determine if a session exists.
 * @returns A promise that resolves to true if events exist, otherwise false.
 */
export const hasSavedSession = async (): Promise<boolean> => {
  try {
    // Open the database connection
    await db.open();
    // Count the number of records in the 'events' table
    const eventCount = await db.events.count();
    // If the count is greater than 0, a session exists
    return eventCount > 0;
  } catch (error) {
    console.error("Failed to check for saved session:", error);
    // In case of an error, assume no session exists to be safe.
    return false;
  }
};

// Add these new imports to the top of src/lib/session.ts
import { loadAllEvents } from '../db/database';
import { createEventDispatcher, type BaseEvent } from './eventSourcing';

// ... keep the existing hasSavedSession function ...

/**
 * Restores a session by loading all events from the database and
 * replaying them to create a fully hydrated event dispatcher.
 * @param projection The projection definition to use for state calculation.
 * @returns A promise that resolves to a restored event dispatcher instance.
 */
export const restoreSession = async (projection: {
  initialState: any;
  handlers: { [eventType: string]: (state: any, event: BaseEvent) => any };
}) => {
  // 1. Create a new, clean dispatcher instance
  const dispatcher = createEventDispatcher(projection);

  // 2. Load all historical events from the database
  const eventLog = await loadAllEvents();

  // 3. Replay each event through the dispatcher to rebuild the state
  for (const event of eventLog) {
    dispatcher.dispatch(event);
  }

  // 4. Return the fully restored dispatcher
  return dispatcher;
};