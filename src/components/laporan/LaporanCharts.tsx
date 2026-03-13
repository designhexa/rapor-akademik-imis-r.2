import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

// Data capaian per kelas
interface CapaianKelasData {
  kelas: string;
  rataRata: number;
  totalSetoran: number;
}

// Data capaian per halaqoh  
interface CapaianHalaqohData {
  halaqoh: string;
  rataRata: number;
  totalSetoran: number;
}

// Data capaian per siswa
interface CapaianSiswaData {
  nama: string;
  juzSelesai: number;
  totalJuz: number;
  persentase: number;
}

interface LaporanChartsProps {
  capaianKelas: CapaianKelasData[];
  capaianHalaqoh: CapaianHalaqohData[];
  capaianSiswa: CapaianSiswaData[];
}

const chartConfig: ChartConfig = {
  rataRata: {
    label: "Rata-rata Nilai",
    color: "hsl(var(--primary))",
  },
  totalSetoran: {
    label: "Total Setoran",
    color: "hsl(var(--secondary))",
  },
  persentase: {
    label: "Persentase",
    color: "hsl(var(--primary))",
  },
};

const COLORS = [
  "hsl(160, 60%, 45%)",
  "hsl(45, 90%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(30, 85%, 55%)",
];

export function CapaianKelasChart({ data }: { data: CapaianKelasData[] }) {
  return (
    <Card>
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-sm md:text-base">📊 Capaian per Kelas</CardTitle>
        <CardDescription className="text-xs md:text-sm">Rata-rata nilai hafalan per kelas</CardDescription>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <ChartContainer config={chartConfig} className="h-[200px] md:h-[300px] w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
            <YAxis 
              type="category" 
              dataKey="kelas" 
              width={80} 
              tick={{ fontSize: 9 }} 
              tickFormatter={(value) => value.length > 12 ? value.slice(0, 10) + '...' : value}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="rataRata" name="Rata-rata Nilai" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function CapaianHalaqohChart({ data }: { data: CapaianHalaqohData[] }) {
  return (
    <Card>
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-sm md:text-base">📊 Capaian per Halaqoh</CardTitle>
        <CardDescription className="text-xs md:text-sm">Rata-rata nilai hafalan per halaqoh</CardDescription>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <ChartContainer config={chartConfig} className="h-[200px] md:h-[300px] w-full">
          <BarChart data={data} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="halaqoh" 
              tick={{ fontSize: 9 }} 
              angle={-25} 
              textAnchor="end" 
              height={50}
              tickFormatter={(value) => value.length > 10 ? value.slice(0, 8) + '...' : value}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="rataRata" name="Rata-rata Nilai" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function CapaianSiswaChart({ data }: { data: CapaianSiswaData[] }) {
  // Format data untuk pie chart
  const pieData = data.slice(0, 5).map((siswa, idx) => ({
    name: siswa.nama,
    value: siswa.persentase,
    fill: COLORS[idx % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-sm md:text-base">📊 Top 5 Santri Berprestasi</CardTitle>
        <CardDescription className="text-xs md:text-sm">Persentase capaian hafalan tertinggi</CardDescription>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <ChartContainer config={chartConfig} className="h-[220px] md:h-[300px] w-full">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                const shortName = name.length > 8 ? name.slice(0, 6) + '..' : name;
                return `${shortName}: ${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={60}
              dataKey="value"
              style={{ fontSize: 10 }}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function LaporanCharts({ capaianKelas, capaianHalaqoh, capaianSiswa }: LaporanChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CapaianKelasChart data={capaianKelas} />
      <CapaianHalaqohChart data={capaianHalaqoh} />
      <div className="lg:col-span-2">
        <CapaianSiswaChart data={capaianSiswa} />
      </div>
    </div>
  );
}
