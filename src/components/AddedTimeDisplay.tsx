type AddedTimeDisplayProps = {
  accurateTime: number; // in seconds
};

export default function AddedTimeDisplay({
  accurateTime,
}: AddedTimeDisplayProps) {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const roundedTime = Math.round(accurateTime / 60);

  return (
    <div className="mt-4 text-center space-y-2">
      <p className="text-md text-gray-300">
        <span className="font-semibold uppercase text-gray-400 text-sm block">Accurate Time</span>{' '}
        {formatTime(accurateTime)}
      </p>
      <p className="text-3xl font-bold">
        <span className="font-semibold uppercase text-gray-400 text-sm block">Announced Added Time</span> {roundedTime}
      </p>
    </div>
  );
}