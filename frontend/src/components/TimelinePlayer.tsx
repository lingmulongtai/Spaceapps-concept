"use client";

import { useState } from "react";

import useTranslations from "@/hooks/useTranslations";

export function TimelinePlayer() {
  const t = useTranslations("timeline");
  const [activeId, setActiveId] = useState(t.events[0]?.id ?? "");

  const activeIdx = Math.max(0, t.events.findIndex((m) => m.id === activeId));
  const step = (delta: number) => {
    if (!t.events.length) return;
    const nextIdx = (activeIdx + delta + t.events.length) % t.events.length;
    setActiveId(t.events[nextIdx]?.id ?? "");
  };

  return (
    <section className="grid gap-4 rounded-xl border border-[#262629] bg-[#141415] p-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium text-[#ededed]">{t.title}</h2>
          <p className="text-xs text-[#a1a1aa]">{t.subtitle}</p>
        </div>
        <div className="flex gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => step(-1)}
            className="rounded-lg border border-[#262629] bg-[#19191b] px-2.5 py-1 text-[#ededed] transition-colors hover:border-[#38383d]"
          >
            {t.prev}
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="rounded-lg border border-[#262629] bg-[#19191b] px-2.5 py-1 text-[#ededed] transition-colors hover:border-[#38383d]"
          >
            {t.next}
          </button>
        </div>
      </header>

      <div className="grid gap-1.5">
        <div className="relative h-1.5 rounded-full bg-[#262629]">
          <div
            className="absolute h-full rounded-full bg-[#38bdf8] transition-[width] duration-200"
            style={{
              width: `${(activeIdx / Math.max(t.events.length - 1, 1)) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between font-mono text-[11px] text-[#71717a] tabular-nums">
          <span>{t.progressStart}</span>
          <span>{t.progressEnd}</span>
        </div>
      </div>

      <ul className="grid gap-1.5">
        {t.events.map((moment) => {
          const active = moment.id === activeId;
          return (
            <li key={moment.id}>
              <button
                type="button"
                onClick={() => setActiveId(moment.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  active
                    ? "border-[#38bdf8]/45 bg-[#19191b] text-[#ededed]"
                    : "border-[#262629] bg-[#0f0f10] text-[#a1a1aa] hover:border-[#38383d] hover:text-[#ededed]"
                }`}
              >
                <span className="font-medium">{moment.label}</span>
                <span className="font-mono text-[11px] text-[#71717a] tabular-nums">
                  {new Date(moment.timestamp).toISOString().slice(0, 10)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-[#262629] pt-3 text-xs text-[#71717a]">{t.footnote}</p>
    </section>
  );
}

export default TimelinePlayer;
