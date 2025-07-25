# Application Data Structures

This document provides the formal definition for all data structures used in the AVAR Assistant application, including events and data models. It serves as the single source of truth for all data schemas.

## Core Event Metadata

Every event object recorded in the immutable log will include the following core metadata fields, in addition to its specific payload data.

* **eventId**: A unique identifier for this specific event instance (e.g., a UUID).
* **eventType**: A string representing the type of event (e.g., `MATCH_STARTED`, `GOAL_SCORED`).
* **timestampRaw**: The exact UTC timestamp when the event was confirmed by the user.
* **timestampMinute**: The rounded-up minute of the match when the event occurred (e.g., 23 for 22:24).
* **half**: The match half (e.g., `FIRST_HALF`, `SECOND_HALF`) in which the event occurred.
* **payload**: An object containing data specific to the `eventType`.

---

## Event Payload Examples

The following are non-exhaustive examples of the `payload` object for specific event types.

MATCH_STARTED
JSON
{
  "kickOffTimeActual": "timestamp"
}
GOAL_SCORED
JSON

{
  "teamId": "string",
  "playerId": "string | null",
  "isOwnGoal": "boolean"
}
SUBSTITUTION_MADE
JSON

{
  "teamId": "string",
  "playerInId": "string",
  "playerOutId": "string",
  "isConcussionSub": "boolean"
}
YELLOW_CARD_ISSUED
JSON

{
  "teamId": "string",
  "personId": "string",
  "isPlayer": "boolean"
}
SECOND_YELLOW_ISSUED
JSON

{
  "teamId": "string",
  "playerId": "string"
}
RED_CARD_ISSUED
JSON

{
  "teamId": "string",
  "personId": "string",
  "isPlayer": "boolean"
}
STOPPAGE_STARTED
JSON

{
  "startTime": "timestamp"
}
STOPPAGE_ENDED
JSON

{
  "stoppageId": "string",
  "endTime": "timestamp",
  "reason": "string"
}
BOOKING_CORRECTED
JSON

{
  "incorrectPlayerId": "string",
  "correctPlayerId": "string",
  "cardType": "string",
  "originalBookingEventId": "string"
}
MATCH_PAUSE_STARTED
JSON

{
  "startTime": "timestamp"
}
MATCH_PAUSE_ENDED
JSON

{
  "pauseId": "string",
  "endTime": "timestamp",
  "durationSeconds": "number"
}
Reversal Events (e.g., GOAL_DELETED)
JSON

{
  "originalEventId": "string",
  "reason": "string | optional"
}

## Data Model Structures

The following are the core data models used to store information about the match setup, teams, and players.

Player
JSON

{
  "playerId": "string",
  "name": "string",
  "number": "number",
  "isGoalkeeper": "boolean",
  "status": "'ON_PITCH' | 'BENCH' | 'SUBSTITUTED_OUT' | 'DISMISSED'"
}
Team
JSON

{
  "teamId": "string",
  "name": "string",
  "roster": "Player[]",
  "staff": "object[]"
}
MatchSetup
JSON

{
  "matchId": "string",
  "competitionName": "string",
  "teams": {
    "home": "Team",
    "away": "Team"
  },
  "rules": {
    "halves": "number",
    "halfDuration": "number",
    "extraTime": "boolean",
    "extraTimeDuration": "number",
    "penaltyShootout": "boolean",
    "maxSubs": "number",
    "maxSubWindows": "number",
    "sinBinActive": "boolean",
    "sinBinDuration": "number"
  }
}