"use server";

import { cookies, headers } from "next/headers";
import { checkRsvpRateLimit } from "@/lib/rate-limit";
import {
  getRsvpSuccessState,
  isRsvpAttendance,
  RSVP_COOKIE_NAME,
  type RsvpState,
} from "@/lib/rsvp";
import { site } from "@/lib/seo";
import { escapeTelegramHtml, sendTelegramMessage } from "@/lib/telegram";

const MAX_NAME_LENGTH = 80;
const MAX_NOTE_LENGTH = 400;

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export async function submitRsvp(
  _previousState: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const cookieStore = await cookies();
  const submittedAttendance = cookieStore.get(RSVP_COOKIE_NAME)?.value;

  // Shu brauzerdan javob allaqachon yuborilgan bo'lsa, Telegramga dublikat
  // xabar jo'natmaymiz.
  if (isRsvpAttendance(submittedAttendance)) {
    return getRsvpSuccessState(submittedAttendance);
  }

  // Botlar ko'pincha ko'rinmas maydonni ham to'ldiradi. Ularga muvaffaqiyat
  // qaytaramiz, ammo Telegramga xabar yubormaymiz.
  if (cleanText(formData.get("website"))) {
    return {
      status: "success",
      message: "Javobingiz qabul qilindi. Rahmat!",
    };
  }

  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    requestHeaders.get("cf-connecting-ip") ||
    "anonymous";
  const rateLimit = checkRsvpRateLimit(`rsvp:${clientIp}`);

  if (!rateLimit.allowed) {
    return {
      status: "error",
      message: `Juda ko‘p urinish bo‘ldi. ${rateLimit.retryAfterSeconds} soniyadan keyin qayta urinib ko‘ring.`,
    };
  }

  const guestName = cleanText(formData.get("guestName"));
  const status = cleanText(formData.get("status"));
  const guestCountValue = Number(formData.get("guestCount"));
  const note = cleanText(formData.get("note"));
  const fieldErrors: NonNullable<RsvpState["fieldErrors"]> = {};

  if (guestName.length < 2 || guestName.length > MAX_NAME_LENGTH) {
    fieldErrors.guestName = "Ismingizni 2–80 ta belgi bilan kiriting.";
  }

  if (status !== "attending" && status !== "not_attending") {
    fieldErrors.status = "Kelishingiz yoki kela olmasligingizni belgilang.";
  }

  const guestCount = status === "attending" ? guestCountValue : 0;
  if (
    status === "attending" &&
    (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 5)
  ) {
    fieldErrors.guestCount = "Mehmonlar sonini 1–5 oralig‘ida kiriting.";
  }

  if (note.length > MAX_NOTE_LENGTH) {
    fieldErrors.note = "Sharh 400 ta belgidan oshmasligi kerak.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Iltimos, belgilangan maydonlarni tekshiring.",
      fieldErrors,
    };
  }

  const attending = status === "attending";
  const answer = attending ? "✅ Kelaman" : "❌ Kela olmayman";
  const submittedAt = new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tashkent",
  }).format(new Date());
  const text = [
    attending
      ? "✅ <b>Yangi RSVP: kelaman</b>"
      : "❌ <b>Yangi RSVP: kela olmayman</b>",
    "",
    `<b>Mehmon:</b> ${escapeTelegramHtml(guestName)}`,
    `<b>Javob:</b> ${answer}`,
    attending ? `<b>Soni:</b> ${guestCount}` : null,
    note ? `<b>Sharh:</b> ${escapeTelegramHtml(note)}` : null,
    `<b>Taklifnoma:</b> ${escapeTelegramHtml(site.groom)} va ${escapeTelegramHtml(site.bride)}`,
    `<b>Yuborildi:</b> ${escapeTelegramHtml(submittedAt)}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendTelegramMessage(text);
  } catch (error) {
    console.error("Telegram RSVP ulanish xatosi:", error);
    return {
      status: "error",
      message: "Hozir javobni yuborib bo‘lmadi. Iltimos, yana bir bor urinib ko‘ring.",
    };
  }

  const attendance = attending ? "attending" : "not_attending";
  cookieStore.set(RSVP_COOKIE_NAME, attendance, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  return getRsvpSuccessState(attendance);
}
