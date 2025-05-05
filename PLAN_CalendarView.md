# Implementation Plan: Comprehensive Calendar View

This plan outlines the steps and considerations for implementing the Comprehensive Calendar View feature in the 'capstone-room-reservation' project.

## 1. Key Components

- **`ComprehensiveCalendarView` (Client Component):**
  - Location: `src/features/comprehensive-calendar/components/ComprehensiveCalendarView.tsx`
  - Responsibilities:
    - Receives initial data (`initialReservations`, `initialStartDate`, etc.) as props from the parent Server Component (`page.tsx`).
    - Manages client-side state for selected date range and filters.
    - Uses `useRouter` from `next/navigation` to update URL search parameters when dates/filters change, triggering server-side data refetching.
    - Renders `CalendarControls` and the main `CalendarDisplay`.
- **`CalendarControls` (Client Component):**
  - Location: `src/features/comprehensive-calendar/components/CalendarControls.tsx`
  - Responsibilities:
    - Provides UI elements for date range selection (e.g., month/week navigation, date picker).
    - Includes filtering options (e.g., dropdowns or multi-selects for rooms, reservation status).
    - Communicates filter changes back to `ComprehensiveCalendarView` to update state and trigger URL updates.
- **`CalendarDisplay` (Client Component):**
  - Location: `src/features/comprehensive-calendar/components/CalendarDisplay.tsx`
  - Responsibilities:
    - Receives reservation data as props.
    - Renders the actual calendar grid (potentially using or adapting `src/components/ui/calendar.tsx` or a library like `react-big-calendar`).
    - Displays fetched reservations as events on the calendar.
    - Handles event rendering logic (e.g., styling based on status, showing basic info).
- **`ReservationPopover` / `ReservationDetailsModal` (Client Component):**
  - Location: `src/features/comprehensive-calendar/components/ReservationPopover.tsx` (or Modal)
  - Responsibilities:
    - Displays detailed information about a reservation when a user hovers over or clicks an event on the `CalendarDisplay`.
    - Uses data passed down through props.

## 2. Data Requirements

- **Primary Data:** A collection of reservation objects fetched on the server.
- **Required Fields per Reservation (from Server Function):**
  - `id`
  - `room_id`
  - `room_name` (joined data)
  - `user_id`
  - `user_name` (joined data)
  - `start_time`
  - `end_time`
  - `status` (e.g., 'PENDING', 'APPROVED', 'REJECTED')
  - `purpose` (optional, for display)
- **Filtering Parameters (used by Server Function via URL Search Params):**
  - `startDate`: The start of the visible date range.
  - `endDate`: The end of the visible date range.
  - `roomIds` (optional): Array of room IDs to filter by.
  - `statuses` (optional): Array of reservation statuses to filter by.

## 3. Data Fetching (RSC Approach with Raw SQL)

