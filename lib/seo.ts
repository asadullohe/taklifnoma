// Markazlashtirilgan sayt konfiguratsiyasi — SEO va metadata bir joyda.
export const site = {
  url: "https://asadullohe.uz",
  groom: "Asadulloh",
  bride: "Shahodatxon",
  // Marosim ma'lumotlari
  dateISO: "2026-08-01T17:00:00+05:00",
  dateText: "1-avgust 2026 · 17:00",
  timeText: "17:00",
  venue: "Orzu To'yxonasi",
  venueAddress: "Farg'ona viloyati, Bog'dod tumani, II Bog'dod MFY",
  locale: "uz_UZ",
} as const;

export const title = `${site.groom} & ${site.bride} — Nikoh to'yi taklifnomasi`;

export const description =
  `${site.groom} va ${site.bride}ning nikoh to'yiga taklifnoma. ` +
  `${site.dateText}, ${site.venue}, ${site.venueAddress}. ` +
  `Quvonchimizga sherik bo'lishingizdan chin qalbdan mamnun bo'lamiz.`;

export const keywords = [
  "taklifnoma",
  "nikoh to'yi",
  "to'y taklifnomasi",
  "wedding invitation",
  site.groom,
  site.bride,
  "Asadulloh va Shahodatxon",
  "Farg'ona to'y",
  "Bog'dod tumani",
  "Orzu to'yxonasi",
];
