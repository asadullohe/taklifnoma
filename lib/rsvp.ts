export type RsvpAttendance = "attending" | "not_attending";

export type RsvpState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: {
    guestName?: string;
    status?: string;
    guestCount?: string;
    note?: string;
  };
};

export const initialRsvpState: RsvpState = {
  status: "idle",
  message: "",
};

export const RSVP_COOKIE_NAME = "rsvp_submitted";

export function getRsvpSuccessState(
  attendance: RsvpAttendance,
): RsvpState {
  return {
    status: "success",
    message:
      attendance === "attending"
        ? "Ajoyib! Javobingiz yetib bordi — sizni intiqlik bilan kutamiz."
        : "Javobingiz yetib bordi. Xabar berganingiz uchun rahmat.",
  };
}

export function isRsvpAttendance(value: unknown): value is RsvpAttendance {
  return value === "attending" || value === "not_attending";
}
