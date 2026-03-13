/**
 * Data Pemetaan Mushaf Madinah (Utsmani)
 * 
 * Pedoman:
 * - 1 Mushaf = 604 halaman
 * - 1 Juz = 20 halaman (kecuali Juz 30 = 23 halaman, hal 582–604)
 * - 1 halaman = 15 baris
 */

import { surahList } from "@/lib/quran-data";

export const LINES_PER_PAGE = 15;
export const TOTAL_PAGES = 604;

export interface MushafPageContent {
  surahNumber: number;
  surahName: string;
  ayatStart: number;
  ayatEnd: number;
}

export interface MushafPageEntry {
  page: number;
  juz: number;
  lines: number;
  content: MushafPageContent[];
}

// ============ Juz boundaries ============

/**
 * Returns page range for a given juz (1-indexed).
 * Juz 1–29: 20 pages each. Juz 30: pages 582–604 (23 pages).
 */
export function getPagesForJuz(juz: number): { start: number; end: number; count: number } {
  if (juz < 1 || juz > 30) return { start: 1, end: 20, count: 20 };
  if (juz <= 29) {
    const start = (juz - 1) * 20 + 1;
    return { start, end: start + 19, count: 20 };
  }
  // Juz 30
  return { start: 582, end: 604, count: 23 };
}

export function getPageMappingByJuz(
  juz: number,
  relativePage: number
) {
  const { start, end } = getPagesForJuz(juz);

  const actualPage = start + (relativePage - 1);

  if (actualPage < start || actualPage > end) {
    return null;
  }

  const content = getPageContent(actualPage);

  if (!content || content.length === 0) {
    return null;
  }

  const firstAyat = content[0];
  const lastAyat = content[content.length - 1];

  return {
    surahNumber: firstAyat.surahNumber,
    startAyat: firstAyat.ayatStart,
    endAyat: lastAyat.ayatEnd,
  };
}

export function getJuzForPage(page: number): number {
  if (page < 1) return 1;
  if (page >= 582) return 30;
  return Math.ceil(page / 20);
}

export function getPageCountForJuz(juz: number): number {
  return getPagesForJuz(juz).count;
}

// ============ Mushaf Madinah page-to-surah mapping ============
// Mapping based on Mushaf Madinah (King Fahd Complex print)
// Format: [pageNumber, surahNumber, ayatStart, ayatEnd]
// When a page has multiple surahs, there are multiple entries for the same page.

type PageMapping = [number, number, number, number];

