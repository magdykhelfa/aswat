
import React from 'react';

export const THEME = {
  primary: '#064e3b', // Deep Spiritual Green
  secondary: '#b45309', // Deep Gold
  accent: '#fef3c7', // Light Amber/Gold
  white: '#ffffff',
  gray: '#f8fafc'
};

export const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 md:gap-4 text-center justify-center">
      {[
        { label: 'يوم', value: timeLeft.days },
        { label: 'ساعة', value: timeLeft.hours },
        { label: 'دقيقة', value: timeLeft.minutes },
        { label: 'ثانية', value: timeLeft.seconds }
      ].map((item, idx) => (
        <div key={idx} className="bg-white/10 backdrop-blur-md p-2 md:p-3 rounded-lg border border-white/20 min-w-[60px] md:min-w-[80px]">
          <div className="text-xl md:text-3xl font-bold text-white">{item.value}</div>
          <div className="text-[9px] md:text-xs text-amber-200">{item.label}</div>
        </div>
      ))}
    </div>
  );
};
