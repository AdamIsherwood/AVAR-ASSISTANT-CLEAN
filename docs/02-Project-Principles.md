\# Part 1: Project Overview & Core Principles

\#\# 1.1. Project Purpose

The primary purpose of the application is to serve as a professional tool for Assistant Video Assistant Referees (AVARs) with three core objectives:

\* \*\*Stoppage Timekeeping\*\*: To accurately measure the duration of all game stoppages to ensure a fair calculation of added time.  
\* \*\*Event Logging\*\*: To quickly and precisely register match-deciding events for the official match report.  
\* \*\*Match Overview\*\*: To provide the AVAR with a clear, at-a-glance visual overview of all critical match information.

\*\*\*

\#\# 1.2. Foundational Architectural Principles

This project is governed by a set of foundational principles that will influence every aspect of its design and implementation:

\* \*\*Event Sourcing (Single Source of Truth)\*\*: The application's state is not stored directly. The source of truth is an immutable, append-only log of all events that have occurred (e.g., \`MATCH\_STARTED\`, \`GOAL\_SCORED\`, \`EVENT\_DELETED\`). The current state of the match is always calculated by replaying this log from the most recent snapshot to ensure high performance. This ensures 100% data integrity and auditability.  
\* \*\*State Machine Driven (using XState)\*\*: The entire application is driven by a formal, central \`matchPhase\` state machine (using XState) to prevent impossible states and ensure predictable logic.  
\* \*\*Undo via Reversal Events\*\*: To "undo" an action, the original event is never deleted. Instead, a new reversal event (e.g., \`GOAL\_DELETED { eventId: 'xyz' }\`) is appended to the log. The state calculation logic then knows to ignore the original event.  
\* \*\*System Independence\*\*: The Stoppage System (time-based) and the Event System (goals, cards, etc.) are independent. Logging an event must not automatically start a stoppage, and ending a stoppage must not affect an open event module. An open event module must be closed manually by the user via a "Save" or "Cancel" action, even if the match has already resumed.  
\* \*\*Web Workers for Timers\*\*: All critical timing logic (e.g., \`periodSeconds\`, stoppage timers) will be managed in a Web Worker to prevent timer drift and inaccuracy when the application tab is in the background.  
\* \*\*IndexedDB for Persistence\*\*: The entire event log is automatically and continuously saved to the browser's IndexedDB for robust, client-side storage of the event log.  
\* \*\*Offline-First Progressive Web App (PWA)\*\*: The application will be built as a Progressive Web App (PWA). A service worker will cache all necessary application assets, ensuring the app is fully functional even without an internet connection.

\*\*\*

\#\# 1.3. Core User Experience Philosophy

\* \*\*AVAR is Trusted 100%\*\*: The application is a professional tool. It will warn the user of rule infringements but must never block a user action. The final responsibility always lies with the AVAR. Whatever the AVAR inputs in the app is trusted 100%.  
\* \*\*Calm Design & High-Pressure UX\*\*: The UI must be optimized for a high-pressure, rapid-input environment on a touch-first device (like a tablet). This includes large tap targets, immediate and predictable visual feedback for all interactions (within 100ms), and workflows designed to reduce cognitive load and minimize taps.  
\* \*\*Data is Always Editable\*\*: The user must always have a way to edit or correct any logged event, player roster, or match setup data by appending correction or reversal events to the log. The specific UI for triggering an "undo" will be a "Live Edit" mode.  
