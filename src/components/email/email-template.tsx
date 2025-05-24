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
            ? "Reservation Approved!"
            : "Reservation Not Approved"}
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
          Dear {userName},
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
              We&apos;re pleased to inform you that your reservation for{" "}
              <strong style={{ color: "#15803d" }}>{roomName}</strong> has been
              approved! You can now proceed with using the room as scheduled.
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
              We regret to inform you that your reservation for{" "}
              <strong style={{ color: "#dc2626" }}>{roomName}</strong> could not
              be approved at this time.
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
                  <strong>Reason:</strong> {reason}
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
                You can view your bookings and manage your reservations at any
                time
              </p>
              <a
                href="/me/bookings"
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
                View My Bookings
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
          Thank you for using Capstone Room Reservation
        </p>
      </td>
    </tr>
  </table>
);
