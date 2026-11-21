"use client";

import { useEffect, useState } from "react";

import useTranslation from "@/hooks/useTranslation";
import useTranslations from "@/hooks/useTranslations";

const LANGUAGE_OPTIONS = [
  { value: "EN", label: "English" },
  { value: "JA", label: "日本語" },
  { value: "FR", label: "Français" },
  { value: "DE", label: "Deutsch" },
  { value: "ES", label: "Español" },
];

export default function TranslationWidget() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("EN");
  const { result, isLoading, error, requestTranslation } = useTranslation();
  const t = useTranslations("translationWidget");

  useEffect(() => {
    const textarea = document.getElementById("translation-textarea");
    if (textarea) {
      textarea.setAttribute("aria-label", t.sourceLabel);
    }
  }, [t.sourceLabel]);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    await requestTranslation({ text, target_language: targetLanguage });
  };

  return (
    <section className="grid gap-4 rounded-xl border border-[#262629] bg-[#141415] p-4 text-xs text-[#a1a1aa]">
      <header className="space-y-1">
        <h2 className="text-sm font-medium text-[#ededed]">{t.title}</h2>
        <p className="text-xs text-[#a1a1aa]">{t.subtitle}</p>
      </header>

      <label className="grid gap-1.5 text-xs font-medium text-[#a1a1aa]">
        <span>{t.sourceLabel}</span>
        <textarea
          id="translation-textarea"
          className="min-h-[112px] rounded-lg border border-[#262629] bg-[#0f0f10] p-3 text-xs font-normal text-[#ededed] placeholder-[#71717a] focus:border-[#38bdf8] focus:outline-none"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t.placeholder}
        />
      </label>

      <div className="flex flex-wrap items-end gap-3">
        <label className="grid flex-1 gap-1.5 text-xs font-medium text-[#a1a1aa]">
          <span>{t.targetLabel}</span>
          <select
            className="h-9 rounded-lg border border-[#262629] bg-[#0f0f10] px-2.5 text-xs font-normal text-[#ededed] focus:border-[#38bdf8] focus:outline-none"
            value={targetLanguage}
            onChange={(event) => setTargetLanguage(event.target.value)}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#141415]">
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#ededed] px-4 text-xs font-medium text-[#0f0f10] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
          onClick={handleTranslate}
          disabled={isLoading || !text.trim()}
        >
          <span>{isLoading ? t.buttonLoading : t.button}</span>
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-[#38383d] bg-[#19191b] px-3 py-2 text-xs text-[#a1a1aa]">
          {error}
        </p>
      )}

      {result && (
        <div className="grid gap-2 rounded-lg border border-[#262629] bg-[#0f0f10] p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#ededed]">{result.target_language}</span>
            <span className="rounded bg-[#19191b] px-2 py-0.5 font-mono text-[10px] text-[#38bdf8]">
              {result.provider}
            </span>
          </div>
          {result.detected_source_language && (
            <p className="text-[11px] text-[#71717a]">
              {t.detectedLabel}: {result.detected_source_language}
            </p>
          )}
          <p className="text-xs leading-relaxed text-[#ededed]">{result.text}</p>
          {result.note && <p className="text-[11px] text-[#71717a]">{result.note}</p>}
        </div>
      )}
    </section>
  );
}
