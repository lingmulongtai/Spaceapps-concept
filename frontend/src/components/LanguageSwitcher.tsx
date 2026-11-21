"use client";

import { useEffect, useState } from "react";

import { locales } from "@/i18n/messages";
import { useLocaleStore } from "@/store/useLocaleStore";
import useTranslations from "@/hooks/useTranslations";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const bundle = useTranslations("languageSwitcher");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={bundle.buttonLabel}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#262629] bg-[#19191b] px-3 text-xs font-medium text-[#ededed] transition-colors hover:border-[#38383d] focus-visible:outline-2 focus-visible:outline-[#38bdf8]"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-[#a1a1aa]">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span className="font-mono uppercase">{locale}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-[#262629] bg-[#141415] p-2 text-xs text-[#ededed] shadow-xl">
          <div className="flex items-center justify-between px-2 py-1.5 text-[#a1a1aa]">
            <span className="font-medium">{bundle.menuTitle}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded px-1.5 py-0.5 text-[#a1a1aa] hover:bg-[#19191b] hover:text-[#ededed]"
            >
              {bundle.closeLabel}
            </button>
          </div>
          <div className="mt-1 grid gap-1">
            {locales.map((option) => {
              const active = option === locale;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setLocale(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors ${
                    active
                      ? "bg-[#19191b] text-[#38bdf8] border border-[#38bdf8]/35"
                      : "border border-transparent text-[#ededed] hover:bg-[#19191b]"
                  }`}
                >
                  <span>{bundle.languageNames[option]}</span>
                  <span className="font-mono text-[11px] uppercase text-[#a1a1aa]">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