const PAGE_MAPPINGS: PageMapping[] = [
  // Juz 1 (pages 1-21) — Al-Fatihah & Al-Baqarah
  [1, 1, 1, 7],
  [2, 2, 1, 5], [3, 2, 6, 16], [4, 2, 17, 24], [5, 2, 25, 29],
  [6, 2, 30, 37], [7, 2, 38, 48], [8, 2, 49, 57], [9, 2, 58, 61],
  [10, 2, 62, 69], [11, 2, 70, 76], [12, 2, 77, 83], [13, 2, 84, 88],
  [14, 2, 89, 93], [15, 2, 94, 101], [16, 2, 102, 105], [17, 2, 106, 112],
  [18, 2, 113, 119], [19, 2, 120, 126], [20, 2, 127, 134], [21, 2, 135, 141],  
  // Juz 2 (pages 22-41) — Al-Baqarah continued
  [22, 2, 142, 145], [23, 2, 146, 153], [24, 2, 154, 163], [25, 2, 164, 169], 
  [26, 2, 170, 176], [27, 2, 177, 181], [28, 2, 182, 186], [29, 2, 187, 190], 
  [30, 2, 191, 196], [31, 2, 197, 202], [32, 2, 203, 210], [33, 2, 211, 215], 
  [34, 2, 216, 219], [35, 2, 220, 224], [36, 2, 225, 230], [37, 2, 231, 233], 
  [38, 2, 234, 237], [39, 2, 238, 245], [40, 2, 246, 248], [41, 2, 249, 252],   
  // Juz 3 (pages 42-61) — Al-Baqarah end + Ali Imran
  [42, 2, 253, 256], [43, 2, 257, 259], [44, 2, 260, 264], [45, 2, 265, 269], 
  [46, 2, 270, 274], [47, 2, 275, 281], [48, 2, 282, 282], [49, 2, 283, 286],
  [50, 3, 1, 9], [51, 3, 10, 15], [52, 3, 16, 22], [53, 3, 23, 29],
  [54, 3, 30, 37], [55, 3, 38, 45], [56, 3, 46, 52], [57, 3, 53, 61],
  [58, 3, 62, 70], [59, 3, 71, 77], [60, 3, 78, 83], [61, 3, 84, 91],   
  // Juz 4 (pages 62-81) — Ali Imran end + An-Nisa
  [62, 3, 92, 100], [63, 3, 101, 108], [64, 3, 109, 116], [65, 3, 117, 125], 
  [66, 3, 126, 133], [67, 3, 134, 140], [68, 3, 141, 148], [69, 3, 149, 153], 
  [70, 3, 154, 157], [71, 3, 158, 165], [72, 3, 166, 173], [73, 3, 174, 180],
  [74, 3, 181, 186], [75, 3, 187, 194], [76, 3, 195, 200], [77, 4, 1, 6], 
  [78, 4, 7, 11], [79, 4, 12, 14], [80, 4, 15, 19], [81, 4, 20, 23],
  // Juz 5 (pages 82-101) — An-Nisa continued
  [82, 4, 24, 26], [83, 4, 27, 33], [84, 4, 34, 37], [85, 4, 38, 44],
  [86, 4, 45, 51], [87, 4, 52, 59], [88, 4, 60, 65], [89, 4, 66, 74],
  [90, 4, 75, 79], [91, 4, 80, 86], [92, 4, 87, 91], [93, 4, 92, 94],
  [94, 4, 95, 101], [95, 4, 102, 105], [96, 4, 106, 113], [97, 4, 114, 121],
  [98, 4, 122, 127], [99, 4, 128, 134], [100, 4, 135, 140], [101, 4, 141, 147],
  // Juz 6 (pages 102-121) — An-Nisa end + Al-Ma'idah
  [102, 4, 148, 154], [103, 4, 155, 162], [104, 4, 163, 170], [105, 4, 171, 175],
  [106, 4, 176, 176], [106, 5, 1, 2], [107, 5, 3, 5], [108, 5, 6, 9],
  [109, 5, 10, 13], [110, 5, 14, 17], [111, 5, 18, 23], [112, 5, 24, 31],
  [113, 5, 32, 36], [114, 5, 37, 41], [115, 5, 42, 45], [116, 5, 46, 50],
  [117, 5, 51, 57], [118, 5, 58, 64], [119, 5, 65, 70], [120, 5, 71, 76],
  [121, 5, 77, 81],
  // Juz 7 (pages 122-141) — Al-Ma'idah end + Al-An'am
  [122, 5, 82, 89], [123, 5, 90, 95], [124, 5, 96, 103], [125, 5, 104, 108],
  [126, 5, 109, 113], [127, 5, 114, 120], [128, 6, 1, 8], [129, 6, 9, 18], 
  [130, 6, 19, 27], [131, 6, 28, 35], [132, 6, 36, 44], [133, 6, 45, 52], 
  [134, 6, 53, 59], [135, 6, 60, 68], [136, 6, 69, 73], [137, 6, 74, 81], 
  [138, 6, 82, 90], [139, 6, 91, 94], [140, 6, 95, 101], [141, 6, 102, 110],
  // Juz 8 (pages 142-161) — Al-An'am end + Al-A'raf
  [142, 6, 111, 118], [143, 6, 119, 124], [144, 6, 125, 131], [145, 6, 132, 137],
  [146, 6, 138, 142], [147, 6, 143, 146], [148, 6, 147, 151], [149, 6, 152, 157],
  [150, 6, 158, 165], [151, 7, 1, 11], [152, 7, 12, 22], [153, 7, 23, 30], 
  [154, 7, 31, 37], [155, 7, 38, 43], [156, 7, 44, 51], [157, 7, 52, 57], 
  [158, 7, 58, 67], [159, 7, 68, 73], [160, 7, 74, 81], [161, 7, 82, 87],
  // Juz 9 (pages 162-181) — Al-A'raf end + Al-Anfal
  [162, 7, 88, 95], [163, 7, 96, 104], [164, 7, 105, 120], [165, 7, 121, 130],
  [166, 7, 131, 137], [167, 7, 138, 143], [168, 7, 144, 149], [169, 7, 150, 155],
  [170, 7, 156, 159], [171, 7, 160, 163], [172, 7, 164, 170], [173, 7, 171, 178],
  [174, 7, 179, 187], [175, 7, 188, 195], [176, 7, 196, 206], [177, 8, 1, 8], 
  [178, 8, 9, 16], [179, 8, 17, 25], [180, 8, 26, 33], [181, 8, 34, 40],
  // Juz 10 (pages 182-201) — Al-Anfal end + At-Tawbah
  [182, 8, 41, 45], [183, 8, 46, 52], [184, 8, 53, 61], [185, 8, 62, 69],
  [186, 8, 70, 75], [187, 9, 1, 6], [188, 9, 7, 13], [189, 9, 14, 20], 
  [190, 9, 21, 26], [191, 9, 27, 31], [192, 9, 32, 36], [193, 9, 37, 40], 
  [194, 9, 41, 47], [195, 9, 48, 54], [196, 9, 55, 61], [197, 9, 62, 68], 
  [198, 9, 69, 72], [199, 9, 73, 79], [200, 9, 80, 86], [201, 9, 87, 93],
  // Juz 11 — At-Tawbah (lanjutan) + Yunus + Hud (awal)
  [202, 9, 94, 99], [203, 9, 100, 106], [204, 9, 107, 111], [205, 9, 112, 117], 
  [206, 9, 118, 122], [207, 9, 123, 129], [208, 10, 1, 6], [209, 10, 7, 14], 
  [210, 10, 15, 20], [211, 10, 21, 25], [212, 10, 26, 33], [213, 10, 34, 42], 
  [214, 10, 43, 53], [215, 10, 54, 61], [216, 10, 62, 70], [217, 10, 71, 78], 
  [218, 10, 79, 88], [219, 10, 89, 97], [220, 10, 98, 106], [221, 10, 107, 109], // Yunus selesai
  [221, 11, 1, 5], // Hud mulai
  // Juz 12 — Hud (lanjutan) + Yusuf (awal)
  [222, 11, 6, 12], [223, 11, 13, 19], [224, 11, 20, 28], [225, 11, 29, 37], 
  [226, 11, 38, 45], [227, 11, 46, 53], [228, 11, 54, 62], [229, 11, 63, 71], 
  [230, 11, 72, 81], [231, 11, 82, 88], [232, 11, 89, 97], [233, 11, 98, 108], 
  [234, 11, 109, 117], [235, 11, 118, 123], [235, 12, 1, 4], [236, 12, 5, 14], 
  [237, 12, 15, 22], [238, 12, 23, 30], [239, 12, 31, 37], [240, 12, 38, 43], [241, 12, 44, 52],
  // Juz 13 — Yusuf (lanjutan) + Ar-Ra'd + Ibrahim (Halaman 242 - 261)
  [242, 12, 53, 63], [243, 12, 64, 69], [244, 12, 70, 78], [245, 12, 79, 86], 
  [246, 12, 87, 95], [247, 12, 96, 103], [248, 12, 104, 111], // Yusuf selesai
  [249, 13, 1, 5], [250, 13, 6, 13], [251, 13, 14, 18], [252, 13, 19, 28], 
  [253, 13, 29, 34], [254, 13, 35, 43], // Ar-Ra'd selesai
  [255, 14, 1, 5], [256, 14, 6, 10], [257, 14, 11, 18], [258, 14, 19, 24], 
  [259, 14, 25, 33], [260, 14, 34, 42], [261, 14, 43, 52], // Ibrahim selesai
  // Juz 14 — Al-Hijr + An-Nahl (Halaman 262 - 281)
  [262, 15, 1, 15], [263, 15, 16, 31], [264, 15, 32, 51], [265, 15, 52, 70], 
  [266, 15, 71, 83], [267, 15, 84, 99], // Al-Hijr selesai
  [267, 16, 1, 6], [268, 16, 7, 14], [269, 16, 15, 26], [270, 16, 27, 34], 
  [271, 16, 35, 42], [272, 16, 43, 54], [273, 16, 55, 64], [274, 16, 65, 72], 
  [275, 16, 73, 82], [276, 16, 83, 90], [277, 16, 91, 102], [278, 16, 103, 110], 
  [279, 16, 111, 118], [280, 16, 119, 128], [281, 16, 128, 128], // An-Nahl selesai (Page 281 akhir Juz 14)
  // Juz 15 — Al-Isra + Al-Kahf (awal) (Halaman 282 - 301)
  [282, 17, 1, 7], [283, 17, 8, 17], [284, 17, 18, 27], [285, 17, 28, 38], 
  [286, 17, 39, 49], [287, 17, 50, 58], [288, 17, 59, 66], [289, 17, 67, 75], 
  [290, 17, 76, 86], [291, 17, 87, 96], [292, 17, 97, 104], [293, 17, 105, 111], // Al-Isra selesai
  [293, 18, 1, 4], // Al-Kahf mulai
  [294, 18, 5, 15], [295, 18, 16, 20], [296, 18, 21, 27], [297, 18, 28, 34], 
  [298, 18, 35, 45], [299, 18, 46, 53], [300, 18, 54, 61], [301, 18, 62, 74],
  // Juz 16 — Al-Kahf (akhir) + Maryam + Ta-Ha (Halaman 302 - 321)
  [302, 18, 75, 83], [303, 18, 84, 97], [304, 18, 98, 110], // Al-Kahf selesai
  [305, 19, 1, 11], [306, 19, 12, 25], [307, 19, 26, 38], [308, 19, 39, 51], 
  [309, 19, 52, 64], [310, 19, 65, 76], [311, 19, 77, 95], [312, 19, 96, 98], // Maryam selesai
  [312, 20, 1, 12], // Ta-Ha mulai
  [313, 20, 13, 37], [314, 20, 38, 51], [315, 20, 52, 64], [316, 20, 65, 76], 
  [317, 20, 77, 87], [318, 20, 88, 98], [319, 20, 99, 113], [320, 20, 114, 125], 
  [321, 20, 126, 135], // Ta-Ha selesai
  // Juz 17 (Halaman 322 - 341) — Al-Anbiya + Al-Hajj
  [322, 21, 1, 10], [323, 21, 11, 24], [324, 21, 25, 35], [325, 21, 36, 44], 
  [326, 21, 45, 57], [327, 21, 58, 72], [328, 21, 73, 81], [329, 21, 82, 90], 
  [330, 21, 91, 101], [331, 21, 102, 112], // Al-Anbiya selesai
  [332, 22, 1, 5], [333, 22, 6, 15], [334, 22, 16, 23], [335, 22, 24, 30], 
  [336, 22, 31, 38], [337, 22, 39, 46], [338, 22, 47, 55], [339, 22, 56, 64], 
  [340, 22, 65, 72], [341, 22, 73, 78], // Al-Hajj selesai
  // Juz 18 (Halaman 342 - 361) Al-Mu'minun + An-Nur + Al-Furqan (awal)
  [342, 23, 1, 17], [343, 23, 18, 27], [344, 23, 28, 42], [345, 23, 43, 59], 
  [346, 23, 60, 74], [347, 23, 75, 89], [348, 23, 90, 104], [349, 23, 105, 118], // Al-Mu'minun selesai
  [350, 24, 1, 10], [351, 24, 11, 20], [352, 24, 21, 27], [353, 24, 28, 31], 
  [354, 24, 32, 36], [355, 24, 37, 43], [356, 24, 44, 53], [357, 24, 54, 58], 
  [358, 24, 59, 64], // An-Nur selesai
  [359, 25, 1, 11], [360, 25, 12, 20], [361, 25, 21, 32],
  // Juz 19 (Halaman 362 - 381) Al-Furqan (lanjutan) + Ash-Shu'ara + An-Naml (awal)
  [362, 25, 33, 43], [363, 25, 44, 55], [364, 25, 56, 67], [365, 25, 68, 77], // Al-Furqan selesai
  [367, 26, 1, 19], [368, 26, 20, 39], [369, 26, 40, 60], [370, 26, 61, 83], 
  [371, 26, 84, 111], [372, 26, 112, 136], [373, 26, 137, 159], [374, 26, 160, 183], 
  [375, 26, 184, 206], [376, 26, 207, 227], // Ash-Shu'ara selesai
  [377, 27, 1, 6], [378, 27, 7, 13], [379, 27, 14, 22], [380, 27, 23, 35], 
  [381, 27, 36, 44],
  // Juz 20 (Halaman 382 - 401) An-Naml (lanjutan) + Al-Qasas + Al-Ankabut (awal)
  [382, 27, 45, 55], [383, 27, 56, 63], [384, 27, 64, 76], [385, 27, 77, 93], // An-Naml selesai
  [385, 28, 1, 5], // Al-Qasas mulai
  [386, 28, 6, 13], [387, 28, 14, 21], [388, 28, 22, 28], [389, 28, 29, 35], 
  [390, 28, 36, 43], [391, 28, 44, 50], [392, 28, 51, 59], [393, 28, 60, 70], 
  [394, 28, 71, 77], [395, 28, 78, 84], [396, 28, 85, 88], // Al-Qasas selesai
  [396, 29, 1, 6], // Al-Ankabut mulai
  [397, 29, 7, 14], [398, 29, 15, 23], [399, 29, 24, 30], [400, 29, 31, 38], 
  [401, 29, 39, 45],
  // Juz 21 — Al-Ankabut (akhir) + Ar-Rum + Luqman + As-Sajdah + Al-Ahzab (awal)
  [402, 29, 46, 52], [403, 29, 53, 63], [404, 29, 64, 69], [404, 30, 1, 5], 
  [405, 30, 6, 15], [406, 30, 16, 24], [407, 30, 25, 32], [408, 30, 33, 41], 
  [409, 30, 42, 50], [410, 30, 51, 60], [411, 31, 1, 11], [412, 31, 12, 19], 
  [413, 31, 20, 28], [414, 31, 29, 34], [415, 32, 1, 11], [416, 32, 12, 20], 
  [417, 32, 21, 30], [418, 33, 1, 6], [419, 33, 7, 15], [420, 33, 16, 22], [421, 33, 23, 30],
  // Juz 22 — Al-Ahzab (lanjutan) + Saba + Fatir + Ya-Sin (awal)
  [422, 33, 31, 35], [423, 33, 36, 43], [424, 33, 44, 50], [425, 33, 51, 54], 
  [426, 33, 55, 62], [427, 33, 63, 73], [428, 34, 1, 7], [429, 34, 8, 14], 
  [430, 34, 15, 22], [431, 34, 23, 31], [432, 34, 32, 39], [433, 34, 40, 48],
  [434, 34, 49, 54], [434, 35, 1, 3], [435, 35, 4, 11], [436, 35, 12, 18], 
  [437, 35, 19, 30], [438, 35, 31, 38], [439, 35, 39, 44], [440, 35, 45, 45], 
  [440, 36, 1, 12], [441, 36, 13, 27],
  // Juz 23 — Ya-Sin (lanjutan) + As-Saffat + Sad + Az-Zumar (awal)
  [442, 36, 28, 40], [443, 36, 41, 54], [444, 36, 55, 70], [445, 36, 71, 83], 
  [446, 37, 1, 24], [447, 37, 25, 51], [448, 37, 52, 76], [449, 37, 77, 102], 
  [450, 37, 103, 126], [451, 37, 127, 153], [452, 37, 154, 182], [453, 38, 1, 16], 
  [454, 38, 17, 26], [455, 38, 27, 42], [456, 38, 43, 61], [457, 38, 62, 83], 
  [458, 38, 84, 88], [458, 39, 1, 5], [459, 39, 6, 10], [460, 39, 11, 21], [461, 39, 22, 31],
  // Juz 24 — Az-Zumar (lanjutan) + Ghafir + Fussilat (awal)
  [462, 39, 32, 40], [463, 39, 41, 47], [464, 39, 48, 56], [465, 39, 57, 67], 
  [466, 39, 68, 75], [467, 40, 1, 7], [468, 40, 8, 16], [469, 40, 17, 25], 
  [470, 40, 26, 33], [471, 40, 34, 40], [472, 40, 41, 49], [473, 40, 50, 58], 
  [474, 40, 59, 66], [475, 40, 67, 77], [476, 40, 78, 85], [477, 41, 1, 11], 
  [478, 41, 12, 20], [479, 41, 21, 29], [480, 41, 30, 38], [481, 41, 39, 46],
  // Juz 25 — Fussilat (akhir) + Ash-Shura + Az-Zukhruf + Ad-Dukhan + Al-Jathiyah
  [482, 41, 47, 54], [483, 42, 1, 10], [484, 42, 11, 15], [485, 42, 16, 22], 
  [486, 42, 23, 31], [487, 42, 32, 44], [488, 42, 45, 53], [489, 43, 1, 10], 
  [490, 43, 11, 22], [491, 43, 23, 33], [492, 43, 34, 47], [493, 43, 48, 60], 
  [494, 43, 61, 73], [495, 43, 74, 89], [496, 44, 1, 18], [497, 44, 19, 39], 
  [498, 44, 40, 59], [499, 45, 1, 13], [500, 45, 14, 22], [501, 45, 23, 37],
  // Juz 26 — Al-Ahqaf + Muhammad + Al-Fath + Al-Hujurat + Qaf + Adh-Dhariyat (awal)
  [502, 46, 1, 10], [503, 46, 11, 20], [504, 46, 21, 28], [505, 46, 29, 35], 
  [506, 47, 1, 11], [507, 47, 12, 19], [508, 47, 20, 29], [509, 47, 30, 38], 
  [511, 48, 1, 9], [512, 48, 10, 15], [513, 48, 16, 23], [514, 48, 24, 28], 
  [515, 48, 29, 29], [515, 49, 1, 4], [516, 49, 5, 11], [517, 49, 12, 18], 
  [518, 50, 1, 15], [519, 50, 16, 35], [520, 50, 36, 45], [520, 51, 1, 6], 
  [521, 51, 7, 30],
  // Juz 27 — Adh-Dhariyat (akhir) s/d Al-Hadid
  [522, 51, 31, 60], [523, 52, 1, 14], [524, 52, 15, 31], [525, 52, 32, 49], 
  [526, 53, 1, 26], [527, 53, 27, 50], [528, 53, 51, 62], [528, 54, 1, 6], 
  [529, 54, 7, 27], [530, 54, 28, 49], [531, 54, 50, 55], [531, 55, 1, 16], 
  [532, 55, 17, 40], [533, 55, 41, 78], [534, 56, 1, 50], [535, 56, 51, 76], 
  [536, 56, 77, 96], [537, 57, 1, 11], [538, 57, 12, 18], [539, 57, 19, 24], 
  [540, 57, 25, 29], [541, 57, 29, 29],
  // Juz 28 — Al-Mujadilah s/d At-Tahrim
  [542, 58, 1, 6], [543, 58, 7, 11], [544, 58, 12, 21], [545, 58, 22, 22], 
  [545, 59, 1, 3], [546, 59, 4, 9], [547, 59, 10, 17], [548, 59, 18, 24], 
  [549, 60, 1, 5], [550, 60, 6, 11], [551, 60, 12, 13], [551, 61, 1, 5], 
  [552, 61, 6, 14], [553, 62, 1, 8], [554, 62, 9, 11], [554, 63, 1, 4], 
  [555, 63, 5, 11], [556, 64, 1, 9], [557, 64, 10, 18], [558, 65, 1, 5], 
  [559, 65, 6, 12], [560, 66, 1, 7], [561, 66, 8, 12],
  // Juz 29 — Al-Mulk s/d Al-Mursalat
  [562, 67, 1, 12], [563, 67, 13, 26], [564, 67, 27, 30], [564, 68, 1, 15], 
  [565, 68, 16, 42], [566, 68, 43, 52], [566, 69, 1, 8], [567, 69, 9, 34], 
  [568, 69, 35, 52], [568, 70, 1, 10], [569, 70, 11, 39], [570, 70, 40, 44], 
  [570, 71, 1, 10], [571, 71, 11, 28], [572, 72, 1, 13], [573, 72, 14, 28], 
  [574, 73, 1, 19], [575, 73, 20, 20], [575, 74, 1, 17], [576, 74, 18, 47], 
  [577, 74, 48, 56], [577, 75, 1, 19], [578, 75, 20, 40], [578, 76, 1, 5], 
  [579, 76, 6, 25], [580, 76, 26, 31], [580, 77, 1, 19], [581, 77, 20, 50],
  // Juz 30 — An-Naba s/d An-Nas
  [582, 78, 1, 30], [583, 78, 31, 40], [583, 79, 1, 15], [584, 79, 16, 46], 
  [585, 80, 1, 42], [586, 81, 1, 29], [587, 82, 1, 19], [587, 83, 1, 6], 
  [588, 83, 7, 36], [589, 84, 1, 25], [590, 85, 1, 22], [591, 86, 1, 17], 
  [591, 87, 1, 15], [592, 87, 16, 19], [592, 88, 1, 26], [593, 89, 1, 23], 
  [594, 89, 24, 30], [594, 90, 1, 20], [595, 91, 1, 15], [595, 92, 1, 21], 
  [596, 93, 1, 11], [596, 94, 1, 8], [597, 95, 1, 8], [597, 96, 1, 19], 
  [598, 97, 1, 5], [598, 98, 1, 8], [599, 99, 1, 8], [599, 100, 1, 11], 
  [600, 101, 1, 11], [600, 102, 1, 8], [601, 103, 1, 3], [601, 104, 1, 9], 
  [601, 105, 1, 5], [602, 106, 1, 4], [602, 107, 1, 7], [602, 108, 1, 3], 
  [603, 109, 1, 6], [603, 110, 1, 3], [603, 111, 1, 5], [604, 112, 1, 4], 
  [604, 113, 1, 5], [604, 114, 1, 6]
];

