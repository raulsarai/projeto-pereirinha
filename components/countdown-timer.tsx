"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string | null;
  label?: string;
  expiredMessage?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({
  targetDate,
  label = "Inscricoes fecham em:",
  expiredMessage = "Inscricoes encerradas",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    function tick() {
      const tl = getTimeLeft(targetDate!);
      setTimeLeft(tl);
      if (
        tl.days === 0 &&
        tl.hours === 0 &&
        tl.minutes === 0 &&
        tl.seconds === 0
      ) {
        setExpired(true);
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) {
    return <p className="text-sm text-secondary">Carregando prazo...</p>;
  }

  if (expired) {
    return (
      <div className="rounded-lg bg-destructive/10 px-4 py-3 text-center">
        <p className="font-bold text-destructive">{expiredMessage}</p>
      </div>
    );
  }

  const urgency =
    timeLeft.days <= 3
      ? "text-destructive"
      : "text-accent";

  const blocks = [
    { value: timeLeft.days, label: "Dias" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium text-primary">
        {label}
      </p>
      <div className="flex gap-3">
        {blocks.map((block) => (
          <div key={block.label} className="flex flex-col items-center">
            <span
              className={`font-display text-3xl font-bold text-primary tabular-nums ${urgency} md:text-4xl`}
            >
              {String(block.value).padStart(2, "0")}
            </span>
            <span className="text-xs uppercase tracking-wider text-primary opacity-70">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}