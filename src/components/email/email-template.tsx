import * as React from "react";

interface EmailTemplateProps {
  userName: string;
  status: "approved" | "rejected";
  roomName: string;
  reason?: string; // Optional reason for rejection
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  status,
  roomName,
  reason,
}) => (
  <table
    style={{
      fontFamily: "'Arial', sans-serif",
      maxWidth: "600px",
      width: "100%",
      margin: "0 auto",
      borderSpacing: "0",
      borderCollapse: "collapse",
      backgroundColor: "#ffffff",
    }}
  >
    <tr>
      <td
        style={{
          padding: "24px",
          backgroundColor: status === "approved" ? "#f0fdf4" : "#fef2f2",
          textAlign: "center",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke={status === "approved" ? "#15803d" : "#dc2626"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: "0 auto 16px auto", display: "block" }}
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="9" y1="2" x2="9" y2="6" />
          <line x1="15" y1="2" x2="15" y2="6" />
          <line x1="4" y1="10" x2="20" y2="10" />
        </svg>
        <h1
          style={{
            color: status === "approved" ? "#15803d" : "#dc2626",
            fontSize: "24px",
            margin: "0",
            fontWeight: "bold",
          }}
        >
          {status === "approved"
            ? "Reservasi Disetujui!"
            : "Reservasi Tidak Disetujui"}
        </h1>
      </td>
    </tr>
    <tr>
      <td style={{ padding: "32px 24px", backgroundColor: "#ffffff" }}>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            margin: "0 0 24px 0",
            color: "#374151",
          }}
        >
          Yang Terhormat {userName},
        </p>
        {status === "approved" ? (
          <div>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                margin: "0 0 24px 0",
                color: "#374151",
              }}
            >
              Kami dengan senang hati memberitahukan bahwa reservasi Anda untuk
              ruangan <strong style={{ color: "#15803d" }}>{roomName}</strong>{" "}
              telah disetujui! Anda sekarang dapat menggunakan ruangan tersebut
              sesuai jadwal yang telah ditentukan.
            </p>
          </div>
        ) : (
          <div>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                margin: "0 0 16px 0",
                color: "#374151",
              }}
            >
              Kami menyesal memberitahukan bahwa reservasi Anda untuk ruangan{" "}
              <strong style={{ color: "#dc2626" }}>{roomName}</strong> tidak
              dapat disetujui pada saat ini.
            </p>
            {reason && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  padding: "16px",
                  borderRadius: "6px",
                  margin: "0 0 24px 0",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    margin: "0",
                    color: "#991b1b",
                  }}
                >
                  <strong>Alasan:</strong> {reason}
                </p>
              </div>
            )}
          </div>
        )}
        <table
          style={{
            width: "100%",
            marginTop: "32px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "24px",
          }}
        >
          <tr>
            <td style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: "0 0 8px 0",
                }}
              >
                Anda dapat melihat booking dan mengelola reservasi Anda kapan
                saja
              </p>
              <a
                href={`${process.env.BETTER_AUTH_URL}/me/bookings`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Lihat Booking Saya
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td
        style={{
          padding: "24px",
          backgroundColor: "#f8fafc",
          borderRadius: "0 0 8px 8px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0",
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          Terima kasih telah menggunakan CapstoneD Manajemen Ruangan Meeting
        </p>
      </td>
    </tr>
  </table>
);