// Build a Map from the raw data
const _pageMap = new Map<number, MushafPageContent[]>();

for (const [page, surahNum, ayatStart, ayatEnd] of PAGE_MAPPINGS) {
  const surah = surahList.find(s => s.number === surahNum);
  const entry: MushafPageContent = {
    surahNumber: surahNum,
    surahName: surah?.name || `Surah ${surahNum}`,
    ayatStart,
    ayatEnd,
  };
  const existing = _pageMap.get(page) || [];
  existing.push(entry);
  _pageMap.set(page, existing);
}

// For pages not in the detailed mapping, generate approximate content
// based on surah data and page distribution
function _generateApproxContent(page: number): MushafPageContent[] {
  const juz = getJuzForPage(page);
  const surahs = surahList.filter(s => s.juzStart <= juz && s.juzEnd >= juz);
  
  if (surahs.length === 0) return [];
  
  // Return the primary surah(s) for this juz
  const { start: juzStart, count: juzPages } = getPagesForJuz(juz);
  const pageInJuz = page - juzStart; // 0-indexed
  
  // Distribute ayahs across pages proportionally
  const totalAyahs = surahs.reduce((sum, s) => sum + s.numberOfAyahs, 0);
  const ayahsPerPage = Math.ceil(totalAyahs / juzPages);
  const startAyahOffset = pageInJuz * ayahsPerPage;
  
  let currentOffset = 0;
  const result: MushafPageContent[] = [];
  
  for (const s of surahs) {
    const surahStartInJuz = currentOffset;
    const surahEndInJuz = currentOffset + s.numberOfAyahs - 1;
    
    if (surahEndInJuz >= startAyahOffset && surahStartInJuz < startAyahOffset + ayahsPerPage) {
      const ayatStart = Math.max(1, startAyahOffset - surahStartInJuz + 1);
      const ayatEnd = Math.min(s.numberOfAyahs, startAyahOffset + ayahsPerPage - surahStartInJuz);
      
      if (ayatStart <= s.numberOfAyahs && ayatEnd >= 1) {
        result.push({
          surahNumber: s.number,
          surahName: s.name,
          ayatStart: Math.max(1, ayatStart),
          ayatEnd: Math.min(s.numberOfAyahs, Math.max(1, ayatEnd)),
        });
      }
    }
    currentOffset += s.numberOfAyahs;
  }
  
  return result.length > 0 ? result : [{
    surahNumber: surahs[0].number,
    surahName: surahs[0].name,
    ayatStart: 1,
    ayatEnd: Math.min(surahs[0].numberOfAyahs, ayahsPerPage),
  }];
}

