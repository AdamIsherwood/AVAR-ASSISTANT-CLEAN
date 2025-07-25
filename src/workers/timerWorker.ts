// src/workers/timerWorker.ts
let matchTimerInterval: number | undefined;
let stoppageTimerInterval: number | undefined;
let matchTime = 0;
let stoppageTime = 0;

self.onmessage = (event: MessageEvent) => {
  const command = event.data;

  if (command === 'START') {
    clearInterval(matchTimerInterval);
    matchTimerInterval = self.setInterval(() => {
      matchTime++;
      self.postMessage({ type: 'TICK', time: matchTime });
    }, 1000);
  } else if (command === 'PAUSE_CLOCK') {
    clearInterval(matchTimerInterval);
  } else if (command === 'RESUME_CLOCK') {
    clearInterval(matchTimerInterval);
    matchTimerInterval = self.setInterval(() => {
      matchTime++;
      self.postMessage({ type: 'TICK', time: matchTime });
    }, 1000);
  } else if (command === 'START_STOPPAGE_TIMER') {
    clearInterval(stoppageTimerInterval);
    stoppageTime = 0;
    stoppageTimerInterval = self.setInterval(() => {
      stoppageTime++;
      self.postMessage({ type: 'STOPPAGE_TICK', time: stoppageTime });
    }, 1000);
  } else if (command === 'STOP_STOPPAGE_TIMER') {
    clearInterval(stoppageTimerInterval);
    stoppageTime = 0;
    self.postMessage({ type: 'STOPPAGE_TICK', time: 0 });
  }
};