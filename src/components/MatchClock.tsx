import type { StateFrom } from 'xstate';
import type { matchMachine } from '../machines/matchMachine';

type MatchClockProps = {
  readonly timeInSeconds: number;
  readonly state: StateFrom<typeof matchMachine>;
};

export default function MatchClock({ timeInSeconds, state }: MatchClockProps) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`;

  const isPaused = state.matches('MATCH_PAUSED');

  return (
    <div
      className={`text-6xl font-bold text-center ${
        isPaused ? 'text-yellow-500' : ''
      }`}
    >
      {formattedTime}
    </div>
  );
}