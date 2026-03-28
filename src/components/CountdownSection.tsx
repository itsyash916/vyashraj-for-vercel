import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type CountdownParts = { years: number; months: number; days: number; hours: number; seconds: number };

const ZERO_PARTS: CountdownParts = { years: 0, months: 0, days: 0, hours: 0, seconds: 0 };

const addYears = (date: Date) => {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + 1);
  return next;
};

const addMonths = (date: Date) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return next;
};

const getCountdownParts = (targetIso: string): CountdownParts => {
  const now = new Date();
  const target = new Date(targetIso);

  if (Number.isNaN(target.getTime()) || target <= now) return ZERO_PARTS;

  let cursor = new Date(now);
  let years = 0;
  let months = 0;

  while (addYears(cursor) <= target) {
    cursor = addYears(cursor);
    years += 1;
  }

  while (addMonths(cursor) <= target) {
    cursor = addMonths(cursor);
    months += 1;
  }

  const diff = target.getTime() - cursor.getTime();
  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  return {
    years,
    months,
    days: Math.floor(diff / day),
    hours: Math.floor((diff % day) / hour),
    seconds: Math.floor((diff % minute) / 1000),
  };
};

const CountdownCard = ({ value, label }: { value: number; label: string }) => (
  <div className="min-w-[110px] rounded-[1.75rem] border border-primary/15 bg-card/55 p-3 backdrop-blur-xl shadow-lg shadow-primary/5">
    <div className="overflow-hidden rounded-[1.25rem] border border-border/60">
      <div className="border-b border-border/60 bg-background/80 px-4 py-5 text-center text-3xl md:text-4xl font-display font-bold text-foreground">{String(value).padStart(2, "0")}</div>
      <div className="bg-primary/8 px-4 py-3 text-center text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-accent">{label}</div>
    </div>
  </div>
);

const CountdownSection = () => {
  const [title, setTitle] = useState("Launch");
  const [target, setTarget] = useState<string | null>(null);
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    supabase.from("site_settings").select("countdown_title, countdown_target").eq("id", "global").maybeSingle().then(({ data }) => {
      if (data?.countdown_title) setTitle(data.countdown_title);
      if (data?.countdown_target) setTarget(data.countdown_target);
    });
  }, []);

  useEffect(() => {
    if (!target) return;
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const parts = useMemo(() => (target ? getCountdownParts(target) : ZERO_PARTS), [target, tick]);

  if (!target) return null;

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-[2rem] border border-primary/10 bg-card/45 p-8 md:p-10 shadow-xl shadow-primary/5 backdrop-blur-xl">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">Countdown</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">{title}</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            <CountdownCard value={parts.years} label="Years" />
            <CountdownCard value={parts.months} label="Months" />
            <CountdownCard value={parts.days} label="Days" />
            <CountdownCard value={parts.hours} label="Hours" />
            <CountdownCard value={parts.seconds} label="Seconds" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;