// ============ Public API ============


/**
 * Get content (surah & ayat info) for a specific Mushaf page.
 */
export function getPageContent(page: number): MushafPageContent[] {
  if (page < 1 || page > TOTAL_PAGES) return [];
  return _pageMap.get(page) || _generateApproxContent(page);
}

/**
 * Get the absolute Mushaf page number from juz + relative page within juz.
 * E.g. Juz 1, page 3 → absolute page 3
 * E.g. Juz 2, page 1 → absolute page 21
 */
export function getAbsolutePage(juz: number, relativePageInJuz: number): number {
  const { start } = getPagesForJuz(juz);
  return start + relativePageInJuz - 1;
}

/**
 * Get a formatted summary of what's on a given page.
 */
export function getPageSummary(page: number): string {
  const content = getPageContent(page);
  if (content.length === 0) return "";
  
  return content
    .map(c => `${c.surahName} : ${c.ayatStart}–${c.ayatEnd}`)
    .join(" | ");
}

/**
 * Get page summary from juz + relative page number.
 */
export function getPageSummaryByJuz(juz: number, relativePageInJuz: number): string {
  const absPage = getAbsolutePage(juz, relativePageInJuz);
  return getPageSummary(absPage);
}

// ============ Anti-duplication ============

export interface SetoranRecord {
  santriId: string;
  jenis: string;
  surahNumber: number;
  ayatDari: number;
  ayatSampai: number;
}

