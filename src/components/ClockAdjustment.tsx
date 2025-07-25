type ClockAdjustmentProps = {
  onAdjust: (amountInSeconds: number) => void;
};

export default function ClockAdjustment({ onAdjust }: ClockAdjustmentProps) {
  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      <button
        onClick={() => onAdjust(60)}
        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-2 rounded-lg text-sm"
      >
        +1 min
      </button>
      <button
        onClick={() => onAdjust(-60)}
        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-2 rounded-lg text-sm"
      >
        -1 min
      </button>
      <button onClick={() => onAdjust(1)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-2 rounded-lg text-sm">
        +1s
      </button>
      <button onClick={() => onAdjust(-1)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-2 rounded-lg text-sm">
        -1s
      </button>
    </div>
  );
}