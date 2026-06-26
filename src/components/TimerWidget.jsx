import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const defaultDuration = { hours: 0, minutes: 5, seconds: 0 };

const format = (value) => String(value).padStart(2, '0');

export default function TimerWidget() {
  const [duration, setDuration] = useState(defaultDuration);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const totalSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;

  useEffect(() => {
    if (!isRunning) return undefined;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalRef.current);
          setIsRunning(false);
          window.alert('Timer completed.');
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalRef.current);
  }, [isRunning]);

  const syncFromFields = (field, value) => {
    const nextDuration = { ...duration, [field]: Math.max(0, Number(value) || 0) };
    setDuration(nextDuration);
    setTimeLeft(nextDuration.hours * 3600 + nextDuration.minutes * 60 + nextDuration.seconds);
  };

  const adjustField = (field, direction) => {
    const limits = field === 'hours' ? 23 : 59;
    const current = duration[field];
    const nextValue = direction === 'up'
      ? Math.min(limits, current + 1)
      : Math.max(0, current - 1);

    syncFromFields(field, nextValue);
  };

  const startTimer = () => {
    setTimeLeft((current) => (current > 0 ? current : totalSeconds));
    if (totalSeconds > 0 || timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setDuration(defaultDuration);
    setTimeLeft(300);
  };

  return (
    <section className="widget timer-widget">
      <div className="timer-layout">
        <div className="timer-ring">
          <div className="timer-ring-inner">{format(Math.floor(timeLeft / 3600))}:{format(Math.floor((timeLeft % 3600) / 60))}:{format(timeLeft % 60)}</div>
        </div>

        <div className="timer-steps">
          <div className="timer-step-col">
            <span>Hours</span>
            <button type="button" onClick={() => adjustField('hours', 'up')}>▲</button>
            <strong>{format(duration.hours)}</strong>
            <button type="button" onClick={() => adjustField('hours', 'down')}>▼</button>
          </div>
          <div className="timer-step-col">
            <span>Minutes</span>
            <button type="button" onClick={() => adjustField('minutes', 'up')}>▲</button>
            <strong>{format(duration.minutes)}</strong>
            <button type="button" onClick={() => adjustField('minutes', 'down')}>▼</button>
          </div>
          <div className="timer-step-col">
            <span>Seconds</span>
            <button type="button" onClick={() => adjustField('seconds', 'up')}>▲</button>
            <strong>{format(duration.seconds)}</strong>
            <button type="button" onClick={() => adjustField('seconds', 'down')}>▼</button>
          </div>
        </div>
      </div>

      <div className="timer-actions timer-actions-figma">
        {!isRunning ? (
          <button type="button" onClick={startTimer}><Play size={16} /> Start</button>
        ) : (
          <button type="button" onClick={pauseTimer}><Pause size={16} /> Pause</button>
        )}
        <button type="button" className="timer-reset" onClick={resetTimer}><RotateCcw size={16} /> Reset</button>
      </div>
    </section>
  );
}