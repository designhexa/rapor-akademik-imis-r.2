// Data drill untuk semua juz
// Juz 1-25: Berbasis halaman
// Juz 26-30: Berbasis surat dan ayat

export interface DrillDefinition {
  drillNumber: number;
  name: string;
  type: 'page' | 'surah';
  // For page-based (Juz 1-25)
  pageStart?: number;
  pageEnd?: number;
  // For surah-based (Juz 26-30)
  surahRanges?: {
    surahName: string;
    surahNumber: number;
    ayatStart?: number;
    ayatEnd?: number;
    fullSurah?: boolean;
  }[];
}

export interface JuzDrillConfig {
  juz: number;
  drills: DrillDefinition[];
}

// Generate page-based drills for Juz 1-25
const generatePageBasedDrills = (juz: number): DrillDefinition[] => {
  return [
    { drillNumber: 1, name: 'Drill 1', type: 'page', pageStart: 1, pageEnd: 5 },
    { drillNumber: 2, name: 'Drill 2', type: 'page', pageStart: 6, pageEnd: 10 },
    { drillNumber: 3, name: 'Drill 3', type: 'page', pageStart: 11, pageEnd: 15 },
    { drillNumber: 4, name: 'Drill 4', type: 'page', pageStart: 16, pageEnd: 20 },
    { drillNumber: 5, name: 'Drill 5', type: 'page', pageStart: 1, pageEnd: 10 },
    { drillNumber: 6, name: 'Drill 6', type: 'page', pageStart: 11, pageEnd: 20 },
    { drillNumber: 7, name: 'Drill 7', type: 'page', pageStart: 1, pageEnd: 20 },
  ];
};

// Juz 26 Drills
const juz26Drills: DrillDefinition[] = [
  {
    drillNumber: 1,
    name: 'Drill 1',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Ahqaf', surahNumber: 46, fullSurah: true }
    ]
  },
  {
    drillNumber: 2,
    name: 'Drill 2',
    type: 'surah',
    surahRanges: [
      { surahName: 'Muhammad', surahNumber: 47, fullSurah: true },
      { surahName: 'Al-Fath', surahNumber: 48, ayatStart: 1, ayatEnd: 9 }
    ]
  },
  {
    drillNumber: 3,
    name: 'Drill 3',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Fath', surahNumber: 48, ayatStart: 10, ayatEnd: 29 },
      { surahName: 'Al-Hujurat', surahNumber: 49, ayatStart: 1, ayatEnd: 11 }
    ]
  },
  {
    drillNumber: 4,
    name: 'Drill 4',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Hujurat', surahNumber: 49, ayatStart: 12, ayatEnd: 18 },
      { surahName: 'Qaf', surahNumber: 50, fullSurah: true },
      { surahName: 'Adh-Dhariyat', surahNumber: 51, ayatStart: 1, ayatEnd: 30 }
    ]
  },
  {
    drillNumber: 5,
    name: 'Drill 5',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Ahqaf', surahNumber: 46, fullSurah: true },
      { surahName: 'Muhammad', surahNumber: 47, fullSurah: true },
      { surahName: 'Al-Fath', surahNumber: 48, fullSurah: true }
    ]
  },
  {
    drillNumber: 6,
    name: 'Drill 6',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Hujurat', surahNumber: 49, fullSurah: true },
      { surahName: 'Qaf', surahNumber: 50, fullSurah: true },
      { surahName: 'Adh-Dhariyat', surahNumber: 51, ayatStart: 1, ayatEnd: 30 }
    ]
  },
  {
    drillNumber: 7,
    name: 'Drill 7',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Ahqaf', surahNumber: 46, fullSurah: true },
      { surahName: 'Muhammad', surahNumber: 47, fullSurah: true },
      { surahName: 'Al-Fath', surahNumber: 48, fullSurah: true },
      { surahName: 'Al-Hujurat', surahNumber: 49, fullSurah: true },
      { surahName: 'Qaf', surahNumber: 50, fullSurah: true },
      { surahName: 'Adh-Dhariyat', surahNumber: 51, ayatStart: 1, ayatEnd: 30 }
    ]
  }
];