- **Server-Side Data Fetching Function:** Create a dedicated server-side function using raw SQL.

  - Location: `src/features/comprehensive-calendar/api/getComprehensiveReservations.ts`
  - Function Logic (Example using `pg`):

    ```typescript
    // src/features/comprehensive-calendar/api/getComprehensiveReservations.ts
    import { pool } from "@/lib/db"; // Assuming db.ts exports a pg Pool named 'pool'
    import { ReservationStatus } from "@/types"; // Adjust path/type as needed

    interface GetComprehensiveReservationsParams {
      startDate: Date;
      endDate: Date;
      roomIds?: string[];
      statuses?: ReservationStatus[];
    }

    // Define a suitable return type matching query columns
    type ComprehensiveReservation = {
      id: string;
      start_time: Date;
      end_time: Date;
      status: ReservationStatus;
      purpose: string | null;
      room_id: string;
      room_name: string;
      user_id: string;
      user_name: string;
    };

    export async function getComprehensiveReservations(
      params: GetComprehensiveReservationsParams
    ): Promise<ComprehensiveReservation[]> {
      // 1. Add authorization checks here (e.g., check user role via session)

      const queryParams: any[] = [params.startDate, params.endDate];
      let sql = `
        SELECT
          r.id,
          r.start_time,
          r.end_time,
          r.status,
          r.purpose,
          r.room_id,
          rm.name AS room_name,
          r.user_id,
          u.name AS user_name -- Adjust user table/column names if needed
        FROM
          reservations r -- Adjust table name if needed
        JOIN
          rooms rm ON r.room_id = rm.id -- Adjust table/column names
        JOIN
          users u ON r.user_id = u.id -- Adjust table/column names
        WHERE
          r.start_time < $2 AND r.end_time > $1 -- Overlap condition
      `;

      let paramIndex = 3;

      if (params.roomIds && params.roomIds.length > 0) {
        sql += ` AND r.room_id = ANY($${paramIndex}::uuid[])`; // Assuming room_id is UUID
        queryParams.push(params.roomIds);
        paramIndex++;
      }

      if (params.statuses && params.statuses.length > 0) {
        sql += ` AND r.status = ANY($${paramIndex}::text[])`; // Assuming status is text
        queryParams.push(params.statuses);
        paramIndex++;
      }

      sql += ` ORDER BY r.start_time ASC;`;

      try {
        const result = await pool.query<ComprehensiveReservation>(
          sql,
          queryParams
        );
        // Optional: Map snake_case columns to camelCase if needed by frontend
        return result.rows;
      } catch (error) {
        console.error("Error fetching comprehensive reservations:", error);
        throw new Error("Failed to fetch reservations.");
      }
    }
    ```

- **Page Component (Server Component):**
  - Location: e.g., `src/app/(dashboard)/admin/calendar/page.tsx`
  - Responsibilities:
    - Acts as a Server Component.
    - Reads `searchParams` (startDate, endDate, filters).
    - Parses parameters using utility functions (e.g., in `src/lib/utils.ts`).
    - Calls `await getComprehensiveReservations()` with parsed parameters.
    - Passes the fetched `reservations` and initial parameters as props to the client component `<ComprehensiveCalendarView />`.
- **Client Component Interaction:**
  - `ComprehensiveCalendarView` and children are Client Components (`"use client";`).
  - User interactions (changing dates, applying filters) update client-side state.
  - State changes trigger `router.push()` or `router.replace()` with updated URL search parameters.
  - Next.js navigation re-renders the `page.tsx` Server Component, which re-runs `getComprehensiveReservations` with the new parameters from the URL.

## 4. UI/UX Considerations

- **Navigation:** Allow easy navigation between months/weeks/days via `CalendarControls`.
- **Event Display:** Clearly display reservations on `CalendarDisplay`. Use color-coding/icons for status. Handle overlaps.
- **Details on Demand:** Use `ReservationPopover` (hover) and/or `ReservationDetailsModal` (click) leveraging UI components (`Tooltip`, `Dialog`).
- **Filtering:** Filters in `CalendarControls` should update dynamically via URL changes. Include a "clear filters" option.
- **Responsiveness:** Ensure the calendar adapts to different screen sizes.
- **Loading/Empty States:** Provide visual feedback (e.g., `Skeleton` components) during navigation/refetching and when no reservations match criteria.

## 5. File Structure Suggestions

- **New Feature Directory:**
  - `src/features/comprehensive-calendar/`
    - `api/`
      - `getComprehensiveReservations.ts`
    - `components/`
      - `ComprehensiveCalendarView.tsx` (Client)
      - `CalendarControls.tsx` (Client)
      - `CalendarDisplay.tsx` (Client)
      - `ReservationPopover.tsx` (Client)
      - _(Other supporting components)_
    - `hooks/` (Optional)
    - `types/` (Optional)
- **New Page (Server Component):**
  - `src/app/(dashboard)/admin/calendar/page.tsx` (or other appropriate route)
- **Utilities:**
  - Add necessary parameter parsing functions to `src/lib/utils.ts`.
