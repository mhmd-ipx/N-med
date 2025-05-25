interface TimerDisplayProps {
  timer: number;
}

const TimerDisplay = ({ timer }: TimerDisplayProps) => (
  <div className="text-center">
    <p className="text-sm text-gray-600">
      زمان باقی‌مانده: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
    </p>
  </div>
);

export default TimerDisplay;