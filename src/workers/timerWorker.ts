let matchTimerInterval: number | undefined;
let stoppageTimerInterval: number | undefined;
let matchTime = 0;
let stoppageTime = 0;

self.onmessage = (event: MessageEvent) => {
  const message = event.data;

  // Handle object-based messages for new features
  if (typeof message === 'object' && message.type === 'ADJUST_TIME') {
    matchTime += message.amount;
    self.postMessage({ type: 'TICK', time: matchTime });
    return;
  }

  const command = message; // Handle legacy string-based commands
  if (command === 'START') {
    clearInterval(matchTimerInterval);
    matchTimerInterval = self.setInterval(() => {
      matchTime++;
      self.postMessage({ type: 'TICK', time: matchTime });
    }, 1000);
  }

  if (command === 'START_STOPPAGE_TIMER') {
    clearInterval(stoppageTimerInterval);
    stoppageTime = 0;
    stoppageTimerInterval = self.setInterval(() => {
      stoppageTime++;
      self.postMessage({ type: 'STOPPAGE_TICK', time: stoppageTime });
    }, 1000);
  }

  if (command === 'STOP_STOPPAGE_TIMER') {
    clearInterval(stoppageTimerInterval);
    stoppageTime = 0;
    self.postMessage({ type: 'STOPPAGE_TICK', time: 0 });
  }
};