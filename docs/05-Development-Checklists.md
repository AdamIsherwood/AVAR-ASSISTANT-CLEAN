\# Development Checklists

\---

\#\# \*\*Phase \-1: Architectural Foundation (The "Engine")\*\*

\*This is the core iterative process you will follow for each development task in this phase.\*

\#\#\# \*\*Task 2: Define Data Structures\*\*  
\* \*\*Goal\*\*: Formally define the structure of all events and data models in \`src/architecture.md\`.  
\* \*\*Your Action (Step 2a \- Initial AI Generation)\*\*:  
    \* \*\*Prompt the AI\*\*:  
        \`\`\`  
        Take the 'Proposed Event Payload Structure for Auditing' from the AVAR Assistant Master Plan (Part 4\) and format it into a clear, readable Markdown file suitable for src/architecture.md. Include the core metadata fields and the examples of payload for specific event types. Ensure it's clear and easy to read for documentation.  
        \`\`\`  
    \* \*\*Review AI Output\*\*: Copy the AI's output into \`src/architecture.md\` in VS Code. Review for clarity and accuracy.  
\* \*\*Your Action (Step 2b \- AI Generation for Additional Data Models)\*\*:  
    \* \*\*Prompt the AI\*\*:  
        \`\`\`  
        Define the data structures for Player, Team, and MatchSetup to be added to src/architecture.md. Consider all relevant functional requirements from the AVAR Assistant Master Plan (e.g., player status, team names, substitution rules, match duration). Ensure they are structured as clear JSON-like objects in Markdown.  
        \`\`\`  
    \* \*\*Review AI Output\*\*: Append the AI's output to \`src/architecture.md\`. Review for clarity and accuracy.

\#\#\# \*\*Task 3: Implement the core Event Sourcing Engine\*\*  
\*For each sub-task, you will follow the general AI-driven development workflow:\*  
\* \*\*Event Appending Function\*\*:  
    \* \*\*Your Action\*\*: Write a "Feature Brief" for this function (e.g., "Create a function \`appendEvent(event)\` that adds an immutable event object to an in-memory array representing the event log.").  
    \* \*\*Your Action\*\*: Prompt the AI to generate a failing test for \`appendEvent\`.  
    \* \*\*Your Action\*\*: Ask the AI to suggest relevant files for \`appendEvent\` implementation.  
    \* \*\*Your Action\*\*: Provide context (test file, suggested source files) and prompt the AI to "Make this test pass."  
    \* \*\*Your Action\*\*: Validate & Refactor the AI's code (using AI assistance as needed).  
\* \*\*Basic State Projection Function\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Event Dispatch Mechanism\*\*: \*(Follow the same workflow as above)\*

\#\#\# \*\*Task 4: Implement Data Persistence (using IndexedDB)\*\*  
\*For each sub-task, you will follow the general AI-driven development workflow:\*  
\* \*\*IndexedDB Database Initialization\*\*:  
    \* \*\*Goal\*\*: Define the IndexedDB database schema (database name, version, and object stores) using Dexie.js.  
    \* \*\*Your Action\*\*: Write a "Feature Brief" for this.  
    \* \*\*Your Action\*\*: Prompt the AI to generate a failing test.  
    \* \*\*Your Action\*\*: Ask the AI to suggest relevant files.  
    \* \*\*Your Action\*\*: Provide context and prompt the AI to "Make this test pass."  
    \* \*\*Your Action\*\*: Validate & Refactor.  
\* \*\*Event Saving Function\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Event Loading Function\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Error Handling for Persistence\*\*: \*(Follow the same workflow as above)\*

\#\#\# \*\*Task 5: Implement Session Restoration\*\*  
\*For each sub-task, you will follow the general AI-driven development workflow:\*  
\* \*\*Check for Saved Session\*\*:  
    \* \*\*Goal\*\*: Implement logic to check if there's an existing event log in IndexedDB when the application starts.  
    \* \*\*Your Action\*\*: Write a "Feature Brief" for this.  
    \* \*\*Your Action\*\*: Prompt the AI to generate a failing test.  
    \* \*\*Your Action\*\*: Ask the AI to suggest relevant files.  
    \* \*\*Your Action\*\*: Provide context and prompt the AI to "Make this test pass."  
    \* \*\*Your Action\*\*: Validate & Refactor.  
\* \*\*Load Events from IndexedDB\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Replay Events to Restore State\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Application Initialization with Restored State\*\*: \*(Follow the same workflow as above)\*

\#\#\# \*\*Task 6: Implement the Timer Web Worker\*\*  
\*For each sub-task, you will follow the general AI-driven development workflow:\*  
\* \*\*Web Worker File Setup\*\*:  
    \* \*\*Goal\*\*: Create the basic Web Worker file (e.g., \`src/workers/timerWorker.js\` or \`.ts\`).  
    \* \*\*Your Action\*\*: Write a "Feature Brief" for this.  
    \* \*\*Your Action\*\*: Prompt the AI to generate a failing test.  
    \* \*\*Your Action\*\*: Ask the AI to suggest relevant files.  
    \* \*\*Your Action\*\*: Provide context and prompt the AI to "Make this test pass."  
    \* \*\*Your Action\*\*: Validate & Refactor.  
\* \*\*Basic Message Listener\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Core Timer Logic (within Worker)\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Message Posting (Worker to Main App)\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Main App \- Worker Communication Setup\*\*: \*(Follow the same workflow as above)\*

\---  
\#\# \*\*Phase 0: Static Foundation & Layout\*\*

\*For each sub-task in this phase, you will follow the general AI-driven development workflow.\*

\#\#\# \*\*Static Layout Tasks\*\*

\* \*\*Tailwind CSS Setup\*\*:  
    \* \*\*Goal\*\*: Configure Tailwind CSS in the React project.  
    \* \*\*Your Action\*\*: Write a "Feature Brief" for this.  
    \* \*\*Your Action\*\*: Prompt the AI to generate a failing test (e.g., checking for Tailwind classes).  
    \* \*\*Your Action\*\*: Ask the AI to suggest relevant files.  
    \* \*\*Your Action\*\*: Provide context and prompt the AI to "Make this test pass."  
    \* \*\*Your Action\*\*: Validate & Refactor.  
\* \*\*Overall Page Structure & Background\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Header Component (Static)\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Main Dashboard Layout (Modular Grid)\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Basic Typography & Font Setup\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Floating Action Button (FAB) Placeholder\*\*: \*(Follow the same workflow as above)\*  
\* \*\*Basic Responsive Layout & Mobile-First Considerations\*\*: \*(Follow the same workflow as above)\*

\#\#\# \*\*UI/UX Review (Non-TD-AID Step)\*\*

\* \*\*Goal\*\*: Review the static layout for overall visual appeal, responsiveness, and adherence to "Calm Design" principles.  
\* \*\*Your Action\*\*: Manually review the layout using your CSS knowledge. You can also prompt the AI for feedback:  
    \`\`\`  
    Review the responsive layout of the main dashboard. Are there any areas that could be improved for calm design or high-pressure UX?  
    \`\`\`  
\---  
\#\# \*\*Phases 1, 2, & 3: Feature Implementation\*\*

\*For each task in these phases, you will follow the general AI-driven development workflow (Feature Brief \-\> Failing Test \-\> Code \-\> Validate/Refactor).\*

\#\#\# \*\*Phase 1: Main Match Control & Clock Logic \- Complete\*\*

1\.  \*\*Task 8\*\*: Implement the State Machine  
2\.  \*\*Task 9\*\*: Connect the Main Clock  
3\.  \*\*Task 10\*\*: Implement the MAIN Button Logic  
4\.  \*\*Task 11\*\*: Implement the PAUSE Button Logic  
5\.  \*\*Task 12\*\*: Implement the RESET Button Logic

\#\#\# \*\*Phase 2: Stoppage System \- Complete\*\*

1\.  \*\*Task 13\*\*: Implement Stoppage Control  
2\.  \*\*Task 14\*\*: Implement Stoppage Reasons  
3\.  \*\*Task 15\*\*: Implement Added Time Display

\#\#\# \*\*Phase 3: Event System & Beyond \- Complete\*\*

1\.  \*\*Task 16\*\*: Implement the Event Registration Hub UI  
2\.  \*\*Task 17\*\*: Implement the Substitution Module logic  
3\.  \*\*Task 18\*\*: Implement the Booking Module logic  
4\.  \*\*Task 19\*\*: Implement the Goal Module logic  
5\.  \*\*Task 20\*\*: Implement the VAR Module logic  
6\.  \*\*Task 21\*\*: Implement the Penalty Shootout module  
7\.  \*\*Task 22\*\*: Implement the "Live Edit" mode  
8\.  \*\*Task 23\*\*: Implement the Pre-Match Setup screen and logic  
9\.  \*\*Task 24\*\*: Implement the Final Report generation (JSON and PDF)  
