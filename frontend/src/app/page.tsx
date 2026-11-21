"use client";

import { useCallback, useMemo, useState } from "react";

import DatasetSidebar from "@/components/DatasetSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MapViewport from "@/components/MapViewport";
import { AnnotationPanel } from "@/components/annotation";
import ResourcePanel from "@/components/ResourcePanel";
import SearchPanel from "@/components/SearchPanel";
import TimelinePlayer from "@/components/TimelinePlayer";
import TranslationWidget from "@/components/TranslationWidget";
import { DATASET_LOOKUP, DATASETS } from "@/data/datasets";
import type { Annotation } from "@/types/annotation";
import useTranslations from "@/hooks/useTranslations";
import useImageryPreview from "@/hooks/useImageryPreview";

type WorkspaceView = "explore" | "insights" | "annotate" | "translate";
type FeatureTab = { id: WorkspaceView; label: string };

const FEATURE_TABS: FeatureTab[] = [
  { id: "explore", label: "Explore" },
  { id: "insights", label: "Timeline" },
  { id: "annotate", label: "Annotate" },
  { id: "translate", label: "Translate" },
];

export default function Home() {
  const { preview, isLoading, fetchPreview, error, availableDates } = useImageryPreview();
  const hero = useTranslations("hero");

  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(DATASETS[0]?.id ?? "earth-true-color");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeView, setActiveView] = useState<WorkspaceView>("explore");

  const selectedDataset = DATASET_LOOKUP.get(selectedDatasetId);

  const handleNewAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations((prev) => [annotation, ...prev]);
  }, []);

  const mapViewport = useMemo(
    () => (
      <MapViewport
        datasetId={selectedDatasetId}
        previewUrl={preview?.image}
        layerName={preview?.layer}
        timestamp={preview?.time}
        metadata={preview ? preview.bbox.join(", ") : undefined}
        attribution={preview?.attribution}
        className="h-[520px] xl:h-[calc(100vh-112px)] xl:min-h-[640px]"
        availableDates={availableDates}
        selectedDate={preview?.time?.slice(0, 10)}
      />
    ),
    [availableDates, preview, selectedDatasetId],
  );

  const sidebarContent = useMemo(() => {
    switch (activeView) {
      case "insights":
        return (
          <>
            <TimelinePlayer />
            <ResourcePanel />
          </>
        );
      case "annotate":
        return (
          <>
            <AnnotationPanel dataset={selectedDataset} annotations={annotations} onAdd={handleNewAnnotation} />
            <ResourcePanel />
          </>
        );
      case "translate":
        return (
          <>
            <TranslationWidget />
            <ResourcePanel />
          </>
        );
      case "explore":
      default:
        return (
          <>
            <SearchPanel onPreview={fetchPreview} isLoading={isLoading} error={error} preview={preview} />
            <DatasetSidebar
              selectedId={selectedDatasetId}
              onSelect={setSelectedDatasetId}
              className="flex-1 min-h-[260px]"
            />
          </>
        );
    }
  }, [activeView, annotations, error, fetchPreview, handleNewAnnotation, isLoading, preview, selectedDataset, selectedDatasetId]);

  return (
    <div className="min-h-screen bg-[#0f0f10] text-[#ededed]">
      <header className="sticky top-0 z-30 border-b border-[#262629] bg-[#0f0f10]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#262629] bg-[#19191b] text-[#38bdf8]" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8" />
                <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-24 12 12)" />
              </svg>
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-medium text-[#ededed] sm:text-base">
                {hero.title}
              </h1>
              <p className="hidden truncate text-xs text-[#a1a1aa] md:block">
                {hero.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav
              aria-label="Workspace modes"
              className="flex items-center gap-1 rounded-lg border border-[#262629] bg-[#141415] p-1"
            >
              {FEATURE_TABS.map((tab) => {
                const active = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveView(tab.id)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                      active
                        ? "bg-[#19191b] text-[#ededed] border border-[#38bdf8]/40"
                        : "border border-transparent text-[#a1a1aa] hover:text-[#ededed]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1680px] gap-4 px-4 py-4 sm:px-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4 xl:max-h-[calc(100vh-112px)] xl:overflow-y-auto xl:pr-1 scroll-elevated">
          {sidebarContent}
        </aside>
        <section className="flex min-w-0 flex-col">
          {mapViewport}
        </section>
      </main>
    </div>
  );
}
