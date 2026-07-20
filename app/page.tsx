import Invitation from "@/components/Invitation";
import { cookies } from "next/headers";
import {
  getRsvpSuccessState,
  initialRsvpState,
  isRsvpAttendance,
  RSVP_COOKIE_NAME,
} from "@/lib/rsvp";

export default async function Home() {
  const submittedAttendance = (await cookies()).get(RSVP_COOKIE_NAME)?.value;
  const rsvpState = isRsvpAttendance(submittedAttendance)
    ? getRsvpSuccessState(submittedAttendance)
    : initialRsvpState;

  return <Invitation initialRsvpState={rsvpState} />;
}
