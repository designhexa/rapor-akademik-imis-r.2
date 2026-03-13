// Generator soal ujian tahfidz - 10 soal acak untuk juz yang diujikan
import { surahList, getSurahsByJuz, Surah } from './quran-data';

export interface ExamQuestion {
  id: number;
  juz: number;
  surah: Surah;
  ayatStart: number;
  halamanEstimate: number;
}

// Halaman per juz (estimasi) - Juz 30 memiliki 23 halaman
const HALAMAN_PER_JUZ: Record<number, number> = {};
for (let i = 1; i <= 29; i++) HALAMAN_PER_JUZ[i] = 20;
HALAMAN_PER_JUZ[30] = 23;

export const getHalamanPerJuz = (juz: number): number => HALAMAN_PER_JUZ[juz] || 20;

// Generate halaman acak dalam juz
const getRandomHalaman = (juz: number): number => {
  const halamanJuz = getHalamanPerJuz(juz);
  const baseHalaman = (juz - 1) * 20 + 1; // base tetap 20 untuk posisi umum
  return baseHalaman + Math.floor(Math.random() * halamanJuz);
};

// Generate ayat acak dalam surah
const getRandomAyat = (surah: Surah): number => {
  // Tidak mulai dari ayat terakhir (minimal 5 ayat tersisa untuk sambung)
  const maxStart = Math.max(1, surah.numberOfAyahs - 5);
  return Math.floor(Math.random() * maxStart) + 1;
};

// Generate 10 soal acak untuk range juz
export const generateExamQuestions = (juzDari: number, juzSampai: number): ExamQuestion[] => {
  const questions: ExamQuestion[] = [];
  const usedCombinations = new Set<string>();
  
  // Kumpulkan semua surah dalam range juz
  const allSurahs: Array<{ juz: number; surah: Surah }> = [];
  for (let juz = juzDari; juz <= juzSampai; juz++) {
    const surahsInJuz = getSurahsByJuz(juz);
    surahsInJuz.forEach(surah => {
      // Hindari duplikat surah yang ada di beberapa juz
      const key = `${surah.number}`;
      if (!allSurahs.some(s => s.surah.number === surah.number)) {
        allSurahs.push({ juz, surah });
      }
    });
  }
  
  // Generate 10 soal unik
  let attempts = 0;
  while (questions.length < 10 && attempts < 100) {
    attempts++;
    
    // Pilih surah acak
    const randomIdx = Math.floor(Math.random() * allSurahs.length);
    const { juz, surah } = allSurahs[randomIdx];
    
    // Generate ayat acak
    const ayatStart = getRandomAyat(surah);
    
    // Cek duplikat
    const combination = `${surah.number}-${ayatStart}`;
    if (usedCombinations.has(combination)) continue;
    
    usedCombinations.add(combination);
    
    questions.push({
      id: questions.length + 1,
      juz,
      surah,
      ayatStart,
      halamanEstimate: getRandomHalaman(juz),
    });
  }
  
  // Jika tidak cukup 10 soal, tambah lagi dengan ayat berbeda
  while (questions.length < 10) {
    const randomIdx = Math.floor(Math.random() * allSurahs.length);
    const { juz, surah } = allSurahs[randomIdx];
    const ayatStart = getRandomAyat(surah);
    
    questions.push({
      id: questions.length + 1,
      juz,
      surah,
      ayatStart,
      halamanEstimate: getRandomHalaman(juz),
    });
  }
  
  return questions;
};

// Format soal untuk tampilan
export const formatQuestionDisplay = (question: ExamQuestion): string => {
  return `${question.surah.name} (${question.surah.arabicName}) ayat ${question.ayatStart}`;
};