// Juz 27 Drills
const juz27Drills: DrillDefinition[] = [
  {
    drillNumber: 1,
    name: 'Drill 1',
    type: 'surah',
    surahRanges: [
      { surahName: 'Adh-Dhariyat', surahNumber: 51, ayatStart: 31, ayatEnd: 60 },
      { surahName: 'At-Tur', surahNumber: 52, fullSurah: true }
    ]
  },
  {
    drillNumber: 2,
    name: 'Drill 2',
    type: 'surah',
    surahRanges: [
      { surahName: 'An-Najm', surahNumber: 53, fullSurah: true },
      { surahName: 'Al-Qamar', surahNumber: 54, fullSurah: true }
    ]
  },
  {
    drillNumber: 3,
    name: 'Drill 3',
    type: 'surah',
    surahRanges: [
      { surahName: 'Ar-Rahman', surahNumber: 55, fullSurah: true },
      { surahName: "Al-Waqi'ah", surahNumber: 56, ayatStart: 1, ayatEnd: 76 }
    ]
  },
  {
    drillNumber: 4,
    name: 'Drill 4',
    type: 'surah',
    surahRanges: [
      { surahName: "Al-Waqi'ah", surahNumber: 56, ayatStart: 77, ayatEnd: 96 },
      { surahName: 'Al-Hadid', surahNumber: 57, ayatStart: 1, ayatEnd: 29 }
    ]
  },
  {
    drillNumber: 5,
    name: 'Drill 5',
    type: 'surah',
    surahRanges: [
      { surahName: 'Adh-Dhariyat', surahNumber: 51, ayatStart: 31, ayatEnd: 60 },
      { surahName: 'At-Tur', surahNumber: 52, fullSurah: true },
      { surahName: 'An-Najm', surahNumber: 53, fullSurah: true },
      { surahName: 'Al-Qamar', surahNumber: 54, fullSurah: true }
    ]
  },
  {
    drillNumber: 6,
    name: 'Drill 6',
    type: 'surah',
    surahRanges: [
      { surahName: 'Ar-Rahman', surahNumber: 55, fullSurah: true },
      { surahName: "Al-Waqi'ah", surahNumber: 56, fullSurah: true },
      { surahName: 'Al-Hadid', surahNumber: 57, fullSurah: true }
    ]
  },
  {
    drillNumber: 7,
    name: 'Drill 7',
    type: 'surah',
    surahRanges: [
      { surahName: 'Adh-Dhariyat', surahNumber: 51, ayatStart: 31, ayatEnd: 60 },
      { surahName: 'At-Tur', surahNumber: 52, fullSurah: true },
      { surahName: 'An-Najm', surahNumber: 53, fullSurah: true },
      { surahName: 'Al-Qamar', surahNumber: 54, fullSurah: true },
      { surahName: 'Ar-Rahman', surahNumber: 55, fullSurah: true },
      { surahName: "Al-Waqi'ah", surahNumber: 56, fullSurah: true },
      { surahName: 'Al-Hadid', surahNumber: 57, fullSurah: true }
    ]
  }
];

