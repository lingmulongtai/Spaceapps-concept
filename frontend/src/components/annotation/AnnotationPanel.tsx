"use client";

import { useState } from "react";

import type { Annotation } from "@/types/annotation";
import type { DatasetDefinition } from "@/types/datasets";

type AnnotationPanelProps = {
  dataset?: DatasetDefinition;
  annotations: Annotation[];
  onAdd: (annotation: Annotation) => void;
  onSelect?: (annotation: Annotation) => void;
  className?: string;
};

export function AnnotationPanel({ dataset, annotations, onAdd, onSelect, className }: AnnotationPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("0");
  const [lon, setLon] = useState("0");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dataset) return;

    onAdd({
      id: `annotation-${Date.now()}`,
      title: title.trim() || `Marker ${annotations.length + 1}`,
      description: description.trim() || undefined,
      coordinates: {
        lat: Number.parseFloat(lat) || 0,
        lon: Number.parseFloat(lon) || 0,
      },
      datasetId: dataset.id,
    });

    setTitle("");
    setDescription("");
    setLat("0");
    setLon("0");
  };

  const containerClasses = [
    "flex w-full flex-col gap-4 rounded-xl border border-[#262629] bg-[#141415] p-4 text-[#ededed]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={containerClasses} aria-label="Annotations">
      <header className="space-y-1">
        <h2 className="text-sm font-medium text-[#ededed]">Annotations</h2>
        <p className="text-xs text-[#a1a1aa]">
          Tag observed features, coordinates, or field notes for this dataset.
        </p>
      </header>

      <form className="grid gap-3 text-xs" onSubmit={handleSubmit}>
        <label className="grid gap-1.5">
          <span className="font-medium text-[#a1a1aa]">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Aurora filament, crater rim, etc."
            className="h-9 w-full rounded-lg border border-[#262629] bg-[#0f0f10] px-3 text-xs text-[#ededed] placeholder-[#71717a] focus:border-[#38bdf8] focus:outline-none"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="font-medium text-[#a1a1aa]">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Observation notes, scientific context, or hypotheses"
            className="min-h-[76px] w-full rounded-lg border border-[#262629] bg-[#0f0f10] p-3 text-xs text-[#ededed] placeholder-[#71717a] focus:border-[#38bdf8] focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1.5">
            <span className="font-medium text-[#a1a1aa]">Latitude</span>
            <input
              value={lat}
              onChange={(event) => setLat(event.target.value)}
              className="h-9 w-full rounded-lg border border-[#262629] bg-[#0f0f10] px-2.5 font-mono text-xs text-[#ededed] tabular-nums focus:border-[#38bdf8] focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-medium text-[#a1a1aa]">Longitude</span>
            <input
              value={lon}
              onChange={(event) => setLon(event.target.value)}
              className="h-9 w-full rounded-lg border border-[#262629] bg-[#0f0f10] px-2.5 font-mono text-xs text-[#ededed] tabular-nums focus:border-[#38bdf8] focus:outline-none"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={!dataset}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#ededed] px-4 text-xs font-medium text-[#0f0f10] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Add annotation
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-1 text-xs">
        <ul className="space-y-2">
          {annotations
            .filter((annotation) => annotation.datasetId === dataset?.id)
            .map((annotation) => (
              <li key={annotation.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(annotation)}
                  className="w-full rounded-lg border border-[#262629] bg-[#0f0f10] p-3 text-left transition-colors hover:border-[#38383d] hover:bg-[#19191b]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-[#ededed]">{annotation.title}</span>
                    <span className="font-mono text-[11px] text-[#38bdf8] tabular-nums">
                      {annotation.coordinates.lat.toFixed(2)}, {annotation.coordinates.lon.toFixed(2)}
                    </span>
                  </div>
                  {annotation.description && (
                    <p className="mt-1.5 text-xs text-[#a1a1aa]">{annotation.description}</p>
                  )}
                  {annotation.timestamp && (
                    <p className="mt-1 font-mono text-[11px] text-[#71717a]">{annotation.timestamp}</p>
                  )}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

export default AnnotationPanel;
