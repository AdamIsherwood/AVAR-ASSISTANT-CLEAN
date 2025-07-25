// src/lib/eventSourcing.ts

export type BaseEvent = {
  eventId: string;
  eventType: string;
  payload?: any;
};

export const appendEvent = (eventLog: readonly BaseEvent[], newEvent: BaseEvent): BaseEvent[] => {
  return [...eventLog, newEvent];
};

export const createProjection = (
  eventLog: readonly BaseEvent[],
  projection: {
    initialState: any;
    handlers: { [eventType: string]: (state: any, event: BaseEvent) => any };
  }
) => {
  return eventLog.reduce((state, event) => {
    const handler = projection.handlers[event.eventType];
    return handler ? handler(state, event) : state;
  }, projection.initialState);
};

export const createEventDispatcher = (projection: {
  initialState: any;
  handlers: { [eventType: string]: (state: any, event: BaseEvent) => any };
}) => {
  let eventLog: BaseEvent[] = [];
  let state = projection.initialState;

  const dispatch = (event: BaseEvent) => {
    eventLog = appendEvent(eventLog, event);
    state = createProjection(eventLog, projection);
  };

  return {
    dispatch,
    getState: () => state,
    getEventLog: () => eventLog,
  };
};