// Juz 28 Drills
const juz28Drills: DrillDefinition[] = [
  {
    drillNumber: 1,
    name: 'Drill 1',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Mujadilah', surahNumber: 58, fullSurah: true },
      { surahName: 'Al-Hashr', surahNumber: 59, ayatStart: 1, ayatEnd: 9 }
    ]
  },
  {
    drillNumber: 2,
    name: 'Drill 2',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Hashr', surahNumber: 59, ayatStart: 10, ayatEnd: 24 },
      { surahName: 'Al-Mumtahanah', surahNumber: 60, fullSurah: true }
    ]
  },
  {
    drillNumber: 3,
    name: 'Drill 3',
    type: 'surah',
    surahRanges: [
      { surahName: 'As-Saff', surahNumber: 61, fullSurah: true },
      { surahName: 'Al-Jumuah', surahNumber: 62, fullSurah: true },
      { surahName: 'Al-Munafiqun', surahNumber: 63, fullSurah: true },
      { surahName: 'At-Taghabun', surahNumber: 64, ayatStart: 1, ayatEnd: 9 }
    ]
  },
  {
    drillNumber: 4,
    name: 'Drill 4',
    type: 'surah',
    surahRanges: [
      { surahName: 'At-Taghabun', surahNumber: 64, ayatStart: 10, ayatEnd: 18 },
      { surahName: 'At-Talaq', surahNumber: 65, fullSurah: true },
      { surahName: 'At-Tahrim', surahNumber: 66, fullSurah: true }
    ]
  },
  {
    drillNumber: 5,
    name: 'Drill 5',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Mujadilah', surahNumber: 58, fullSurah: true },
      { surahName: 'Al-Hashr', surahNumber: 59, fullSurah: true },
      { surahName: 'Al-Mumtahanah', surahNumber: 60, fullSurah: true }
    ]
  },
  {
    drillNumber: 6,
    name: 'Drill 6',
    type: 'surah',
    surahRanges: [
      { surahName: 'As-Saff', surahNumber: 61, fullSurah: true },
      { surahName: 'Al-Jumuah', surahNumber: 62, fullSurah: true },
      { surahName: 'Al-Munafiqun', surahNumber: 63, fullSurah: true },
      { surahName: 'At-Taghabun', surahNumber: 64, fullSurah: true },
      { surahName: 'At-Talaq', surahNumber: 65, fullSurah: true },
      { surahName: 'At-Tahrim', surahNumber: 66, fullSurah: true }
    ]
  },
  {
    drillNumber: 7,
    name: 'Drill 7',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Mujadilah', surahNumber: 58, fullSurah: true },
      { surahName: 'Al-Hashr', surahNumber: 59, fullSurah: true },
      { surahName: 'Al-Mumtahanah', surahNumber: 60, fullSurah: true },
      { surahName: 'As-Saff', surahNumber: 61, fullSurah: true },
      { surahName: 'Al-Jumuah', surahNumber: 62, fullSurah: true },
      { surahName: 'Al-Munafiqun', surahNumber: 63, fullSurah: true },
      { surahName: 'At-Taghabun', surahNumber: 64, fullSurah: true },
      { surahName: 'At-Talaq', surahNumber: 65, fullSurah: true },
      { surahName: 'At-Tahrim', surahNumber: 66, fullSurah: true }
    ]
  }
];

// Juz 29 Drills (includes Drill 7)
const juz29Drills: DrillDefinition[] = [
  {
    drillNumber: 1,
    name: 'Drill 1',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Mulk', surahNumber: 67, fullSurah: true },
      { surahName: 'Al-Qalam', surahNumber: 68, fullSurah: true }
    ]
  },
  {
    drillNumber: 2,
    name: 'Drill 2',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Haqqah', surahNumber: 69, fullSurah: true },
      { surahName: "Al-Ma'arij", surahNumber: 70, fullSurah: true }
    ]
  },
  {
    drillNumber: 3,
    name: 'Drill 3',
    type: 'surah',
    surahRanges: [
      { surahName: 'Nuh', surahNumber: 71, fullSurah: true },
      { surahName: 'Al-Jinn', surahNumber: 72, fullSurah: true }
    ]
  },
  {
    drillNumber: 4,
    name: 'Drill 4',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Muzzammil', surahNumber: 73, fullSurah: true },
      { surahName: 'Al-Muddaththir', surahNumber: 74, fullSurah: true }
    ]
  },
  {
    drillNumber: 5,
    name: 'Drill 5',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Qiyamah', surahNumber: 75, fullSurah: true },
      { surahName: 'Al-Insan', surahNumber: 76, fullSurah: true },
      { surahName: 'Al-Mursalat', surahNumber: 77, fullSurah: true }
    ]
  },
  {
    drillNumber: 6,
    name: 'Drill 6',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Mulk', surahNumber: 67, fullSurah: true },
      { surahName: 'Al-Qalam', surahNumber: 68, fullSurah: true },
      { surahName: 'Al-Haqqah', surahNumber: 69, fullSurah: true },
      { surahName: "Al-Ma'arij", surahNumber: 70, fullSurah: true },
      { surahName: 'Nuh', surahNumber: 71, fullSurah: true }
    ]
  },
  {
    drillNumber: 7,
    name: 'Drill 7',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Jinn', surahNumber: 72, fullSurah: true },
      { surahName: 'Al-Muzzammil', surahNumber: 73, fullSurah: true },
      { surahName: 'Al-Muddaththir', surahNumber: 74, fullSurah: true },
      { surahName: 'Al-Qiyamah', surahNumber: 75, fullSurah: true },
      { surahName: 'Al-Insan', surahNumber: 76, fullSurah: true },
      { surahName: 'Al-Mursalat', surahNumber: 77, fullSurah: true }
    ]
  },
  {
    drillNumber: 8,
    name: 'Drill 8',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Mulk', surahNumber: 67, fullSurah: true },
      { surahName: 'Al-Qalam', surahNumber: 68, fullSurah: true },
      { surahName: 'Al-Haqqah', surahNumber: 69, fullSurah: true },
      { surahName: "Al-Ma'arij", surahNumber: 70, fullSurah: true },
      { surahName: 'Nuh', surahNumber: 71, fullSurah: true },
      { surahName: 'Al-Jinn', surahNumber: 72, fullSurah: true },
      { surahName: 'Al-Muzzammil', surahNumber: 73, fullSurah: true },
      { surahName: 'Al-Muddaththir', surahNumber: 74, fullSurah: true },
      { surahName: 'Al-Qiyamah', surahNumber: 75, fullSurah: true },
      { surahName: 'Al-Insan', surahNumber: 76, fullSurah: true },
      { surahName: 'Al-Mursalat', surahNumber: 77, fullSurah: true }
    ]
  },
];

