"use client";

import { useMemo, useState } from "react";

import { DATASETS } from "@/data/datasets";

type DatasetSidebarProps = {
  selectedId: string;
  onSelect: (datasetId: string) => void;
  className?: string;
  height?: string;
};

export function DatasetSidebar({ selectedId, onSelect, className, height }: DatasetSidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return DATASETS;
    return DATASETS.filter((dataset) =>
      [dataset.name, dataset.description, dataset.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query]);

  const containerClasses = [
    "flex w-full flex-col gap-3 rounded-xl border border-[#262629] bg-[#141415] p-4 text-[#ededed]",
    height,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={containerClasses} aria-label="Dataset selection">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium text-[#ededed]">Datasets</h2>
        <span className="font-mono text-xs text-[#71717a] tabular-nums">{filtered.length} layers</span>
      </header>

      <input
        type="search"
        aria-label="Search datasets"
        placeholder="Filter datasets..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-9 w-full rounded-lg border border-[#262629] bg-[#0f0f10] px-3 text-xs text-[#ededed] placeholder-[#71717a] focus:border-[#38bdf8] focus:outline-none"
      />

      <div className="scroll-elevated -mx-1 flex-1 overflow-y-auto px-1">
        <ul className="space-y-2 pb-1">
          {filtered.map((dataset) => {
            const active = dataset.id === selectedId;
            return (
              <li key={dataset.id}>
                <button
                  type="button"
                  onClick={() => onSelect(dataset.id)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-[#38bdf8]/45 bg-[#19191b] text-[#ededed]"
                      : "border-[#262629] bg-[#0f0f10] text-[#ededed] hover:border-[#38383d] hover:bg-[#19191b]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#ededed]">{dataset.name}</span>
                    <span className="rounded bg-[#19191b] px-1.5 py-0.5 font-mono text-[10px] text-[#a1a1aa]">
                      {dataset.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#a1a1aa]">
                    {dataset.description}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-[#71717a]">{dataset.attribution}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default DatasetSidebar;
