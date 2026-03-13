import { forwardRef } from "react";
import logoImis from "@/assets/logo-imis.png";

export interface SertifikatData {
  nama: string;
  nomorSertifikat: string;
  juzLulus: string;
  tanggalUjian: string; // formatted date string
  predikat: string;
  namaKetuaPKBM: string;
}

interface Props {
  data: SertifikatData;
  bgImage: string | null;
}

export const SertifikatPreview = forwardRef<HTMLDivElement, Props>(
  ({ data, bgImage }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "1120px",
          height: "794px",
          backgroundColor: "#ffffff",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Times New Roman', Georgia, serif",
        }}
      >
        {/* Background image */}
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Default decorative elements when no BG */}
        {!bgImage && (
          <>
            {/* Top-left green leaf decoration */}
            <div style={{
              position: "absolute",
              top: "-30px",
              left: "-30px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(ellipse at 30% 30%, #15803d 0%, #166534 40%, transparent 70%)",
              borderRadius: "0 0 100% 0",
              opacity: 0.8,
            }} />
            <div style={{
              position: "absolute",
              top: "20px",
              left: "80px",
              width: "120px",
              height: "80px",
              background: "radial-gradient(ellipse at 50% 50%, #22c55e 0%, transparent 70%)",
              borderRadius: "0 60px 0 60px",
              opacity: 0.5,
              transform: "rotate(-20deg)",
            }} />

            {/* Bottom-right green decoration */}
            <div style={{
              position: "absolute",
              bottom: "-40px",
              right: "-40px",
              width: "220px",
              height: "220px",
              background: "radial-gradient(ellipse at 70% 70%, #15803d 0%, #166534 40%, transparent 70%)",
              borderRadius: "100% 0 0 0",
              opacity: 0.8,
            }} />
            <div style={{
              position: "absolute",
              bottom: "30px",
              right: "100px",
              width: "100px",
              height: "60px",
              background: "radial-gradient(ellipse at 50% 50%, #22c55e 0%, transparent 70%)",
              borderRadius: "60px 0 60px 0",
              opacity: 0.4,
              transform: "rotate(15deg)",
            }} />

            {/* Yellow dots accent */}
            <div style={{
              position: "absolute",
              top: "140px",
              right: "60px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#eab308",
                  opacity: 0.7 - i * 0.1,
                }} />
              ))}
            </div>
          </>
        )}

        {/* Content */}
        <div style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px 80px 40px",
          height: "100%",
        }}>
          {/* Logo */}
          <img
            src={logoImis}
            alt="Logo IMIS"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              marginBottom: "6px",
            }}
          />

          {/* Basmallah */}
          <div style={{
            fontSize: "28px",
            color: "#15803d",
            fontFamily: "'Traditional Arabic', 'Scheherazade New', serif",
            direction: "rtl",
            marginBottom: "4px",
          }}>
            بسم الله الرحمن الرحيم
          </div>

          {/* SERTIFIKAT */}
          <div style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#15803d",
            letterSpacing: "6px",
            lineHeight: 1.1,
            textTransform: "uppercase",
          }}>
            SERTIFIKAT
          </div>

          {/* Nomor */}
          <div style={{
            fontSize: "14px",
            color: "#6B7280",
            marginTop: "2px",
            marginBottom: "8px",
          }}>
            {data.nomorSertifikat}
          </div>

          {/* Diberikan kepada */}
          <div style={{
            fontSize: "16px",
            color: "#374151",
            marginBottom: "4px",
          }}>
            Diberikan kepada:
          </div>

          {/* Nama */}
          <div style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#15803d",
            marginBottom: "12px",
            textAlign: "center",
            lineHeight: 1.2,
          }}>
            {data.nama || "Nama Santri"}
          </div>

          {/* Description */}
          <div style={{
            fontSize: "15px",
            color: "#374151",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: "700px",
            marginBottom: "8px",
          }}>
            Alhamdulillah telah menyelesaikan tasmi' {data.juzLulus} pada tanggal {data.tanggalUjian}
          </div>

          {/* predikat label */}
          <div style={{
            fontSize: "14px",
            color: "#374151",
            marginBottom: "6px",
          }}>
            predikat
          </div>

          {/* Predikat value */}
          <div style={{
            fontSize: "34px",
            fontWeight: "bold",
            color: "#15803d",
            textTransform: "uppercase",
            letterSpacing: "3px",
            marginBottom: "14px",
            textAlign: "center",
          }}>
            {data.predikat}
          </div>

          {/* Motivational text */}
          <div style={{
            fontSize: "14px",
            color: "#374151",
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: "720px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}>
            Kepadanya kami berikan penghargaan sebagai motivasi dan Semangat agar istiqomah bersama
            Al-Qur'an. Semoga kelak Ananda menjadi AhlulQur'an dan bermanfaat dunia akhirat.
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Signature */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "14px",
              color: "#374151",
              fontStyle: "italic",
              marginBottom: "50px",
            }}>
              Ketua PKBM Imam Muslim Islamic School
            </div>
            <div style={{
              width: "250px",
              borderBottom: "2px solid #374151",
              marginBottom: "6px",
            }} />
            <div style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1F2937",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}>
              {data.namaKetuaPKBM}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SertifikatPreview.displayName = "SertifikatPreview";