// Juz 30 Drills (includes Drill 7)
const juz30Drills: DrillDefinition[] = [
  {
    drillNumber: 1,
    name: 'Drill 1',
    type: 'surah',
    surahRanges: [
      { surahName: 'An-Naba', surahNumber: 78, fullSurah: true },
      { surahName: 'An-Naziat', surahNumber: 79, fullSurah: true },
      { surahName: 'Abasa', surahNumber: 80, fullSurah: true }
    ]
  },
  {
    drillNumber: 2,
    name: 'Drill 2',
    type: 'surah',
    surahRanges: [
      { surahName: 'At-Takwir', surahNumber: 81, fullSurah: true },
      { surahName: 'Al-Infitar', surahNumber: 82, fullSurah: true },
      { surahName: 'Al-Mutaffifin', surahNumber: 83, fullSurah: true },
      { surahName: 'Al-Inshiqaq', surahNumber: 84, fullSurah: true }
    ]
  },
  {
    drillNumber: 3,
    name: 'Drill 3',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Buruj', surahNumber: 85, fullSurah: true },
      { surahName: 'At-Tariq', surahNumber: 86, fullSurah: true },
      { surahName: 'Al-Ala', surahNumber: 87, fullSurah: true },
      { surahName: 'Al-Ghashiyah', surahNumber: 88, fullSurah: true },
      { surahName: 'Al-Fajr', surahNumber: 89, fullSurah: true }
    ]
  },
  {
    drillNumber: 4,
    name: 'Drill 4',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Balad', surahNumber: 90, fullSurah: true },
      { surahName: 'Ash-Shams', surahNumber: 91, fullSurah: true },
      { surahName: 'Al-Lail', surahNumber: 92, fullSurah: true },
      { surahName: 'Ad-Duha', surahNumber: 93, fullSurah: true },
      { surahName: 'Ash-Sharh', surahNumber: 94, fullSurah: true },
      { surahName: 'At-Tin', surahNumber: 95, fullSurah: true },
      { surahName: 'Al-Alaq', surahNumber: 96, fullSurah: true },
      { surahName: 'Al-Qadr', surahNumber: 97, fullSurah: true },
      { surahName: 'Al-Bayyinah', surahNumber: 98, fullSurah: true }
    ]
  },
  {
    drillNumber: 5,
    name: 'Drill 5',
    type: 'surah',
    surahRanges: [
      { surahName: 'Az-Zalzalah', surahNumber: 99, fullSurah: true },
      { surahName: 'Al-Adiyat', surahNumber: 100, fullSurah: true },
      { surahName: 'Al-Qariah', surahNumber: 101, fullSurah: true },
      { surahName: 'At-Takathur', surahNumber: 102, fullSurah: true },
      { surahName: 'Al-Asr', surahNumber: 103, fullSurah: true },
      { surahName: 'Al-Humazah', surahNumber: 104, fullSurah: true },
      { surahName: 'Al-Fil', surahNumber: 105, fullSurah: true },
      { surahName: 'Quraish', surahNumber: 106, fullSurah: true },
      { surahName: 'Al-Maun', surahNumber: 107, fullSurah: true },
      { surahName: 'Al-Kauthar', surahNumber: 108, fullSurah: true },
      { surahName: 'Al-Kafirun', surahNumber: 109, fullSurah: true },
      { surahName: 'An-Nasr', surahNumber: 110, fullSurah: true },
      { surahName: 'Al-Masad', surahNumber: 111, fullSurah: true },
      { surahName: 'Al-Ikhlas', surahNumber: 112, fullSurah: true },
      { surahName: 'Al-Falaq', surahNumber: 113, fullSurah: true },
      { surahName: 'An-Nas', surahNumber: 114, fullSurah: true }
    ]
  },
  {
    drillNumber: 6,
    name: 'Drill 6',
    type: 'surah',
    surahRanges: [
      { surahName: 'An-Naba', surahNumber: 78, fullSurah: true },
      { surahName: 'An-Naziat', surahNumber: 79, fullSurah: true },
      { surahName: 'Abasa', surahNumber: 80, fullSurah: true },
      { surahName: 'At-Takwir', surahNumber: 81, fullSurah: true },
      { surahName: 'Al-Infitar', surahNumber: 82, fullSurah: true },
      { surahName: 'Al-Mutaffifin', surahNumber: 83, fullSurah: true },
      { surahName: 'Al-Inshiqaq', surahNumber: 84, fullSurah: true },
      { surahName: 'Al-Buruj', surahNumber: 85, fullSurah: true },
      { surahName: 'At-Tariq', surahNumber: 86, fullSurah: true },
      { surahName: 'Al-Ala', surahNumber: 87, fullSurah: true },
      { surahName: 'Al-Ghashiyah', surahNumber: 88, fullSurah: true }
    ]
  },
  {
    drillNumber: 7,
    name: 'Drill 7',
    type: 'surah',
    surahRanges: [
      { surahName: 'Al-Fajr', surahNumber: 89, fullSurah: true },
      { surahName: 'Al-Balad', surahNumber: 90, fullSurah: true },
      { surahName: 'Ash-Shams', surahNumber: 91, fullSurah: true },
      { surahName: 'Al-Lail', surahNumber: 92, fullSurah: true },
      { surahName: 'Ad-Duha', surahNumber: 93, fullSurah: true },
      { surahName: 'Ash-Sharh', surahNumber: 94, fullSurah: true },
      { surahName: 'At-Tin', surahNumber: 95, fullSurah: true },
      { surahName: 'Al-Alaq', surahNumber: 96, fullSurah: true },
      { surahName: 'Al-Qadr', surahNumber: 97, fullSurah: true },
      { surahName: 'Al-Bayyinah', surahNumber: 98, fullSurah: true },
      { surahName: 'Az-Zalzalah', surahNumber: 99, fullSurah: true },
      { surahName: 'Al-Adiyat', surahNumber: 100, fullSurah: true },
      { surahName: 'Al-Qariah', surahNumber: 101, fullSurah: true },
      { surahName: 'At-Takathur', surahNumber: 102, fullSurah: true },
      { surahName: 'Al-Asr', surahNumber: 103, fullSurah: true },
      { surahName: 'Al-Humazah', surahNumber: 104, fullSurah: true },
      { surahName: 'Al-Fil', surahNumber: 105, fullSurah: true },
      { surahName: 'Quraish', surahNumber: 106, fullSurah: true },
      { surahName: 'Al-Maun', surahNumber: 107, fullSurah: true },
      { surahName: 'Al-Kauthar', surahNumber: 108, fullSurah: true },
      { surahName: 'Al-Kafirun', surahNumber: 109, fullSurah: true },
      { surahName: 'An-Nasr', surahNumber: 110, fullSurah: true },
      { surahName: 'Al-Masad', surahNumber: 111, fullSurah: true },
      { surahName: 'Al-Ikhlas', surahNumber: 112, fullSurah: true },
      { surahName: 'Al-Falaq', surahNumber: 113, fullSurah: true },
      { surahName: 'An-Nas', surahNumber: 114, fullSurah: true }
    ]
  },
  {
    drillNumber: 8,
    name: 'Drill 8',
    type: 'surah',
    surahRanges: [
      { surahName: 'An-Naba', surahNumber: 78, fullSurah: true },
      { surahName: 'An-Naziat', surahNumber: 79, fullSurah: true },
      { surahName: 'Abasa', surahNumber: 80, fullSurah: true },
      { surahName: 'At-Takwir', surahNumber: 81, fullSurah: true },
      { surahName: 'Al-Infitar', surahNumber: 82, fullSurah: true },
      { surahName: 'Al-Mutaffifin', surahNumber: 83, fullSurah: true },
      { surahName: 'Al-Inshiqaq', surahNumber: 84, fullSurah: true },
      { surahName: 'Al-Buruj', surahNumber: 85, fullSurah: true },
      { surahName: 'At-Tariq', surahNumber: 86, fullSurah: true },
      { surahName: 'Al-Ala', surahNumber: 87, fullSurah: true },
      { surahName: 'Al-Ghashiyah', surahNumber: 88, fullSurah: true },
      { surahName: 'Al-Fajr', surahNumber: 89, fullSurah: true },
      { surahName: 'Al-Balad', surahNumber: 90, fullSurah: true },
      { surahName: 'Ash-Shams', surahNumber: 91, fullSurah: true },
      { surahName: 'Al-Lail', surahNumber: 92, fullSurah: true },
      { surahName: 'Ad-Duha', surahNumber: 93, fullSurah: true },
      { surahName: 'Ash-Sharh', surahNumber: 94, fullSurah: true },
      { surahName: 'At-Tin', surahNumber: 95, fullSurah: true },
      { surahName: 'Al-Alaq', surahNumber: 96, fullSurah: true },
      { surahName: 'Al-Qadr', surahNumber: 97, fullSurah: true },
      { surahName: 'Al-Bayyinah', surahNumber: 98, fullSurah: true },
      { surahName: 'Az-Zalzalah', surahNumber: 99, fullSurah: true },
      { surahName: 'Al-Adiyat', surahNumber: 100, fullSurah: true },
      { surahName: 'Al-Qariah', surahNumber: 101, fullSurah: true },
      { surahName: 'At-Takathur', surahNumber: 102, fullSurah: true },
      { surahName: 'Al-Asr', surahNumber: 103, fullSurah: true },
      { surahName: 'Al-Humazah', surahNumber: 104, fullSurah: true },
      { surahName: 'Al-Fil', surahNumber: 105, fullSurah: true },
      { surahName: 'Quraish', surahNumber: 106, fullSurah: true },
      { surahName: 'Al-Maun', surahNumber: 107, fullSurah: true },
      { surahName: 'Al-Kauthar', surahNumber: 108, fullSurah: true },
      { surahName: 'Al-Kafirun', surahNumber: 109, fullSurah: true },
      { surahName: 'An-Nasr', surahNumber: 110, fullSurah: true },
      { surahName: 'Al-Masad', surahNumber: 111, fullSurah: true },
      { surahName: 'Al-Ikhlas', surahNumber: 112, fullSurah: true },
      { surahName: 'Al-Falaq', surahNumber: 113, fullSurah: true },
      { surahName: 'An-Nas', surahNumber: 114, fullSurah: true }
    ]
  },
];

