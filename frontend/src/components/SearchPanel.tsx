"use client";

import { useState } from "react";

import useTranslations from "@/hooks/useTranslations";

const LAYER_PRESETS = [
  { key: "modisTerra", value: "MODIS_Terra_CorrectedReflectance_TrueColor" },
  { key: "blueMarble", value: "BlueMarble_NextGeneration" },
  { key: "modisAqua", value: "MODIS_Aqua_CorrectedReflectance_TrueColor" },
];

type SearchPanelProps = {
  onPreview: (params: {
    bbox?: [number, number, number, number];
    startDate?: string;
    endDate?: string;
    layer?: string;
  }) => void;
  isLoading?: boolean;
  error?: string | null;
  preview?: {
    layer: string;
    time: string;
    bbox: [number, number, number, number];
    source?: string;
  } | null;
};

export function SearchPanel({
  onPreview,
  isLoading = false,
  error,
  preview,
}: SearchPanelProps) {
  const t = useTranslations("searchPanel");
  const [activeMode, setActiveMode] = useState(t.modes[0]?.label ?? "Coordinates");
  const [primaryInput, setPrimaryInput] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [selectedLayer, setSelectedLayer] = useState(LAYER_PRESETS[0]?.value ?? "");

  const handlePreview = () => {
    const bbox = primaryInput
      .split(",")
      .map((value) => Number.parseFloat(value.trim()))
      .filter(Number.isFinite);

    onPreview({
      bbox: bbox.length === 4 ? (bbox as [number, number, number, number]) : undefined,
      startDate: dateStart,
      endDate: dateEnd,
      layer: selectedLayer,
    });
  };

  return (
    <section className="grid gap-4 rounded-xl border border-[#262629] bg-[#141415] p-4">
      <header className="space-y-1">
        <h2 className="text-sm font-medium text-[#ededed]">{t.title}</h2>
        <p className="text-xs text-[#a1a1aa]">{t.subtitle}</p>
      </header>

      <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#262629] bg-[#0f0f10] p-1">
        {t.modes.map((mode) => {
          const active = activeMode === mode.label;
          return (
            <button
              key={mode.id}
              type="button"
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-[#19191b] text-[#ededed] border border-[#38bdf8]/40"
                  : "border border-transparent text-[#a1a1aa] hover:text-[#ededed]"
              }`}
              onClick={() => setActiveMode(mode.label)}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1.5 text-xs">
          <span className="font-medium text-[#a1a1aa]">{t.primaryInputLabel}</span>
          <input
            className="h-9 w-full rounded-lg border border-[#262629] bg-[#0f0f10] px-3 text-xs text-[#ededed] placeholder-[#71717a] focus:border-[#38bdf8] focus:outline-none"
            placeholder={
              t.modes.find((mode) => mode.label === activeMode)?.placeholder ?? ""
            }
            value={primaryInput}
            onChange={(event) => setPrimaryInput(event.target.value)}
          />
        </label>

        <div className="grid gap-1.5 text-xs">
          <span className="font-medium text-[#a1a1aa]">{t.dateRangeLabel}</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="h-9 w-full rounded-lg border border-[#262629] bg-[#0f0f10] px-2.5 font-mono text-xs text-[#ededed] tabular-nums focus:border-[#38bdf8] focus:outline-none"
              value={dateStart}
              onChange={(event) => setDateStart(event.target.value)}
            />
            <input
              type="date"
              className="h-9 w-full rounded-lg border border-[#262629] bg-[#0f0f10] px-2.5 font-mono text-xs text-[#ededed] tabular-nums focus:border-[#38bdf8] focus:outline-none"
              value={dateEnd}
              onChange={(event) => setDateEnd(event.target.value)}
            />
          </div>
        </div>

        <label className="grid gap-1.5 text-xs">
          <span className="font-medium text-[#a1a1aa]">{t.layerLabel}</span>
          <select
            className="h-9 w-full rounded-lg border border-[#262629] bg-[#0f0f10] px-2.5 text-xs text-[#ededed] focus:border-[#38bdf8] focus:outline-none"
            value={selectedLayer}
            onChange={(event) => setSelectedLayer(event.target.value)}
          >
            {LAYER_PRESETS.map((layer) => (
              <option key={layer.value} value={layer.value} className="bg-[#141415]">
                {t.layers[layer.key] ?? layer.value}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-[#71717a]">{t.helper}</span>
          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-[#ededed] px-3.5 text-xs font-medium text-[#0f0f10] transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-50"
            onClick={handlePreview}
            disabled={isLoading}
          >
            {isLoading ? t.previewLoading : t.previewButton}
          </button>
        </div>

        {error && (
          <p className="rounded-lg border border-[#38383d] bg-[#19191b] px-3 py-2 text-xs text-[#a1a1aa]">
            Backend preview proxy unavailable — live NASA GIBS tiles remain active.
          </p>
        )}

        {preview && (
          <div className="grid gap-1 rounded-lg border border-[#262629] bg-[#0f0f10] p-3 font-mono text-[11px] text-[#a1a1aa] tabular-nums">
            <span>{t.summary.layer}: {preview.layer}</span>
            <span>{t.summary.time}: {preview.time}</span>
            <span>{t.summary.bbox}: {preview.bbox.join(", ")}</span>
            {preview.source && <span>{t.summary.source}: {preview.source}</span>}
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchPanel;