/**
 * Check if a new setoran overlaps with any existing records.
 * Returns the overlapping record if found, null otherwise.
 */
export function checkDuplicateSetoran(
  newRecord: Omit<SetoranRecord, "santriId" | "jenis">,
  existingRecords: SetoranRecord[],
  santriId: string,
  jenis: string
): SetoranRecord | null {
  for (const existing of existingRecords) {
    if (
      existing.santriId === santriId &&
      existing.jenis === jenis &&
      existing.surahNumber === newRecord.surahNumber &&
      existing.ayatDari <= newRecord.ayatSampai &&
      existing.ayatSampai >= newRecord.ayatDari
    ) {
      return existing;
    }
  }
  return null;
}

export function getSurahListByJuz(juz: number) {
  const { start, end } = getPagesForJuz(juz);
  const surahMap = new Map<number, { number: number; name: string; numberOfAyahs: number }>();

  for (let page = start; page <= end; page++) {
    const content = getPageContent(page);

    content.forEach((c) => {
      if (!surahMap.has(c.surahNumber)) {
        const fullSurah = surahList.find(s => s.number === c.surahNumber);
        surahMap.set(c.surahNumber, {
          number: c.surahNumber,
          name: c.surahName,
          numberOfAyahs: fullSurah?.numberOfAyahs || 0,
        });
      }
    });
  }

  return Array.from(surahMap.values());
}