// Build all juz drill configs
export const allJuzDrillConfigs: JuzDrillConfig[] = [
  // Juz 1-25: Page-based
  ...Array.from({ length: 25 }, (_, i) => ({
    juz: i + 1,
    drills: generatePageBasedDrills(i + 1)
  })),
  // Juz 26-30: Surah-based
  { juz: 26, drills: juz26Drills },
  { juz: 27, drills: juz27Drills },
  { juz: 28, drills: juz28Drills },
  { juz: 29, drills: juz29Drills },
  { juz: 30, drills: juz30Drills }
];

// Get drills for a specific juz
export const getDrillsForJuz = (juz: number): DrillDefinition[] => {
  const config = allJuzDrillConfigs.find(c => c.juz === juz);
  return config?.drills || [];
};

// Get number of drills for a juz (6 for juz 1-28, 7 for juz 29-30)
export const getDrillCountForJuz = (juz: number): number => {
  if (juz >= 29) return 7;
  return 6;
};

// Check if juz uses page-based drills
export const isPageBasedDrill = (juz: number): boolean => {
  return juz <= 25;
};

// Format drill description for display
export const formatDrillDescription = (drill: DrillDefinition): string => {
  if (drill.type === 'page') {
    return `Halaman ${drill.pageStart} - ${drill.pageEnd}`;
  }
  
  if (drill.surahRanges && drill.surahRanges.length > 0) {
    const first = drill.surahRanges[0];
    const last = drill.surahRanges[drill.surahRanges.length - 1];
    
    if (drill.surahRanges.length === 1) {
      if (first.fullSurah) {
        return `Surat ${first.surahName}`;
      }
      return `${first.surahName}: ${first.ayatStart}-${first.ayatEnd}`;
    }
    
    // Multiple surahs
    const firstPart = first.fullSurah 
      ? first.surahName 
      : `${first.surahName}: ${first.ayatStart}`;
    const lastPart = last.fullSurah 
      ? last.surahName 
      : `${last.surahName}: ${last.ayatEnd}`;
    
    return `${firstPart} - ${lastPart}`;
  }
  
  return drill.name;
};