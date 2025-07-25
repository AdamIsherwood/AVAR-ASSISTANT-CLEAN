type MatchClockProps = {
  readonly timeInSeconds: number;
};

export default function MatchClock({ timeInSeconds }: MatchClockProps) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`;

  return <div className="text-6xl font-bold text-center">{formattedTime}</div>;
}