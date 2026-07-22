export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: {
    name?: string;
    contact?: string;
    note?: string;
  };
};

export const initialContactState: ContactState = {
  status: "idle",
  message: "",
};
