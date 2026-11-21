import useTranslations from "@/hooks/useTranslations";

export function ResourcePanel() {
  const t = useTranslations("resourcePanel");

  return (
    <section className="grid gap-3 rounded-xl border border-[#262629] bg-[#141415] p-4 text-xs text-[#a1a1aa]">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium text-[#ededed]">{t.title}</h2>
          <p className="text-xs text-[#a1a1aa]">{t.subtitle}</p>
        </div>
        <span className="rounded-md border border-[#262629] bg-[#19191b] px-2 py-0.5 font-mono text-[11px] text-[#a1a1aa]">
          {t.statusChip}
        </span>
      </header>

      <ul className="grid gap-2">
        {t.items.map((item) => (
          <li key={item.title} className="rounded-lg border border-[#262629] bg-[#0f0f10] p-3 leading-relaxed">
            <strong className="font-medium text-[#ededed]">{item.title}</strong>
            <div className="mt-0.5 text-[#a1a1aa]">{item.description}</div>
          </li>
        ))}
      </ul>

      <p className="border-t border-[#262629] pt-3 text-xs text-[#71717a]">{t.footer}</p>
    </section>
  );
}

export default ResourcePanel;
