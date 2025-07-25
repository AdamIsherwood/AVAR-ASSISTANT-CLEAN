import { createMachine, assign, sendTo } from 'xstate';
import { fromCallback } from 'xstate';
import TimerWorker from '../workers/timerWorker?worker';

// Helper Types
type Player = { playerId: string; name: string; number: number; status: string };
type TeamContext = {
  substitutionsUsed: number;
  substitutionWindowsUsed: number;
  maxSubstitutions: number;
  maxSubstitutionWindows: number;
  roster: Player[];
};
type Booking = {
  eventId: string;
  playerId: string;
  cardType: string;
  isPlayer?: boolean;
  deleted?: boolean;
};

export const matchMachine = createMachine({
  id: 'match',
  initial: 'PRE_MATCH',
 invoke: {
  id: 'timerWorker',
  src: fromCallback(({ sendBack, receive }) => {
    const worker = new TimerWorker();

    worker.onmessage = (event) => {
      sendBack(event.data);
    };

    receive((event) => {
      worker.postMessage(event.type);
    });

    return () => worker.terminate();
  }),
},
  context: {
    stoppageActive: false,
    stoppageReason: null as string | null,
    eventHubOpen: false,
    liveEditActive: false,
    editingEventId: null as string | null,
    bookings: [] as Booking[],
    varReviews: [] as any[],
    goals: [] as any[],
    penalties: { home: [] as string[], away: [] as string[] },
    home: {
      substitutionsUsed: 0,
      substitutionWindowsUsed: 0,
      maxSubstitutions: 5,
      maxSubstitutionWindows: 3,
      roster: [
        { playerId: 'h-p1', name: 'Player One', number: 1, status: 'ON_PITCH' },
        { playerId: 'h-p2', name: 'Player Two', number: 2, status: 'ON_PITCH' },
        { playerId: 'h-p3', name: 'Player Three', number: 3, status: 'ON_PITCH' },
      ],
    } as TeamContext,
    away: {
      substitutionsUsed: 0,
      substitutionWindowsUsed: 0,
      maxSubstitutions: 5,
      maxSubstitutionWindows: 3,
      roster: [
        { playerId: 'a-p1', name: 'Player One (Away)', number: 1, status: 'ON_PITCH' },
        { playerId: 'a-p2', name: 'Player Two (Away)', number: 2, status: 'ON_PITCH' },
        { playerId: 'a-p3', name: 'Player Three (Away)', number: 3, status: 'ON_PITCH' },
      ],
    } as TeamContext,
    matchTime: 0,
    announcedAddedTime: null as number | null,
    totalStoppageTime: 0,
    stoppageStartTime: 0,
  },
  states: {
    PRE_MATCH: { on: { NEXT: 'IN_MATCH.FIRST_HALF' } },
    IN_MATCH: {
      initial: 'FIRST_HALF',
      states: {
        FIRST_HALF: { on: { NEXT: 'HALF_TIME', RESET: '#match.PRE_MATCH' } },
        HALF_TIME: { on: { NEXT: 'SECOND_HALF', RESET: 'FIRST_HALF' } },
        SECOND_HALF: { on: { NEXT: 'PENALTIES', RESET: 'HALF_TIME' } },
        PENALTIES: { on: { NEXT: '#match.MATCH_OVER' } },
        history: { type: 'history', history: 'deep' },
      },
      on: {
        PAUSE: {
          target: '#match.MATCH_PAUSED',
          actions: sendTo('timerWorker', { type: 'PAUSE_CLOCK' }),
        },
      },
    },
    MATCH_PAUSED: {
      on: {
        CONTINUE: {
          target: 'IN_MATCH.history',
          actions: sendTo('timerWorker', { type: 'RESUME_CLOCK' }),
        },
      },
    },
    MATCH_OVER: { type: 'final' },
  },
  on: {
  'TICK': {
    actions: assign({ matchTime: ({ event }) => event.time }),
  },
    TOGGLE_EVENT_HUB: {
        actions: assign({
        eventHubOpen: ({ context }) => !context.eventHubOpen,
      }),
    },
    START_STOPPAGE: {
      actions: assign({ 
        stoppageActive: true,
        stoppageStartTime: Date.now()
      }),
    },
    END_STOPPAGE: {
      actions: assign({ 
        stoppageActive: false, 
        stoppageReason: null,
        totalStoppageTime: ({ context }) => context.totalStoppageTime + (Date.now() - context.stoppageStartTime) / 1000
      }),
    },
    SET_STOPPAGE_REASON: {
      actions: assign({
        stoppageReason: ({ event }) => event.reason,
      }),
    },
    SUBSTITUTION_MADE: {
      actions: assign(({ context, event }) => {
        if (event.type !== 'SUBSTITUTION_MADE') return {};
        const { teamId, isConcussionSub } = event;
        
        let newHomeContext = context.home;
        let newAwayContext = context.away;

        if (isConcussionSub) {
            newHomeContext = {...newHomeContext, maxSubstitutions: newHomeContext.maxSubstitutions + 1, maxSubstitutionWindows: newHomeContext.maxSubstitutionWindows + 1};
            newAwayContext = {...newAwayContext, maxSubstitutions: newAwayContext.maxSubstitutions + 1, maxSubstitutionWindows: newAwayContext.maxSubstitutionWindows + 1};
        }

        if (teamId === 'home') {
          newHomeContext = {...newHomeContext, substitutionsUsed: newHomeContext.substitutionsUsed + 1, substitutionWindowsUsed: newHomeContext.substitutionWindowsUsed + 1};
        } else if (teamId === 'away') {
          newAwayContext = {...newAwayContext, substitutionsUsed: newAwayContext.substitutionsUsed + 1, substitutionWindowsUsed: newAwayContext.substitutionWindowsUsed + 1};
        }
        
        return { home: newHomeContext, away: newAwayContext };
      }),
    },
    CARD_ISSUED: {
      actions: assign(({ context, event }) => {
        if (event.type !== 'CARD_ISSUED') return {};
        const { booking } = event;
        const playerHasYellow = context.bookings.some(
          (b: Booking) => b.playerId === booking.playerId && b.cardType === 'yellow'
        );
        const isSecondYellow = booking.cardType === 'yellow' && playerHasYellow;
        const finalBooking = { ...booking, eventId: `booking-${Date.now()}`, cardType: isSecondYellow ? 'second-yellow' : booking.cardType };
        const newBookings = [...context.bookings, finalBooking];
        
        let newHomeRoster = context.home.roster;
        let newAwayRoster = context.away.roster;

        if (isSecondYellow || booking.cardType === 'red') {
          const updateRoster = (roster: Player[]) =>
            roster.map((player) =>
              player.playerId === booking.playerId ? { ...player, status: 'DISMISSED' } : player
            );
          if (context.home.roster.some((p) => p.playerId === booking.playerId)) {
            newHomeRoster = updateRoster(context.home.roster);
          } else if (context.away.roster.some((p) => p.playerId === booking.playerId)) {
            newAwayRoster = updateRoster(context.away.roster);
          }
        }
        return {
          bookings: newBookings,
          home: { ...context.home, roster: newHomeRoster },
          away: { ...context.away, roster: newAwayRoster },
        };
      }),
    },
    GOAL_SCORED: {
        actions: assign({
            goals: ({ context, event }) => {
                if(event.type !== 'GOAL_SCORED') return context.goals;
                return [...context.goals, event.goal]
            }
        })
    },
    VAR_OUTCOME: {
        actions: assign({
            varReviews: ({ context, event }) => {
                if(event.type !== 'VAR_OUTCOME') return context.varReviews;
                return [...context.varReviews, event.review]
            }
        })
    },
    PENALTY_KICK_RECORDED: {
        actions: assign(({ context, event }) => {
            if (event.type !== 'PENALTY_KICK_RECORDED') return {};
            if (event.teamId === 'home') {
              return { penalties: { ...context.penalties, home: [...context.penalties.home, event.outcome] } };
            }
            if (event.teamId === 'away') {
              return { penalties: { ...context.penalties, away: [...context.penalties.away, event.outcome] } };
            }
            return {};
        })
    },
    TOGGLE_LIVE_EDIT: {
        actions: assign({
            liveEditActive: ({ context }) => !context.liveEditActive
        })
    },
    DELETE_BOOKING: {
        actions: assign({
            bookings: ({ context, event }) => {
                if(event.type !== 'DELETE_BOOKING') return context.bookings;
                return context.bookings.map(b => b.eventId === event.eventId ? {...b, deleted: true} : b)
            }
        })
    },
    START_EDIT_BOOKING: {
        actions: assign({
            eventHubOpen: true,
            editingEventId: ({ event }) => {
                if(event.type !== 'START_EDIT_BOOKING') return null;
                return event.eventId;
            }
        })
    },
    UPDATE_BOOKING: {
        actions: assign({
            bookings: ({ context, event }) => {
                if(event.type !== 'UPDATE_BOOKING') return context.bookings;
                return context.bookings.map(b => b.eventId === event.eventId ? {...b, ...event.bookingUpdate} : b)
            },
            editingEventId: null,
            eventHubOpen: false
        })
    }
  }
});