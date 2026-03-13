import { useRef, useState } from "react";
import logoImis from "@/assets/logo-imis.png";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Image, Globe, Youtube, Instagram, Facebook } from "lucide-react";
import gedungImis from "@/assets/gedung-imis.jpeg";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

interface TasmiCandidate {
  no: number;
  nama: string;
  kelas: string;
  jumlahHafalan: string;
  juzDiujikan: string;
}

interface TasmiCandidateCardProps {
  candidates: TasmiCandidate[];
  schoolName?: string;
  schoolLogo?: string;
  scheduledDate?: Date;
  onGenerate?: () => void;
}

export const TasmiCandidateCard = ({
  candidates,
  schoolName = "PKBM Imam Muslim Islamic School",
  scheduledDate = new Date(),
}: TasmiCandidateCardProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customDate, setCustomDate] = useState<string>(format(scheduledDate, "yyyy-MM-dd"));
  const [customSchoolName, setCustomSchoolName] = useState(schoolName);
  const [customCaption, setCustomCaption] = useState(
    "\"Sesungguhnya Allah mengangkat dengan kitab Al-Qur'an ini beberapa kaum dan juga dengan kitab Al-Qur'an ini Allah merendahkan yang lainnya.\"\n\n(HR. Muslim)"
  );

  const colorSchemes: Record<string, { rows: [string, string]; header: string; headerBorder: string }> = {
    "hijau": { rows: ["#DCFCE7", "#F0FDF4"], header: "linear-gradient(to right, #15803d, #16a34a)", headerBorder: "rgba(34,197,94,0.5)" },
    "biru": { rows: ["#DBEAFE", "#EFF6FF"], header: "linear-gradient(to right, #1d4ed8, #2563eb)", headerBorder: "rgba(59,130,246,0.5)" },
    "kuning": { rows: ["#FEF3C7", "#FFFBEB"], header: "linear-gradient(to right, #a16207, #ca8a04)", headerBorder: "rgba(234,179,8,0.5)" },
    "ungu": { rows: ["#E9D5FF", "#FAF5FF"], header: "linear-gradient(to right, #7e22ce, #9333ea)", headerBorder: "rgba(168,85,247,0.5)" },
    "merah-muda": { rows: ["#FBCFE8", "#FDF2F8"], header: "linear-gradient(to right, #be185d, #db2777)", headerBorder: "rgba(236,72,153,0.5)" },
    "oranye": { rows: ["#FED7AA", "#FFF7ED"], header: "linear-gradient(to right, #c2410c, #ea580c)", headerBorder: "rgba(249,115,22,0.5)" },
    "abu-abu": { rows: ["#E5E7EB", "#F3F4F6"], header: "linear-gradient(to right, #374151, #4b5563)", headerBorder: "rgba(107,114,128,0.5)" },
  };

  const [selectedColor, setSelectedColor] = useState("hijau");

  const getRowColor = (index: number) => {
    const scheme = colorSchemes[selectedColor] || colorSchemes["hijau"];
    return scheme.rows[index % 2];
  };

  const currentScheme = colorSchemes[selectedColor] || colorSchemes["hijau"];

  const handleDownloadImage = async () => {
    if (!printRef.current) return;

    setIsGenerating(true);
    try {
      // Ensure webfonts are fully loaded before canvas render (important for html2canvas baseline alignment)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fonts = (document as any).fonts as FontFaceSet | undefined;
      if (fonts?.ready) {
        await fonts.ready;
      }
      // Small buffer so layout settles
      await new Promise((r) => setTimeout(r, 120));

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      
      const link = document.createElement("a");
      link.download = `jadwal-tasmi-${format(new Date(customDate), "yyyy-MM-dd")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast.success("Gambar berhasil diunduh!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Gagal generate gambar");
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedDate = format(new Date(customDate), "EEEE, d MMMM yyyy", { locale: id });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="w-4 h-4" />
            Generate Gambar Jadwal Tasmi'
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Sekolah</Label>
              <Input
                value={customSchoolName}
                onChange={(e) => setCustomSchoolName(e.target.value)}
                placeholder="Nama sekolah"
              />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Ujian</Label>
              <Input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Caption / Quote (Bawah Tabel)</Label>
            <Textarea
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              placeholder="Masukkan caption atau quote hafalan..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Warna Baris Tabel</Label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih warna" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(colorSchemes).map((key) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: colorSchemes[key].rows[0] }} />
                      <span className="capitalize">{key.replace("-", " ")}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleDownloadImage}
            disabled={isGenerating || candidates.length === 0}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Download Gambar"}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <div className="overflow-auto border rounded-lg bg-muted/50 p-4">
        <div
          ref={printRef}
          className="w-[1080px] min-h-[1080px] mx-auto relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #e8f5e9 0%, #f5f5f5 50%, #e3f2fd 100%)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${gedungImis})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.08,
            }}
          />

          {/* Content Container */}
          <div className="relative z-10 p-8 flex flex-col items-center">
            {/* Logo */}
            <div className="mb-4">
              <img 
                src={logoImis} 
                alt="Logo IMIS" 
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-green-800 mb-2" style={{ fontFamily: "serif" }}>
              Jadwal Sertifikasi Hafalan
            </h1>
            <div className="text-xl text-gray-700 mb-6 text-center">
              <span>{formattedDate}</span>
            </div>

            {/* Table */}
            <div className="w-full max-w-4xl bg-white/90 rounded-lg overflow-hidden shadow-xl" style={{ border: "2px solid #374151" }}>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: currentScheme.header }}>
                    <th className="p-0 text-center font-semibold text-white text-xl w-16" style={{ borderRight: "2px solid #374151", borderBottom: "2px solid #374151" }}>
                      <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>No.</div>
                    </th>
                    <th className="p-0 text-center font-semibold text-white text-xl" style={{ borderRight: "2px solid #374151", borderBottom: "2px solid #374151" }}>
                      <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>Nama Lengkap</div>
                    </th>
                    <th className="p-0 text-center font-semibold text-white text-xl w-20" style={{ borderRight: "2px solid #374151", borderBottom: "2px solid #374151" }}>
                      <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>Kelas</div>
                    </th>
                    <th className="p-0 text-center font-semibold text-white text-xl w-28" style={{ borderRight: "2px solid #374151", borderBottom: "2px solid #374151" }}>
                      <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>Jumlah Hafalan</div>
                    </th>
                    <th className="p-0 text-center font-semibold text-white text-xl w-44" style={{ borderBottom: "2px solid #374151" }}>
                      <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>Juz yang Diujikan</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate, index) => (
                    <tr
                      key={candidate.no}
                      style={{ backgroundColor: getRowColor(index) }}
                    >
                      <td className="p-0 text-center font-medium text-lg" style={{ borderRight: "1px solid #6B7280", borderBottom: "1px solid #6B7280" }}>
                        <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>
                          {candidate.no}
                        </div>
                      </td>
                      <td className="p-0 font-medium text-gray-800 text-lg" style={{ borderRight: "1px solid #6B7280", borderBottom: "1px solid #6B7280" }}>
                        <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "flex-start", lineHeight: 1.1 }}>
                          {candidate.nama}
                        </div>
                      </td>
                      <td className="p-0 text-center text-lg" style={{ borderRight: "1px solid #6B7280", borderBottom: "1px solid #6B7280" }}>
                        <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>
                          {candidate.kelas}
                        </div>
                      </td>
                      <td className="p-0 text-center text-lg" style={{ borderRight: "1px solid #6B7280", borderBottom: "1px solid #6B7280" }}>
                        <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>
                          {candidate.jumlahHafalan}
                        </div>
                      </td>
                      <td className="p-0 text-center font-medium text-green-700 text-lg" style={{ borderBottom: "1px solid #6B7280" }}>
                        <div style={{ minHeight: "56px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>
                          {candidate.juzDiujikan}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quote */}
            <div className="mt-8 max-w-3xl text-center whitespace-pre-wrap">
              <p className="text-gray-700 italic text-lg leading-relaxed font-medium">
                {customCaption}
              </p>
            </div>

            {/* Footer - Social Links */}
            <div className="mt-8 flex items-center justify-center">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "20px", padding: "10px 24px", borderRadius: "9999px", border: "2px solid #6B7280", backgroundColor: "transparent" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #4B5563", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Globe className="w-4 h-4 text-gray-700" strokeWidth={2} />
                  </div>
                  <span style={{ fontWeight: 600, color: "#374151", fontSize: "20px", height: "32px", display: "inline-flex", alignItems: "center", transform: "translateY(-1px)" }}>www.imis.sch.id</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #4B5563", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Youtube className="w-4 h-4 text-gray-700" strokeWidth={2} />
                  </div>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #4B5563", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Instagram className="w-4 h-4 text-gray-700" strokeWidth={2} />
                  </div>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #4B5563", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Facebook className="w-4 h-4 text-gray-700" strokeWidth={2} />
                  </div>
                  <span style={{ fontWeight: 600, color: "#374151", fontSize: "20px", height: "32px", display: "inline-flex", alignItems: "center", transform: "translateY(-1px)" }}>imammuslimislamicschool</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasmiCandidateCard;
