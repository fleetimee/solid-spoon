import * as React from "react";

interface AdminNotificationTemplateProps {
  userName: string;
  userEmail: string;
  roomName: string;
  reservationDate: string;
  reservationTime: string;
  purpose: string;
  adminPanelUrl?: string;
}

export const AdminNotificationTemplate: React.FC<
  Readonly<AdminNotificationTemplateProps>
> = ({
  userName,
  userEmail,
  roomName,
  reservationDate,
  reservationTime,
  purpose,
  adminPanelUrl = "/admin/rooms/reservations",
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
          backgroundColor: "#eff6ff",
          textAlign: "center",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
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
            color: "#2563eb",
            fontSize: "24px",
            margin: "0",
            fontWeight: "bold",
          }}
        >
          Reservasi Baru Memerlukan Persetujuan
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
          Kepada Admin Yang Terhormat,
        </p>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            margin: "0 0 24px 0",
            color: "#374151",
          }}
        >
          Terdapat reservasi ruangan baru yang memerlukan peninjauan dan
          persetujuan Anda. Berikut adalah detail reservasinya:
        </p>

        {/* Reservation Details Card */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "20px",
            borderRadius: "8px",
            margin: "0 0 24px 0",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              color: "#1e293b",
              fontSize: "18px",
              margin: "0 0 16px 0",
              fontWeight: "bold",
            }}
          >
            Detail Reservasi
          </h3>

          <table style={{ width: "100%", borderSpacing: "0" }}>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "bold",
                  width: "140px",
                  verticalAlign: "top",
                }}
              >
                Nama Pengguna:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {userName}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "bold",
                  verticalAlign: "top",
                }}
              >
                Email:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {userEmail}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "bold",
                  verticalAlign: "top",
                }}
              >
                Ruangan:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#374151",
                  fontWeight: "bold",
                }}
              >
                {roomName}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "bold",
                  verticalAlign: "top",
                }}
              >
                Tanggal:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {reservationDate}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "bold",
                  verticalAlign: "top",
                }}
              >
                Waktu:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {reservationTime}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "bold",
                  verticalAlign: "top",
                }}
              >
                Tujuan:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {purpose}
              </td>
            </tr>
          </table>
        </div>

        <p
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            margin: "0 0 24px 0",
            color: "#374151",
          }}
        >
          Mohon untuk meninjau dan memberikan persetujuan atau penolakan
          terhadap reservasi ini melalui panel admin.
        </p>

        {/* Action Button */}
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
                  margin: "0 0 16px 0",
                }}
              >
                Klik tombol di bawah untuk mengakses panel admin dan mengelola
                reservasi
              </p>
              <a
                href={adminPanelUrl}
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
                Buka Panel Admin
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
          CapstoneD Manajemen Ruangan Meeting
        </p>
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "12px",
            color: "#9ca3af",
          }}
        >
          Email otomatis - Mohon jangan membalas email ini
        </p>
      </td>
    </tr>
  </table>
);
