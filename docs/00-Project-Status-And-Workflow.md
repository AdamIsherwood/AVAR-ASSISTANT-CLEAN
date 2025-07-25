# Project Status & Refined Workflow

## 1. Current Project Status (as of July 25, 2025)

* **Project Location**: The active project is now `avar-assistant-clean`. The previous project should be considered deprecated.
* **Completed Phases**:
    * Phase P: Prerequisites
    * Phase -1: Architectural Foundation
    * Phase 0: Static Foundation & Layout
    * Phase 1: Main Match Control & Clock Logic
    * Phase 2: Stoppage System
* **Current Task**: We are in the middle of **Phase 3**. The last successfully completed task was the UI and delete functionality for **Task 22: "Live Edit" mode**.

## 2. Key Decisions & Scope Changes

* **"Sin-Bin" Feature**: This feature is **deferred** to a future release. All logic related to sin-bins should be ignored for now.

## 3. Refined AI Workflow

Our workflow has been refined for maximum efficiency and clarity:

* **Three Participants**:
    1.  **Project Manager (Human)**: Manages the project, validates the final output, and fixes minor errors (e.g., file paths).
    2.  **PM Assistant (Web-based Gemini)**: Analyzes the project plan, prepares "Feature Briefs," and creates detailed, single-file prompts.
    3.  **Coder (Gemini Code Assist in VS Code)**: Acts as the "hands," executing the specific, context-rich prompts provided by the PM.
* **Core Process**: The PM Assistant provides a prompt. The PM gives the prompt to the Coder. The PM validates the result. This process is to be followed strictly.

## 4. Key Technical Amendments

The following technical decisions have been made and should be considered canonical:

* **Tailwind CSS**: The project uses **Tailwind CSS v4** with the official `@tailwindcss/vite` plugin. The `postcss.config.js` file is not used. Styles are imported into `src/index.css` using `@import "tailwindcss";`.
* **Testing Environment**: Tests are run with **Vitest** in a **`jsdom`** environment. Browser-specific APIs like `IndexedDB` and `Worker` are mocked using `fake-indexeddb` and `@vitest/web-worker` respectively, configured in a `vitest.setup.ts` file.
* **Web Worker Location**: The TypeScript worker file (`timerWorker.ts`) is located in `src/workers/` and is imported into components using the `?worker` suffix to ensure it is correctly compiled by Vite.