/**
 * Find the page (relative to juz) that contains a specific surah + ayat.
 * Returns { relativePage, absolutePage } or null if not found.
 */
export function getPageFromSurahAyat(
  juz: number,
  surahNumber: number,
  ayat: number
): { relativePage: number; absolutePage: number } | null {
  const { start, end } = getPagesForJuz(juz);

  for (let page = start; page <= end; page++) {
    const content = getPageContent(page);
    for (const c of content) {
      if (
        c.surahNumber === surahNumber &&
        ayat >= c.ayatStart &&
        ayat <= c.ayatEnd
      ) {
        return {
          relativePage: page - start + 1,
          absolutePage: page,
        };
      }
    }
  }
  return null;
}

/**
 * Get page range (relative to juz) for a surah+ayat range within a juz.
 */
export function getPageRangeFromAyatRange(
  juz: number,
  surahNumber: number,
  ayatDari: number,
  ayatSampai: number
): { dari: number; sampai: number } | null {
  const startPage = getPageFromSurahAyat(juz, surahNumber, ayatDari);
  const endPage = getPageFromSurahAyat(juz, surahNumber, ayatSampai);
  if (!startPage || !endPage) return null;
  return { dari: startPage.relativePage, sampai: endPage.relativePage };
}

/**
 * Get the valid ayat range for a surah within a specific juz.
 * A surah may span multiple juz, so this returns only the portion in the given juz.
 */
