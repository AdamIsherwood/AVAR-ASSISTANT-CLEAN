import { assign, createMachine } from 'xstate';

type Booking = {
  eventId: string;
  playerId: string;
  cardType: 'yellow' | 'red';
  deleted?: boolean;
};

type Goal = {
  teamId: string;
  playerId: string;
};

type VarReview = {
  outcome: string;
};

type PenaltyOutcome = 'goal' | 'miss';

type Player = {
  playerId: string;
  name: string;
  number: number;
};

export const matchMachine = createMachine({
  id: 'match',
  initial: 'PRE_MATCH',
  context: {
    stoppageActive: false,
    stoppageReason: null as string | null,
    eventHubOpen: false,
    liveEditActive: false,
    editingEventId: null as string | null,
    bookings: [] as Booking[],
    varReviews: [] as VarReview[],
    goals: [] as Goal[],
    penalties: {
      home: [] as PenaltyOutcome[],
      away: [] as PenaltyOutcome[],
    },
    home: {
      substitutionsUsed: 0,
      substitutionWindowsUsed: 0,
      roster: [
        { playerId: 'h-p1', name: 'Player One', number: 1 },
        { playerId: 'h-p2', name: 'Player Two', number: 2 },
        { playerId: 'h-p3', name: 'Player Three', number: 3 },
        { playerId: 'h-p4', name: 'Player Four', number: 4 },
      ] as Player[],
    },
    away: {
      substitutionsUsed: 0,
      substitutionWindowsUsed: 0,
      roster: [
        { playerId: 'a-p1', name: 'Player One', number: 1 },
        { playerId: 'a-p2', name: 'Player Two', number: 2 },
        { playerId: 'a-p3', name: 'Player Three', number: 3 },
        { playerId: 'a-p4', name: 'Player Four', number: 4 },
      ] as Player[],
    },
  },
  on: {
    PAUSE: {
      target: '.MATCH_PAUSED',
    },
    START_EDIT_BOOKING: {
      actions: assign({
        eventHubOpen: true,
        editingEventId: ({ event }) => event.eventId,
      }),
    },
    UPDATE_BOOKING: {
      actions: assign({
        bookings: ({ context, event }) => {
          const newBookings = context.bookings.map((b) =>
            b.eventId === event.eventId ? { ...b, deleted: true } : b,
          );
          newBookings.push({
            ...event.bookingUpdate,
            eventId: crypto.randomUUID(),
          });
          return newBookings;
        },
        editingEventId: null,
        eventHubOpen: false,
      }),
    },
    START_STOPPAGE: {
      actions: assign({
        stoppageActive: true,
      }),
    },
    END_STOPPAGE: {
      actions: assign({
        stoppageActive: false,
      }),
    },
    SET_STOPPAGE_REASON: {
      actions: assign({
        stoppageReason: ({ event }) => event.reason,
      }),
    },
    CARD_ISSUED: {
      actions: assign({
        bookings: ({ context, event }) => [
          ...context.bookings,
          { ...event.booking, eventId: crypto.randomUUID() },
        ],
      }),
    },
    DELETE_BOOKING: {
      actions: assign({
        bookings: ({ context, event }) =>
          context.bookings.map((booking) =>
            booking.eventId === event.eventId
              ? { ...booking, deleted: true }
              : booking
          ),
      }),
    },
    GOAL_SCORED: {
      actions: assign({
        goals: ({ context, event }) => [...context.goals, event.goal],
      }),
    },
    VAR_OUTCOME: {
      actions: assign({
        varReviews: ({ context, event }) => [...context.varReviews, event.review],
      }),
    },
    PENALTY_KICK_RECORDED: {
  actions: assign(({ context, event }) => {
    // This check confirms the event type and its payload for TypeScript
    if (event.type === 'PENALTY_KICK_RECORDED' && 'teamId' in event && 'outcome' in event) {
      if (event.teamId === 'home') {
        return {
          penalties: {
            ...context.penalties,
            home: [...context.penalties.home, event.outcome],
          },
        };
      }
      if (event.teamId === 'away') {
        return {
          penalties: {
            ...context.penalties,
            away: [...context.penalties.away, event.outcome],
          },
        };
      }
    }
    // If the event is not what we expect, make no changes.
    return {};
  }),
},
    SUBSTITUTION_MADE: {
  actions: assign(({ context, event }) => {
    // This check confirms to TypeScript that our event has a teamId
    if (event.teamId === 'home') {
  return {
    home: {
      ...context.home, // This line preserves the roster
      substitutionsUsed: context.home.substitutionsUsed + 1,
      substitutionWindowsUsed: context.home.substitutionWindowsUsed + 1,
    },
  };
}
if (event.teamId === 'away') {
  return {
    away: {
      ...context.away, // This line preserves the roster
      substitutionsUsed: context.away.substitutionsUsed + 1,
      substitutionWindowsUsed: context.away.substitutionWindowsUsed + 1,
    },
  };
}
    // If the event is not what we expect, return an empty object to make no changes.
    return {};
  }),
},
    TOGGLE_LIVE_EDIT: {
      actions: assign({
        liveEditActive: ({ context }) => !context.liveEditActive,
      }),
},
    TOGGLE_EVENT_HUB: {
      actions: assign({
        eventHubOpen: ({ context }) => !context.eventHubOpen,
      }),
    },
  },
  states: {
    PRE_MATCH: {
      on: {
        NEXT: 'FIRST_HALF',
      },
    },
    FIRST_HALF: {
      on: {
        NEXT: 'HALF_TIME',
        RESET: 'PRE_MATCH',
      },
    },
    HALF_TIME: {
      on: {
        NEXT: 'SECOND_HALF',
        RESET: 'FIRST_HALF',
      },
    },
    SECOND_HALF: {
      on: {
        NEXT: 'PENALTIES',
        RESET: 'HALF_TIME',
      },
    },
    PENALTIES: {
      on: {
        NEXT: 'MATCH_OVER',
      },
    },
    MATCH_OVER: {},
    MATCH_PAUSED: {
      on: {
        CONTINUE: {
          target: 'history',
        },
      },
    },
    history: {
      type: 'history',
      history: 'shallow',
    },
  },
});