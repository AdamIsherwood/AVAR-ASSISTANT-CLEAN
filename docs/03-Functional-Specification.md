\# Functional Specification

\#\# Timekeeping & Match Flow

\* \*\*Central State Machine\*\*: The app is driven by a \`matchPhase\` state. A single \*\*MAIN\*\* button dispatches events to this state machine to advance the match through its phases: \`PRE\_MATCH\`, \`FIRST\_HALF\`, \`HALF\_TIME\`, \`SECOND\_HALF\`, \`FULL\_TIME\`, \`ET\_FIRST\_HALF\`, \`ET\_HALF\_TIME\`, \`ET\_SECOND\_HALF\`, \`PENALTIES\`, \`MATCH\_OVER\`. The button's text, function, and color change automatically based on the current match phase.  
\* \*\*MATCH CLOCK\*\*: Displays the official match time in \`MM:SS\` format, aiming to match the official stadium clock. When the match flow is paused, the \*\*MATCH CLOCK\*\* must visually change to clearly indicate its paused state. Manual adjustment via \*\*"Live Edit"\*\* mode must be possible to align with an official stadium clock.  
\* \*\*RESET Button\*\*: A robust undo function exclusively for the last action taken with the \*\*MAIN\*\* button (e.g., END 1ST HALF). It cancels the last \*\*MAIN\*\* button press and restores the button's previous state. Crucially, this is achieved by appending a reversal event to the log, ensuring compliance with Event Sourcing principles. This action forces all relevant timers to catch up to the elapsed real-world time.  
\* \*\*PAUSE Button (Critical Feature)\*\*: A dedicated \*\*PAUSE\*\* button handles major match interruptions (e.g., power failure). Pressing \*\*PAUSE\*\* logs a \`MATCH\_PAUSE\_STARTED\` event and transitions the state machine to a \`MATCH\_PAUSED\` state. Pressing \*\*CONTINUE\*\* logs a \`MATCH\_PAUSE\_ENDED\` event.  
    \* \*\*Interaction with Stoppages\*\*: If \*\*PAUSE\*\* is pressed during an active stoppage, a dialog box will appear, requiring a decision from the user: "Convert Stoppage to Pause" (deletes current stoppage log, its start time becomes pause start time) or "End Stoppage, Start New Pause" (current stoppage concluded and logged, new pause begins immediately).

\#\# Stoppage System & Added Time

\* \*\*Stoppage Control\*\*: A single button toggles between \*\*BALL OUT OF PLAY\*\* (starts a stoppage timer and logs \`STOPPAGE\_STARTED\`) and \*\*BALL BACK IN PLAY\*\* (stops the timer and logs \`STOPPAGE\_ENDED\`).  
\* \*\*Accidental Start\*\*: To handle an accidentally started stoppage, the user must immediately press \*\*BALL BACK IN PLAY\*\* and then manually delete the short entry from the Stoppage Log via \*\*"Live Edit"\*\*.  
\* \*\*Stoppage at Half-End\*\*: If the \*\*MAIN\*\* button is pressed to end a half while a stoppage is running, the stoppage must be automatically stopped and logged correctly. This logged stoppage will be reactivated if the \*\*RESET\*\* button is used.  
\* \*\*Stoppage Timer Adjustment\*\*: \`+1s\` and \`-1s\` buttons must be available to adjust an active stoppage timer. There are no limits to the amount of time that can be added or subtracted. The running timer reacts instantly.  
\* \*\*Stoppage Reasons\*\*: While a stoppage is active, a contextual grid of reason buttons is displayed. The available reasons are: \`VAR CHECK\`, \`TIME WASTING\`, \`INJURY TREATMENT\`, \`OTHER\`, \`SUBSTITUTION\`, \`YELLOW CARD\`, \`RED CARD\`, \`GOAL CELEBRATION\`. Only the most recently selected reason is logged. If no reason is selected, it defaults to "OUT OF PLAY".  
\* \*\*Intelligent Connection (Optional Shortcut)\*\*: If a stoppage is already active and the user selects a relevant reason (e.g., \`SUBSTITUTION\`, \`YELLOW CARD\`, \`RED CARD\`, \`GOAL CELEBRATION\`), the corresponding event module will automatically open. If the user cancels out of the opened event module, the assigned stoppage reason will remain active.  
\* \*\*Added Time Calculation\*\*:  
    \* \*\*Accurate Time\*\*: Displays the precise, accumulated stoppage time for the current half. Deleting a stoppage from the log must always deduct its duration from this value.  
    \* \*\*Rounded Time\*\*: Displays the added time rounded to the nearest whole minute (standard mathematical rounding).  
    \* \*\*Automatic Freeze\*\*: The \*\*Rounded Time\*\* value is automatically "frozen" (locked) when the \*\*MATCH CLOCK\*\* reaches 45:00, 90:00, 105:00, and 120:00. This frozen value represents the officially announced added time. The underlying \*\*Accurate Time\*\* continues to count any further stoppages.  
    \* \*\*"Added Time in Added Time"\*\*: A small secondary counter shows any additional time that accrues from stoppages that occur after the official added time has begun. This counter resets to zero when the half ends.

\#\# Event Logging System

\#\#\# General Event Rules  
\* \*\*Timestamp Rule\*\*: All timestamps in all logs are rounded up to the nearest whole minute (e.g., 03:23 is logged as 4').  
\* \*\*Sorting Rule\*\*: Events logged in the same minute are grouped but sorted in a specific order: 1\) Team, 2\) Event Type, 3\) Player Number.  
\* \*\*Event Type Sorting Priority\*\*: \`GOAL\`, \`CARD\` (RED first, then YELLOW), \`SUBSTITUTION\` (IN first, then OUT), \`VAR OUTCOMES\`.  
\* \*\*Rule Infringements\*\*: When a user proceeds with an action after receiving a rule-infringement warning, the event is logged as normal, without any special flag.

\#\#\# Event Registration Hub  
\* \*\*Core Concept\*\*: A central, slide-in panel for logging all major events, with tabs for \`GOAL\`, \`BOOKING\`, \`SUBSTITUTION\`, and \`VAR\`. It will only appear when relevant.  
\* \*\*Structure\*\*: Contains four primary module tabs. An indicator badge on a tab label (e.g., "Bookings •") will show if it contains unsaved, staged events. The \*\*BOOKING\*\* and \*\*SUBSTITUTION\*\* tabs use a Tabbed Interface at a secondary level to switch between HOME and AWAY teams. Within a team, categories like ON PITCH and TEAM STAFF are presented in an Expanding List (accordion) style.  
\* \*\*Unified Staging Area\*\*: A persistent area at the bottom of the Hub allows the user to stage multiple events. Each module within the Hub maintains its own independent "Dynamic Staging Area" at the bottom of the panel. This area explicitly lists each staged event (e.g., \`\[HOME\] Player \#10: Yellow Card \[x\]\`) for full visibility before committing.  
\* A \*\*SAVE ALL\*\* button dispatches all staged events to the state machine at once. Each module has its own \*\*SAVE ALL\*\* button, which saves only the events staged within that specific module.

\#\#\# Substitution Logic  
\* The UI will track and display the number of substitutions and substitution windows used. It will provide non-blocking warnings if a staged substitution would exceed the allowed limits.  
\* \*\*Multi-Substitution Grouping\*\*: All individual substitutions logged within a single session of the \*\*SUBSTITUTIONS\*\* module are automatically counted as one "substitution window" for each team that made a change. A user can queue multiple substitutions by pressing an \*\*"Add Another Substitution"\*\* button before finalizing with a single \*\*"Save All"\*\* action.  
\* \*\*Window Trigger\*\*: A window is officially "used" when the user saves the changes in the module, not when \*\*BALL BACK IN PLAY\*\* is pressed.  
\* \*\*Free Windows\*\*: Substitutions made before the match begins or during the half-time interval do not count towards the substitution window limit, though they do count towards the total substitution limit.  
\* \*\*Concussion Sub\*\*: A discrete \*\*"Concussion Sub"\*\* toggle is available for each substitution. If a team uses one, both teams are granted one additional substitution and one additional substitution window. This can occur once per team. The toggle does not disappear after use. If a user attempts to use a second one for the same team, a warning is shown. The toggle always reverts to "OFF" after an entry in a multi-sub session to prevent errors. A concussion sub designation can be corrected via \*\*"Live Edit"\*\*.

\#\#\# Booking Logic  
\* \*\*Module Interface\*\*: When opened, the module defaults to a list of ON PITCH players. A button labeled "OFF PITCH" can be clicked to expand the view, revealing two separate lists below: "Bench / Substituted Players" and "Team Staff".  
\* \*\*Live Status\*\*: All lists will feature clear visual indicators: a yellow card icon for players with one yellow, and a red card icon for dismissed individuals. A dismissed person's name will be greyed out and cannot be selected for a new card.  
\* \*\*Second Yellow\*\*: A second yellow to the same player is logged as a unique \`SECOND YELLOW\` event, changing their status to "Dismissed." In the final report, this appears as one yellow and one red card.  
\* \*\*Mistaken Identity\*\*: This logic applies exclusively to yellow cards and is handled by the \`VAR \- MISTAKEN IDENTITY\` event. It will log a single \`BOOKING\_CORRECTED\` event containing the \`incorrectPlayerId\` and \`correctPlayerId\`, ensuring a clear audit trail without altering the incorrect player's booking history.  
\* \*\*Reversing a Dismissal\*\*: A user cannot directly reverse a dismissal. Reversals are the outcome of a VAR check and are logged via a final VAR event type (e.g., \`VAR \- NO RED CARD\`) after confirmation, before the incorrect event is ever logged.  
\* \*\*Cards for Staff\*\*: Staff members who receive a red card are assigned a special "Dismissed" status, which is separate from players' "dismissed" status. Other staff (other than the Manager) are added manually within the module via dynamic creation of staff buttons as needed.

\#\#\# Goal Logic  
\* \*\*Own Goal\*\*: An own goal is registered via a dedicated button.  
\* \*\*Unknown Scorer\*\*: An \*\*"UNKNOWN"\*\* option is available. The user may save this incomplete event after confirming via a warning dialog. The log entry is then visually flagged as incomplete. The goal can later be assigned to a player via \*\*"Live Edit"\*\*. This update should leave no trace in the final Event Log that it was previously unknown.

\#\#\# VAR Logic  
\* \*\*Workflow\*\*: The user starts a stoppage with a temporary reason (e.g., "RED CARD"). If a check occurs, the reason is changed to "VAR CHECK." The final, confirmed decision is what gets logged in the Event Log.  
\* \*\*VAR Event Types\*\*: Specific types must be used when VAR overturns a decision: \`VAR \- GOAL\`, \`VAR \- NO GOAL\`, \`VAR \- RED CARD\`, \`VAR \- NO RED CARD\`, \`VAR \- MISTAKEN IDENTITY\`. If VAR confirms the on-field decision, the normal event type is logged.  
\* \*\*Mistaken Identity Module\*\*: Selecting the \`VAR \- MISTAKEN IDENTITY\` event type will open a dedicated interface. The user will select the player who incorrectly received the yellow card and the player who should have. Upon saving, the system will automatically generate a single \`BOOKING\_CORRECTED\` event.

\#\# Special Game States & Features

\#\#\# Penalty Shootout Module  
\* \*\*Guided Process\*\*: The app provides an advanced module for penalty shootouts.  
\* \*\*Eligible Players\*\*: The pool consists exclusively of players on the pitch at the final whistle.  
\* \*\*Reduce-to-Equalize Rule\*\*: The app must support this rule, and it must be toggleable in the settings. If the user fails to designate a player for equalization, the app will automatically designate the last eligible player who has not yet kicked.  
\* \*\*Functionality\*\*: The module clearly shows whose turn it is, allows flexible registration of kickers, automatically handles the transition to sudden death, and automatically declares a winner when mathematically certain. It must be possible to change the active goalkeeper during the shootout.

\#\#\# Sin Bin (Temporary Dismissal)  
\* \*\*Functionality\*\*: When this rule is active in the settings, all first yellow cards automatically trigger a temporary dismissal. A second yellow card to the same player (even one currently serving a sin bin penalty) results in a permanent dismissal (\`SECOND YELLOW\` event), and the sin bin timer is immediately cancelled and considered "wasted".  
\* A visible, individual countdown timer must start for the dismissed player, and a clear notification must appear when it expires.  
\* If a half ends while a player is in the sin bin, the remaining time carries over to the next half.

\#\#\# Match Abandonment  
\* \*\*Functionality\*\*: To handle extreme cases, a user must be able to end a match prematurely.  
\* \*\*Access\*\*: This function is located in a secondary options menu, not on the main screen, to prevent accidental use.  
\* \*\*Confirmation\*\*: Selecting it opens a full-screen dialog that requires a second, deliberate confirmation press to proceed.  
\* \*\*Logging\*\*: When confirmed, the system logs a \`MATCH ABANDONED\` event and immediately generates the standard post-match report with all data logged up to that point.

\#\#\# Live Edit  
\* A Floating Action Button (FAB) enables \*\*"Live Edit"\*\* mode, where log entries can be clicked for editing. This is exclusively for events, not match setup data.  
\* Deleting an entry performs a complete "undo" of its effects: deleting a goal updates the scoreboard; deleting a red card reinstates the player; deleting a substitution reverses the roster changes and decrements counters; deleting a stoppage corrects the \`accurateStoppageTime\`.  
\* \> \*\[Unverified\]: The detailed UI/UX aspects for the "Live Edit" mode are outside the scope of this master plan and will be addressed in a separate design document.\*  
\* \> \*Acknowledged Complexity: The implementation of "Live Edit" is recognized as an immensely complex architectural undertaking within an Event Sourcing and XState paradigm, requiring careful planning during its implementation phase.\*

\#\#\# Final Report Generation  
\* The application will provide two export options:  
    \* A machine-readable JSON file containing the complete, ordered event log.  
    \* A human-readable, printable PDF report generated using the \`jsPDF\` library with the \`jspdf-autotable\` plugin.  
\* \*\*Content\*\*: This report must include a detailed breakdown: Final Result, Aggregate Result (if applicable), All Events (Goalscorers, cards, subs), Planned vs. Actual Kick-off Times and any delay, for each half (Announced Added Time, Precise Stoppage Time, Additional Stoppages in Added Time, Total Stoppage Time, full list of all stoppages with reason and duration, Actual duration of the half), and Duration of the half-time interval(s).

\#\# Pre- & Post-Match

\#\#\# Settings (Rule Sets)  
\* Allows creation and editing of rule sets for different competitions.  
\* \*\*Adjustable Parameters\*\*: Match Structure (Number/duration of halves, extra time, penalty shootouts), "Second Leg" (Yes/No, with input for the first leg's result), Break Durations (Optional fields for Duration of break before Extra Time and at Extra Time half-time in \`MM:SS\`), Substitution Rules (Max subs, max sub windows, if half-time counts as a window, if re-entry is allowed), Red Card Substitution ("May a player be substituted in for a player who received a red card?" Yes/No), Card Rules (If "Sin Bin" is active and its duration).

\#\#\# Pre-Match Setup  
\* A "Setup Hub" screen acts as the main interface, allowing flexible access to \*\*Teams & Rosters\*\* and \*\*Competition Rules\*\* sections.  
\* A "Final Confirmation" screen is presented after initial setup, showing a read-only summary with options to \*\*START MATCH\*\* or \*\*EDIT SETUP\*\*.  
\* Allows starting a new match or editing existing data, allowing manual entry or loading via a \*\*FETCH DATA\*\* API function.  
\* \> \*\[Unverified\]: The detailed API specification for the FETCH DATA function is outside the scope of this master plan.\*  
\* The \*\*FETCH DATA\*\* function prioritizes Players and the Manager. Other staff are added in-match as required.  
\* Match Setup can be edited at any time (pre-match or in-match) via a dedicated menu option, which opens a \*\*"Live Setup"\*\* mode. The app will proactively notify the user of background API updates, but these updates must be manually fetched and approved by the user to avoid data overwrites.

\#\#\# Post-Match Finalization Experience  
\* Pressing the final \*\*END HALF\*\* button enters a special "Post-Match Mode" for final checks and actions. The main action button becomes \*\*FINALIZE & GENERATE REPORT\*\*, and the \*\*RESET\*\* button remains active as a grace-period undo. A persistent banner warns of any unresolved incomplete entries.  
\* The \*\*FINALIZE\*\* button, after a confirmation dialog, locks all match data and opens the full Post-Match Report screen.

\---  
\#\# Items Outside the Scope of This Specification

The following items have been identified and confirmed as being outside the scope of this functional specification, and will be addressed in separate documentation or at a later stage:

\* \*\*Detailed API Specification for FETCH DATA\*\*: The technical specifics of the API for fetching data (endpoints, data format, authentication, error handling) are not included.  
\* \*\*Detailed UI Sketches/Wireframes\*\*: While textual UI/UX descriptions are provided, explicit, detailed visual design assets are not part of this plan.  
\* \*\*Comprehensive Error Handling for System Failures\*\*: Detailed handling mechanisms for critical system-level errors (e.g., IndexedDB failure, Web Worker crashing, unexpected data formats) are not specified.  
\* \*\*Internationalization/Localization Strategy\*\*: The approach for supporting multiple languages is not defined.  
\* \*\*Detailed UI/UX for "Live Edit" Mode\*\*: The specific interaction flow and visual elements for editing log entries in "Live Edit" mode are not included.  