export function getAyatRangeForSurahInJuz(
  juz: number,
  surahNumber: number
): { ayatMin: number; ayatMax: number } | null {
  const { start, end } = getPagesForJuz(juz);
  let ayatMin = Infinity;
  let ayatMax = -Infinity;

  for (let page = start; page <= end; page++) {
    const content = getPageContent(page);
    for (const c of content) {
      if (c.surahNumber === surahNumber) {
        ayatMin = Math.min(ayatMin, c.ayatStart);
        ayatMax = Math.max(ayatMax, c.ayatEnd);
      }
    }
  }

  if (ayatMin === Infinity) return null;
  return { ayatMin, ayatMax };
}

/**
 * Get detailed content for a range of pages (relative to juz).
 * Returns all surah/ayat entries across all pages in the range.
 */
export function getDetailedContentForPageRange(
  juz: number,
  relativePageFrom: number,
  relativePageTo: number
): MushafPageContent[] {
  const { start } = getPagesForJuz(juz);
  const result: MushafPageContent[] = [];
  const seen = new Set<string>();

  for (let rel = relativePageFrom; rel <= relativePageTo; rel++) {
    const absPage = start + rel - 1;
    const content = getPageContent(absPage);
    for (const c of content) {
      const key = `${c.surahNumber}-${c.ayatStart}-${c.ayatEnd}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(c);
      }
    }
  }

  // Merge consecutive entries of same surah
  const merged: MushafPageContent[] = [];
  for (const c of result) {
    const last = merged[merged.length - 1];
    if (last && last.surahNumber === c.surahNumber && c.ayatStart <= last.ayatEnd + 1) {
      last.ayatEnd = Math.max(last.ayatEnd, c.ayatEnd);
    } else {
      merged.push({ ...c });
    }
  }

  return merged;
}