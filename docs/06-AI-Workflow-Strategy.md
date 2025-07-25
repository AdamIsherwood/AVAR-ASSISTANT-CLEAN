\# AI Workflow Strategy: The Architectural Constitution

The successful development of a complex application like the AVAR Assistant, which is founded on sophisticated architectural patterns, hinges on the consistent and accurate application of these principles by the AI coding assistant. Standard interaction models with Large Language Models (LLMs), which rely on transient conversation history, are insufficient for this purpose. The solution lies not in providing more context, but in providing \*\*smarter, layered, and persistent context\*\*.

This document outlines a formal, multi-layered governance framework designed to embed the project's architectural DNA directly into the AI's operational context.

\#\# 1.1 The "Information Overload" Paradox

Even with very large context windows, feeding an entire codebase into a single prompt is inefficient and often ineffective. The model may struggle to identify the most relevant pieces of information, leading to slower response times and increased costs. More critically, it can dilute the importance of core architectural principles, burying them in a sea of implementation details. A deliberate and curated approach to context management is paramount.

\#\# 1.2 Core Strategy: From Transient Chat to Persistent Knowledge

The AI must not need to be "re-taught" the project's rules in every interaction. The optimal strategy is to create a persistent, structured "brain" for the AI that resides within the project's repository itself. This involves codifying architectural knowledge and making it an integral part of the development environment.

\#\# 1.3 Implementing a Multi-Layered Context Strategy

A single, monolithic "instructions" file would recreate the information overload it is meant to prevent. A more sophisticated, hierarchical governance system is required—one that delivers context at the appropriate level of abstraction. This system is composed of three distinct layers: the \*\*Constitution\*\*, the \*\*Blueprint\*\*, and the \*\*Task Dossier\*\*.

\#\#\# Layer 1: The "Constitution" – Project-Wide Principles

The \*\*Constitution\*\* is the highest level of governance. It is a non-negotiable set of inviolable rules that defines the AI's persona and the core architectural principles. This document is a directive that must be applied to every interaction.

\* \*\*Implementation\*\*: This layer is implemented as a Markdown file located at \`/.github/instructions.md\`. VS Code's Copilot/Gemini integration can be configured to automatically apply this file to every chat request.

\* \*\*Example \`/.github/instructions.md\` (The Constitution)\*\*:  
    \`\`\`markdown  
    \# AI Constitution for the AVAR Assistant Project

    \#\# Persona  
    You are an expert software architect specializing in front-end applications built with React, TypeScript, XState, and the Event Sourcing pattern. You are meticulous, security-conscious, and prioritize clean, maintainable, and testable code that is easy for a non-programmer to validate. You will explain your reasoning in clear, simple terms when asked.

    \#\# Core Architectural Principles (Inviolable Rules)  
    \* \*\*Event Sourcing is the Single Source of Truth\*\*: You will NEVER mutate state directly. All state changes MUST be the result of dispatching a descriptive, immutable event to the state machine. The application's state is always a projection derived by replaying the event log.  
    \* \*\*State is Managed by XState\*\*: All application logic, state transitions, and side effects (like starting timers or making API calls) are managed exclusively within an XState machine. You will not implement stateful logic or business rules inside React components or other modules.  
    \* \*\*Immutability is Paramount\*\*: All data structures, especially events and the XState context object, are to be treated as immutable. When updating the context, you will use immutable patterns (e.g., spread syntax) to create a new object rather than modifying the existing one.  
    \* \*\*Undo via Reversal Events\*\*: To undo a user action, you will generate and append a new "reversal event" to the event log (e.g., MATCH\_TIMER\_UNDO\_START). You will NEVER delete, alter, or ignore a previously recorded event. The history must remain intact.  
    \* \*\*Timers in Web Workers\*\*: All critical, real-time timing logic (e.g., match clock, sin-bin timers, stopwatches) MUST be implemented and run within a dedicated Web Worker. This is to prevent timer drift and ensure the main UI thread remains responsive. Communication with the worker will be handled via messages.  
    \`\`\`

\#\#\# Layer 2: The "Blueprint" – Task-Specific Context

The \*\*Blueprint\*\* layer provides pre-packaged context for recurring, complex tasks, ensuring consistency and reducing cognitive load.

\* \*\*Implementation\*\*: This can be achieved using \*\*VS Code Prompt Files\*\* (in \`/.github/prompts/\`) or \*\*GitHub Copilot Spaces\*\*. Spaces are the superior tool, allowing for the bundling of code files, documentation, and custom instructions into a reusable container (e.g., \`XState-Testing-Space\`, \`Event-Projection-Space\`).

\* \*\*Example Blueprint (as a Copilot Space named \`XState-Failing-Test-Blueprint\`)\*\*:  
    \* \*\*Attached Context Files\*\*:  
        \* \`src/machines/matchMachine.ts\`  
        \* \`src/machines/matchMachine.test.ts\`  
        \* \`docs/testing\_guidelines.md\`  
    \* \*\*Custom Instructions for the Space\*\*:  
        \> You are in "Test Generation Mode." Your goal is to create a single, granular, failing Vitest test case based on the user's Feature Brief. The test must follow the "Arrange, Act, Assert" pattern. It should assert the final state value and any changes to the machine's context.

\#\#\# Layer 3: The "Task Dossier" – In-the-Moment Context

This layer represents the execution of the core Test-Driven AI Development (TD-AID) workflow. The key is providing the most minimal, focused context necessary to complete the immediate step.

\* \*\*Implementation\*\*: This is managed directly within the VS Code chat interface using the \`\#file:\` mention feature to explicitly reference only relevant files.

\* \*\*Example Interaction\*\*:  
    1\.  \*\*Human (PM)\*\*: (Invokes the \`XState-Failing-Test-Blueprint\` Space) Generate a failing test for the "Start Sin-Bin Timer" feature.  
    2\.  \*\*AI\*\*: (Generates the failing test in \`matchMachine.test.ts\`)  
    3\.  \*\*Human (PM)\*\*: Using the failing test in \`\#file:src/machines/matchMachine.test.ts\`, make the test pass by implementing the required logic in \`\#file:src/machines/matchMachine.ts\`. Adhere strictly to the project Constitution.

\#\# 1.4 Advanced Context Management: A Comparative Look

\* \*\*GitHub Copilot Spaces\*\*: The superior tool for implementing the \*\*"Blueprint"\*\* layer.  
\* \*\*Gemini Code Assist Agent Mode\*\*: Best reserved for large-scale, cross-cutting refactoring tasks where a holistic understanding is necessary. The agent should always be required to present a detailed plan for approval before it modifies any code.  
