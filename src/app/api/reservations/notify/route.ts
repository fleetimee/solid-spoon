import * as React from "react";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email/email-template"; // Import local EmailTemplate

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.EMAIL_FROM ||
  "CapstoneD <capstone-kelompok-d@capstone-mail.fleetime.my.id>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // Define Base URL
const SITE_NAME = "Capstone Room Reservation"; // Define Site Name

// Define interface for request body
interface NotifyRequestBody {
  reservationId: string;
  userEmail: string;
  status: "approved" | "rejected";
  roomName: string;
  userName: string;
  reason?: string | null; // Reason is optional
}

export async function POST(request: Request) {
  try {
    // Use the interface for type safety
    const body: NotifyRequestBody = await request.json();
    // Destructure, providing default null for reason
    const {
      reservationId,
      userEmail,
      status,
      roomName,
      userName,
      reason = null,
    } = body;

    // Add userName to the validation check
    if (!userEmail || !status || !roomName || !reservationId || !userName) {
      return NextResponse.json(
        {
          message:
            "Missing required fields (userEmail, status, roomName, reservationId, userName)",
        },
        { status: 400 }
      );
    }

    let subject = "";
    // Determine subject based on status
    if (status === "approved") {
      subject = "Your Room Reservation is Approved!";
    } else if (status === "rejected") {
      subject = "Update on Your Room Reservation";
    } else {
      console.warn("Received unhandled reservation status:", status);
      return NextResponse.json(
        { message: "Unhandled reservation status" },
        { status: 400 }
      );
    }

    try {
      // Create the React element for the email template
      const emailElement = React.createElement(EmailTemplate, {
        userName: userName,
        status: status,
        roomName: roomName,
        // Pass undefined if reason is null, otherwise pass the string
        reason: reason ?? undefined,
      });

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [userEmail],
        subject: subject,
        react: emailElement, // Pass the created element
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json(
          {
            message: "Failed to send notification email",
            error: error.message,
          },
          { status: 500 }
        );
      }

      console.log("Email sent successfully:", data);
      return NextResponse.json({
        message: "Notification email sent successfully",
        emailId: data?.id,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        { message: "Internal server error during email sending" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing notification request:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request body format" },
        { status: 400 }
      );
    }
    // General catch-all for other errors during request processing
    return NextResponse.json(
      { message: "Failed to process notification request" },
      { status: 500 }
    );
  }
}
