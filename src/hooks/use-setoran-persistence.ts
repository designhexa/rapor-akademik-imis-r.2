import { useState, useEffect } from "react";
import { type CalendarEntry } from "@/components/setoran/CalendarCell";

const STORAGE_KEY = "setoran_calendar_entries";

// Helper to revive dates from JSON
const reviveDates = (data: CalendarEntry[]): CalendarEntry[] => {
  return data.map((entry) => ({
    ...entry,
    tanggal: new Date(entry.tanggal),
  }));
};

const INITIAL_MOCK_ENTRIES: CalendarEntry[] = [
  {
    tanggal: new Date(2025, 7, 4), // Aug 4
    santriId: "s1",
    jenis: "setoran_hafalan",
    juz: 26,
    surah: "Al-Kahfi",
    ayat: "1-19",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 5),
    santriId: "s1",
    jenis: "setoran_hafalan",
    juz: 26,
    halaman: "1-5",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 6),
    santriId: "s1",
    jenis: "setoran_hafalan",
    surah: "Al-Kahfi",
    ayat: "17-21",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 7),
    santriId: "s1",
    jenis: "setoran_hafalan",
    juz: 26,
    halaman: "6-10",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 11),
    santriId: "s1",
    jenis: "setoran_hafalan",
    surah: "Al-Kahfi",
    ayat: "21-22",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 13),
    santriId: "s1",
    jenis: "drill",
    juz: 26,
    halaman: "4-15",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 14),
    santriId: "s1",
    jenis: "setoran_hafalan",
    juz: 26,
    halaman: "21-24",
    status: "Ulangi",
  },
  {
    tanggal: new Date(2025, 7, 18),
    santriId: "s1",
    jenis: "drill",
    juz: 27,
    halaman: "1-5",
    status: "Lulus",
  },
  {
    tanggal: new Date(2025, 7, 25),
    santriId: "s1",
    jenis: "setoran_hafalan",
    juz: 27,
    surah: "Al-Kahfi",
    ayat: "28-20",
    status: "Ulangi",
  },
  // Murojaah
  {
    tanggal: new Date(2025, 7, 4),
    santriId: "s1",
    jenis: "murojaah",
    juz: 30,
    halaman: "6-10",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 5),
    santriId: "s1",
    jenis: "murojaah",
    juz: 30,
    halaman: "7-15",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 12),
    santriId: "s1",
    jenis: "murojaah",
    juz: 29,
    halaman: "11-15",
    status: "Lancar",
  },
  {
    tanggal: new Date(2025, 7, 13),
    santriId: "s1",
    jenis: "murojaah",
    status: "Sakit",
  },
  // Murojaah rumah
  {
    tanggal: new Date(2025, 7, 4),
    santriId: "s1",
    jenis: "murojaah_rumah",
    juz: 30,
    halaman: "11-20",
  },
  {
    tanggal: new Date(2025, 7, 5),
    santriId: "s1",
    jenis: "murojaah_rumah",
    juz: 29,
    halaman: "1-10",
  },
];

export const useSetoranPersistence = () => {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(reviveDates(parsed));
      } catch (e) {
        console.error("Failed to parse saved entries", e);
        setEntries(INITIAL_MOCK_ENTRIES);
      }
    } else {
      setEntries(INITIAL_MOCK_ENTRIES);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const addEntries = (newEntries: CalendarEntry | CalendarEntry[]) => {
    const toAdd = Array.isArray(newEntries) ? newEntries : [newEntries];
    setEntries((prev) => [...prev, ...toAdd]);
  };

  const deleteEntry = (entryToDelete: CalendarEntry) => {
    setEntries((prev) =>
      prev.filter(
        (e) =>
          !(
            e.tanggal.getTime() === entryToDelete.tanggal.getTime() &&
            e.santriId === entryToDelete.santriId &&
            e.jenis === entryToDelete.jenis &&
            e.juz === entryToDelete.juz &&
            e.surah === entryToDelete.surah &&
            e.halaman === entryToDelete.halaman &&
            e.ayat === entryToDelete.ayat
          )
      )
    );
  };

  return {
    entries,
    addEntries,
    deleteEntry,
    isLoaded,
  };
};
