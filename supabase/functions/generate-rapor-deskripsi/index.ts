import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { namaSantri, mapel, nilai, materi, jenjang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    if (jenjang === "TK") {
      systemPrompt = `Kamu adalah guru TK Islam. Buatkan narasi perkembangan anak berdasarkan aspek dan capaian yang diberikan. Narasi harus positif, mendukung, menggunakan kata "Ananda", dan dalam bahasa Indonesia yang baik. Maksimal 2 kalimat.`;
    } else if (jenjang === "SD") {
      systemPrompt = `Kamu adalah guru SD Islam. Buatkan deskripsi capaian kompetensi siswa berdasarkan mata pelajaran, nilai, dan materi yang diberikan. Gunakan awalan "Ananda" dan bahasa Indonesia yang baik. Jika nilai >= 90: "sangat baik", 80-89: "baik", 70-79: "cukup baik", < 70: "perlu bimbingan lebih". Maksimal 2 kalimat.`;
    } else {
      systemPrompt = `Kamu adalah guru SMP Islam. Buatkan deskripsi capaian kompetensi siswa berdasarkan mata pelajaran, nilai, dan materi yang diberikan. Gunakan awalan "Ananda" dan bahasa Indonesia yang baik. Jika nilai >= 90: "sangat baik menguasai", 80-89: "baik dalam menguasai", 70-79: "cukup baik menguasai", < 70: "perlu belajar lebih giat lagi". Sebutkan materi spesifik. Maksimal 2 kalimat.`;
    }

    const userPrompt = `Nama siswa: ${namaSantri}\nMata Pelajaran: ${mapel}\nNilai: ${nilai}\nMateri: ${materi || "materi umum semester ini"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, coba lagi nanti." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit habis, silakan top up." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const deskripsi = result.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ deskripsi }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-rapor-deskripsi error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
