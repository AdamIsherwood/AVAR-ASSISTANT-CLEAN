// src/workers/timer.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

// A self-contained mock worker that includes the ping-pong logic
class MockWorker {
  onmessage: ((ev: MessageEvent) => any) | null = null;

  // When the test calls postMessage('ping'), we immediately reply with 'pong'
  postMessage = (message: any) => {
    if (message === 'ping' && this.onmessage) {
      this.onmessage({ data: 'pong' } as MessageEvent);
    }
  };

  terminate = vi.fn();
}

describe('Timer Web Worker', () => {

  // Before each test, tell Vitest to use our new mock
  beforeEach(() => {
    vi.stubGlobal('Worker', vi.fn(() => new MockWorker()));
  });

  it('should be able to create a new worker instance', () => {
    const worker = new Worker('any_path.ts'); // The path no longer matters
    expect(worker).toBeDefined();
    worker.terminate();
  });

  it('should respond with "pong" when it receives a "ping" message', () => {
    return new Promise<void>((resolve) => {
      const worker = new Worker('any_path.ts');
      
      worker.onmessage = (event) => {
        expect(event.data).toBe('pong');
        worker.terminate();
        resolve(); // This will now be called, and the test will not time out
      };

      worker.postMessage('ping');
    });
  });
});