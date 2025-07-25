\# Technical Architecture & Data

\#\# Technical & Execution Plan

\#\#\# The Toolkit (Services & Technologies)  
\* \*\*Code Editor\*\*: Visual Studio Code (VS Code)  
\* \*\*Language & Framework\*\*: JavaScript with React (using Vite as a build tool)  
\* \*\*Styling\*\*: Tailwind CSS  
\* \*\*Advanced UI Components\*\*: Radix UI or Headless UI (for building accessible and complex components like dialogs and menus).  
\* \*\*State Management\*\*: XState (for managing the formal state machine and application logic)  
\* \*\*Data Persistence\*\*: IndexedDB (for robust, client-side storage of the event log)  
\* \*\*Time Handling\*\*: \`date-fns\` (for robust, immutable date and time logic) and Web Workers (for timer accuracy).  
\* \*\*Report Generation\*\*: \`jsPDF\` (for PDF export) and a JSON export option.  
\* \*\*Offline Support\*\*: A Vite PWA plugin (e.g., \`vite-plugin-pwa\`) to manage the service worker.  
\* \*\*Testing\*\*: A three-tiered testing strategy:  
    \* \*\*Unit/Integration\*\*: Vitest with React Testing Library. Mandating the use of the \`@xstate/test\` library for model-based testing of XState machines.  
    \* \*\*End-to-End (E2E)\*\*: Playwright or Cypress.  
\* \*\*AI Architect\*\*: Gemini Web App (using a custom "AVAR APP CODING ASSISTANT" Gem)  
\* \*\*AI Assistant\*\*: VS Code's integrated Gemini Code Assist extension  
\* \*\*Version Control\*\*: Git & GitHub (with Husky for pre-commit hooks)  
\* \*\*Deployment\*\*: GitHub Actions for automated deployment to one.com hosting.

\#\#\# The Development Workflow (Test-Driven AI Development)  
The workflow is enhanced for robustness and reliability:  
1\.  \*\*Human \- Write a "Feature Brief"\*\*: Describe the desired feature in plain English.  
2\.  \*\*AI \- Generate a Failing Test\*\*: The AI assistant generates a formal test file that defines the feature's requirements.  
3\.  \*\*Human \- Provide Context to AI\*\*: Provide the AI with the failing test and relevant source code.  
4\.  \*\*AI \- Make the Test Pass\*\*: The AI is prompted to write the code that satisfies the test.  
5\.  \*\*Human \- Validate & Refactor\*\*: The developer runs the test suite, reviews the code, and commits the working feature.

\#\#\# The Phased Build Plan

\#\#\#\# Phase \-1: Architectural Foundation (The "Engine")  
\* Set up XState, IndexedDB, and the Web Worker for timers.  
\* Define data schemas for all events and models in \`architecture.md\`.  
\* Implement the core Event Sourcing logic and prove session restoration works.

\#\#\#\# Phase 0: Static Foundation & Layout  
\* Build the main app layout, including the header and empty "card" components for each module.

\#\#\#\# Phase 1: Main Match Control & Clock Logic  
\* Implement the main XState machine for \`matchPhase\`.  
\* Connect the UI to the Web Worker and state machine for clock display.  
\* Implement the \*\*MAIN\*\*, \*\*PAUSE\*\*, and \*\*RESET\*\* button logic.

\#\#\#\# Phase 2: Stoppage System  
\* Implement the logic for \*\*BALL OUT OF PLAY\*\* and \*\*BALL BACK IN PLAY\*\* buttons.  
\* Create the UI for stoppage reason buttons and logic to attach reasons.  
\* Implement the UI elements for "Accurate Time," "Announced Added Time," and "Added Time in Added Time."

\#\#\#\# Phase 3: Event System & Beyond  
\* Implement the Event Registration Hub UI.  
\* Implement the Substitution Module logic.  
\* Implement the Booking Module logic.  
\* Implement the Goal Module logic.  
\* Implement the VAR Module logic.  
\* Implement the Penalty Shootout module.  
\* Implement the "Live Edit" mode.  
\* Implement the Pre-Match Setup screen and logic.  
\* Implement the Final Report generation (JSON and PDF).

\#\# Event Payload Structure for Auditing

Every event object recorded in the immutable log will include the following core metadata fields, in addition to its specific payload data:

\* \*\*eventId\*\*: A unique identifier for this specific event instance (e.g., a UUID).  
\* \*\*eventType\*\*: A string representing the type of event (e.g., \`MATCH\_STARTED\`, \`GOAL\_SCORED\`, \`STOPPAGE\_STARTED\`, \`BOOKING\_CORRECTED\`).  
\* \*\*timestampRaw\*\*: The exact UTC timestamp (e.g., ISO 8601 string or Unix epoch milliseconds) when the event was confirmed by the user.  
\* \*\*timestampMinute\*\*: The rounded-up minute of the match when the event occurred (e.g., 23 for 22:24).  
\* \*\*half\*\*: The match half (e.g., \`FIRST\_HALF\`, \`SECOND\_HALF\`, \`ET\_FIRST\_HALF\`, \`ET\_SECOND\_HALF\`) in which the event occurred.  
\* \*\*userId\*\*: \`\[Unverified\]\`: The ID of the AVAR user who performed the action.  
\* \*\*sessionId\*\*: \`\[Unverified\]\`: A unique identifier for the current application session.  
\* \*\*deviceInfo\*\*: \`\[Unverified\]\`: Basic information about the device used (e.g., browser name/version, operating system, device type like 'tablet').  
\* \*\*payload\*\*: An object containing data specific to the \`eventType\`. This will vary greatly depending on the event.

\#\#\# Examples of Payloads (non-exhaustive)

\* \*\*\`MATCH\_STARTED\`\*\*  
    \`\`\`json  
    { "kickOffTimeActual": "timestamp" }  
    \`\`\`  
\* \*\*\`GOAL\_SCORED\`\*\*  
    \`\`\`json  
    { "teamId": "string", "playerId": "string | null", "isOwnGoal": "boolean" }  
    \`\`\`  
\* \*\*\`SUBSTITUTION\_MADE\`\*\*  
    \`\`\`json  
    { "teamId": "string", "playerInId": "string", "playerOutId": "string", "isConcussionSub": "boolean" }  
    \`\`\`  
\* \*\*\`YELLOW\_CARD\_ISSUED\`\*\*  
    \`\`\`json  
    { "teamId": "string", "personId": "string", "isPlayer": "boolean" }  
    \`\`\`  
\* \*\*\`SECOND\_YELLOW\_ISSUED\`\*\*  
    \`\`\`json  
    { "teamId": "string", "playerId": "string" }  
    \`\`\`  
\* \*\*\`RED\_CARD\_ISSUED\`\*\*  
    \`\`\`json  
    { "teamId": "string", "personId": "string", "isPlayer": "boolean" }  
    \`\`\`  
\* \*\*\`STOPPAGE\_STARTED\`\*\*  
    \`\`\`json  
    { "startTime": "timestamp" }  
    \`\`\`  
\* \*\*\`STOPPAGE\_ENDED\`\*\*  
    \`\`\`json  
    { "stoppageId": "string", "endTime": "timestamp", "reason": "string" }  
    \`\`\`  
\* \*\*\`BOOKING\_CORRECTED\`\*\*  
    \`\`\`json  
    { "incorrectPlayerId": "string", "correctPlayerId": "string", "cardType": "string", "originalBookingEventId": "string" }  
    \`\`\`  
\* \*\*\`MATCH\_PAUSE\_STARTED\`\*\*  
    \`\`\`json  
    { "startTime": "timestamp" }  
    \`\`\`  
\* \*\*\`MATCH\_PAUSE\_ENDED\`\*\*  
    \`\`\`json  
    { "pauseId": "string", "endTime": "timestamp", "durationSeconds": "number" }  
    \`\`\`  
\* \*\*Reversal Events\*\* (e.g., \`GOAL\_DELETED\`, \`HALF\_ENDED\_REVERSED\`)  
    \`\`\`json  
    { "originalEventId": "string", "reason": "string | optional" }  
    \`\`\`  
