import { useMemo } from "react";
import { Info } from "lucide-react";
import {
  getAyatRangeForSurahInJuz,
  getDetailedContentForPageRange,
  type MushafPageContent,
} from "@/lib/mushaf-madinah";

interface AyatRangeInfoProps {
  juz: string;
  surahNumber: string;
  surahName?: string;
}

/**
 * Shows the valid ayat range for a surah within the selected juz.
 */
export function SurahAyatLimitInfo({ juz, surahNumber, surahName }: AyatRangeInfoProps) {
  const range = useMemo(() => {
    if (!juz || !surahNumber) return null;
    return getAyatRangeForSurahInJuz(Number(juz), Number(surahNumber));
  }, [juz, surahNumber]);

  if (!range) return null;

  return (
    <div className="flex items-start gap-2 p-2 bg-accent/50 rounded text-xs text-accent-foreground border border-accent">
      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
      <span>
        {surahName ? <strong>{surahName}</strong> : `Surah ${surahNumber}`} di Juz {juz}: Ayat <strong>{range.ayatMin}</strong> s/d <strong>{range.ayatMax}</strong> ({range.ayatMax - range.ayatMin + 1} ayat)
      </span>
    </div>
  );
}

interface PageRangeDetailProps {
  juz: string;
  halamanDari: string;
  halamanSampai: string;
}

/**
 * Shows detailed surah/ayat breakdown for a page range.
 */
export function PageRangeDetailInfo({ juz, halamanDari, halamanSampai }: PageRangeDetailProps) {
  const details: MushafPageContent[] = useMemo(() => {
    if (!juz || !halamanDari) return [];
    const dari = Number(halamanDari);
    const sampai = halamanSampai ? Number(halamanSampai) : dari;
    return getDetailedContentForPageRange(Number(juz), dari, sampai);
  }, [juz, halamanDari, halamanSampai]);

  if (details.length === 0) return null;

  return (
    <div className="p-2 bg-accent/50 rounded text-xs border border-accent space-y-1">
      <div className="flex items-center gap-1.5 text-accent-foreground font-medium">
        <Info className="w-3.5 h-3.5 text-primary shrink-0" />
        Rincian isi halaman {halamanDari}{halamanSampai && halamanSampai !== halamanDari ? `–${halamanSampai}` : ""}:
      </div>
      <ul className="ml-5 space-y-0.5 text-muted-foreground">
        {details.map((d, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="text-foreground font-medium">{d.surahName}</span>
            <span>: Ayat {d.ayatStart}–{d.ayatEnd}</span>
            <span className="text-muted-foreground/70">({d.ayatEnd - d.ayatStart + 1} ayat)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
