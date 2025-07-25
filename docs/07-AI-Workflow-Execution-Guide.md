\# AI Workflow Execution Guide

\---

\#\# \*\*Executing the Test-Driven AI Development (TD-AID) Workflow\*\*

\*This is a systematic process designed to leverage the strengths of AI while mitigating its weaknesses.\*

\#\#\# \*\*Step 1 (Human): Authoring the "Feature Brief"\*\*  
The quality of the entire development cycle is predicated on the quality of the initial "Feature Brief." A standardized template must be used.

\* \*\*Feature Brief Template\*\*:  
    \* \*\*Feature Name\*\*: A concise, descriptive name.  
    \* \*\*User Story\*\*: "As a \[user role\], I want to \[action\], so that I can \[achieve benefit\]."  
    \* \*\*Acceptance Criteria\*\*: A bulleted list of specific, testable conditions. This is the most critical section.  
    \* \*\*Architectural Notes\*\*: Any specific constraints or implementation details to follow.  
    \* \*\*Relevant Files\*\*: A list of primary source files the AI will likely need.

\* \*\*Example Feature Brief\*\*:  
    \* \*\*Feature Name\*\*: Sin-Bin Timer Initiation  
    \* \*\*User Story\*\*: "As an AVAR, I want to start a 10-minute sin-bin timer for a specific player, so that I can accurately track their time off the field."  
    \* \*\*Acceptance Criteria\*\*:  
        \* A "Start Sin-Bin Timer" button is visible and enabled only when the match is in an active, running state.  
        \* Clicking the button dispatches a \`SIN\_BIN\_TIMER\_STARTED\` event.  
        \* The \`SIN\_BIN\_TIMER\_STARTED\` event payload must contain a \`playerId\` (string) and a \`duration\` (number in seconds, e.g., 600).  
        \* The core timer logic must be invoked within the dedicated Web Worker.  
        \* The UI must display a visual countdown timer associated with the correct player.  
    \* \*\*Architectural Notes\*\*: The state transition must be handled within the main \`matchMachine\`. The timer logic itself must not reside in the state machine but in the \`timerWorker\`.  
    \* \*\*Relevant Files\*\*: \`matchMachine.ts\`, \`matchEvents.ts\`, \`timerWorker.ts\`, \`PlayerControls.tsx\`.

\#\#\# \*\*Step 2 (AI): Prompting for Granular Failing Tests\*\*  
The objective is to guide the AI to generate a granular test that focuses on a single piece of functionality.

\* \*\*Technique: Testing State Machine Transitions (XState)\*\*  
    \* \*\*Prompt\*\*:  
        \`\`\`  
        Using the attached Feature Brief for "Sin-Bin Timer Initiation" and referencing our main state machine in \#file:src/machines/matchMachine.ts, generate a single, new, failing Vitest test in \#file:src/machines/matchMachine.test.ts. The test must verify that when the machine is in the 'active\_match.running' state and receives a 'SIN\_BIN\_TIMER\_STARTED' event with a valid payload, it correctly transitions to the 'active\_match.sin\_bin\_active' state and updates its context to include the 'sinBinPlayerId' and 'sinBinEndTime'.  
        \`\`\`

\* \*\*Technique: Testing Event Sourcing Projections ("Given-When-Then")\*\*  
    \* \*\*Prompt\*\*:  
        \`\`\`  
        Generate a failing Vitest test for the 'matchOverviewProjection' found in \#file:src/projections/matchOverview.ts. The test should follow the "Given-When-Then" pattern. Given an event log containing a 'MATCH\_STARTED' event, When a 'SIN\_BIN\_TIMER\_STARTED' event for player 'p123' is added to the log, Then the resulting projection state object should have a 'sinBin' property with the value { isActive: true, playerId: 'p123' }.  
        \`\`\`

\#\#\# \*\*Step 3 (Human): The Art of Context Scoping\*\*  
After the AI generates a single, failing test, the human's sole responsibility is to narrow the AI's focus for the next step by explicitly referencing only the failing test file and the specific source files that require modification.

\#\#\# \*\*Step 4 (AI): Generating Implementation Code\*\*  
With the "Architectural Constitution" providing global guardrails and the hyper-focused context, the AI is now primed to generate compliant code.

\* \*\*Prompt\*\*:  
    \`\`\`  
    The test named 'should start sin-bin timer on SIN\_BIN\_TIMER\_STARTED event' in the file \#file:src/machines/matchMachine.test.ts is currently failing. Make this test pass by modifying ONLY the state machine logic in the file \#file:src/machines/matchMachine.ts. Ensure your implementation strictly adheres to all principles outlined in the project's Architectural Constitution.  
    \`\`\`

\---

\#\# \*\*The AI-Augmented "Validate & Refactor" Step\*\*

\*This framework empowers a non-coding project manager to perform crucial oversight.\*

\#\#\# \*\*A Framework for Non-Technical Code Validation\*\*  
The focus of validation is shifted from the complex implementation code to the more human-readable test code.

1\.  \*\*Confirm Functional Correctness\*\*: Run the project's automated test suite. A passing suite is a strong signal of functional correctness.  
2\.  \*\*Review Test Coverage and Quality\*\*: Use AI to analyze the test against the original Feature Brief.  
    \* \*\*Prompt Example\*\*:  
        \`\`\`  
        Review the test cases in \#file:src/machines/matchMachine.test.ts. Do these tests adequately cover all the acceptance criteria listed in the attached Feature Brief for the "Sin-Bin Timer" feature? What edge cases, if any, are missing?  
        \`\`\`  
3\.  \*\*Assess Architectural and Quality Compliance\*\*: Use specialized tools and targeted AI prompts.

\#\#\# \*\*Prompting for Code Explanation and Review\*\*

\* \*\*High-Level Explanation\*\*:  
    \`\`\`  
    Act as a senior architect communicating with a project manager. Explain the code changes in the latest pull request in simple, non-technical terms. Focus on the "why" behind the changes and what business value they deliver.  
    \`\`\`  
\* \*\*"Code Smell" Identification\*\*:  
    \`\`\`  
    Scan the newly modified file \#file:src/machines/matchMachine.ts for any "code smells." For each one you find, explain what it is using a simple analogy (e.g., "A 'Long Method' is like a single run-on sentence that's hard to read").  
    \`\`\`

\#\#\# \*\*Automating Architectural Compliance Checks\*\*

\* \*\*Tool-Based Enforcement\*\*: Configured tools like Codacy and ESLint provide the first line of defense.  
\* \*\*AI-Based Compliance Audits\*\*: Perform spot-checks with constitution-aware prompts.  
    \* \*\*Prompt (Checking Separation of Concerns)\*\*:  
        \`\`\`  
        Review the React component in \#file:src/components/TimerDisplay.tsx. Does this component contain any business logic or state management that, according to our project Constitution, should be located inside the XState machine?  
        \`\`\`  
    \* \*\*Prompt (Checking Immutability)\*\*:  
        \`\`\`  
        I am reviewing a pull request. Scan all the changed files. Is there any instance where a historical event in the event log is being deleted or modified? This would be a critical violation of our Event Sourcing immutability principle.  
        \`\`\`

\#\#\# \*\*Using AI to Identify Potential Regressions\*\*  
\* \*\*Prompt for Regression Risk Analysis\*\*:  
    \`\`\`  
    Given the code changes submitted in this pull request (diff attached), list the top 3 to 5 existing features or components that are most at risk of a regression. For each identified risk, explain your reasoning in one or two sentences.  
    \`\`\`  
\#\#\# \*\*The Project Manager's Dashboard (CI/CD)\*\*  
The ultimate goal is a high-level dashboard automatically generated for every pull request, consolidating outputs from all automated analysis tools (tests, security scans, quality scans, AI summaries).  
