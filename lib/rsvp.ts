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
