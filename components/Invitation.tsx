"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/seo";
import RsvpForm from "@/components/RsvpForm";
import ContactCta from "@/components/ContactCta";
import type { RsvpState } from "@/lib/rsvp";

// Takrorlanuvchi bezak (SVG) — yuqori va pastki variantlari bor.
function Flourish({ bottom = false }: { bottom?: boolean }) {
  return (
    <svg
      className={bottom ? "flourish bottom" : "flourish"}
      viewBox="0 0 280 50"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
        stroke="#c3a24e"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M140 25 C 116 25, 112 9, 92 14 C 74 18, 80 36, 62 33 C 50 31, 54 20, 44 23" />
        <path d="M140 25 C 164 25, 168 9, 188 14 C 206 18, 200 36, 218 33 C 230 31, 226 20, 236 23" />
        <path d="M96 14 c -4 -6 -12 -6 -14 2" />
        <path d="M184 14 c 4 -6 12 -6 14 2" />
      </g>
      <path d="M140 15 l7 10 -7 10 -7 -10 z" fill="#c3a24e" />
      <circle cx="40" cy="23" r="2.4" fill="#c3a24e" />
      <circle cx="240" cy="23" r="2.4" fill="#c3a24e" />
    </svg>
  );
}

// Musiqa nota ikonkasi; o'chirilganda ustidan chiziq tortiladi.
function MusicIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18V5l10-2v13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.6" />
      {muted && (
        <path
          d="M3 3l18 18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

const z = (n: number) => String(n).padStart(2, "0");

// Bir konteynerga tushayotgan gulbarglarni qo'shadi (dekorativ, DOM orqali).
function fillPetals(box: HTMLElement | null) {
  if (!box) return;
  box.replaceChildren();
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("div");
    p.className = "wpetal";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 8 + Math.random() * 8 + "s";
    p.style.animationDelay = -Math.random() * 12 + "s";
    p.style.transform = "scale(" + (0.5 + Math.random() * 0.8) + ")";
    box.appendChild(p);
  }
}

const MUSIC_VOLUME = 0.45;

export default function Invitation({
  initialRsvpState,
}: {
  initialRsvpState?: RsvpState;
}) {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const wpetalsRef = useRef<HTMLDivElement>(null);
  const cpetalsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number | null>(null);

  // Safari paneli ochilib-yopilganda dvh o'zgarib, snap sectionlar sakramasligi
  // uchun balandlikni faqat yuklanishda va telefon aylantirilganda yangilaymiz.
  useEffect(() => {
    let orientationTimer: number | undefined;

    const setViewportHeight = () => {
      const height = window.innerHeight;
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${height}px`,
      );
      document.documentElement.classList.toggle("short-viewport", height <= 720);
    };

    const handleOrientationChange = () => {
      window.clearTimeout(orientationTimer);
      orientationTimer = window.setTimeout(setViewportHeight, 220);
    };

    setViewportHeight();
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.clearTimeout(orientationTimer);
    };
  }, []);

  // Brauzer qayta yuklanganda avvalgi scroll pozitsiyasini tiklamasin —
  // taklifnoma doim boshidan boshlansin.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Qulf holati — <body> classlarini boshqaradi.
  useEffect(() => {
    document.body.classList.toggle("opened", opened);
    document.body.classList.toggle("locked", !opened);
    // Ochilganda doim tepadan (hero) boshlansin — qulf ochilgunча saqlanib
    // qolgan scroll pozitsiyasida qandaydir sectionда qolib ketmasin.
    if (opened) window.scrollTo(0, 0);
  }, [opened]);

  useEffect(() => () => {
    if (fadeRef.current) clearInterval(fadeRef.current);
  }, []);

  // Tugma holati audio elementidan o'qiladi — yagona haqiqat manbai o'sha.
  // Shunda tashqi to'xtatishlar ham (qo'ng'iroq, lock ekran boshqaruvi,
  // quloqchin tugmasi) tugmada to'g'ri aks etadi.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const sync = () => setPlaying(!a.paused);
    a.addEventListener("play", sync);
    a.addEventListener("pause", sync);
    a.addEventListener("ended", sync);
    return () => {
      a.removeEventListener("play", sync);
      a.removeEventListener("pause", sync);
      a.removeEventListener("ended", sync);
    };
  }, []);

  // Ovozni 0 dan asta ko'tarish — birdan gumburlab ketmasligi uchun.
  const fadeIn = (a: HTMLAudioElement) => {
    if (fadeRef.current) clearInterval(fadeRef.current);
    a.volume = 0;
    fadeRef.current = window.setInterval(() => {
      const next = Math.min(a.volume + MUSIC_VOLUME / 30, MUSIC_VOLUME);
      a.volume = next;
      if (next >= MUSIC_VOLUME && fadeRef.current) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, 50);
  };

  // Qulfni bosish — foydalanuvchi harakati, shuning uchun brauzer ijroga ruxsat beradi.
  const openInvitation = () => {
    setOpened(true);
    play();
  };

  const play = () => {
    const a = audioRef.current;
    if (!a) return;
    fadeIn(a);
    // Rad etilsa (fayl yo'q yoki brauzer to'sdi) holat o'zgarmaydi —
    // 'play' hodisasi ishlamaydi, tugma o'chirilgan ko'rinishda qoladi.
    a.play().catch(() => {
      if (fadeRef.current) clearInterval(fadeRef.current);
    });
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      play();
    } else {
      if (fadeRef.current) clearInterval(fadeRef.current);
      a.pause();
    }
  };

  // Countdown timer.
  useEffect(() => {
    const target = new Date(site.dateISO).getTime();
    const tick = () => {
      const t = target - Date.now();
      if (t < 0) return;
      setTime({
        d: z(Math.floor(t / 864e5)),
        h: z(Math.floor((t % 864e5) / 36e5)),
        m: z(Math.floor((t % 36e5) / 6e4)),
        s: z(Math.floor((t % 6e4) / 1e3)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll bilan ochiladigan animatsiyalar (.reveal -> .in).
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((x) => {
          if (x.isIntersecting) x.target.classList.add("in");
        }),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Gulbarglar.
  useEffect(() => {
    fillPetals(wpetalsRef.current);
    fillPetals(cpetalsRef.current);
  }, []);

  const nameStyle = opened
    ? { opacity: 1, transform: "none", clipPath: "none" as const }
    : undefined;

  return (
    <>
      <div className="bg-glow" />
      <div className="bg-pattern" />

      {/* Fon musiqasi — qulf ochilganda boshlanadi (public/music.mp3) */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
      <button
        className={playing ? "music playing" : "music"}
        onClick={toggleMusic}
        aria-label={playing ? "Musiqani o'chirish" : "Musiqani yoqish"}
        aria-pressed={playing}
      >
        <MusicIcon muted={!playing} />
      </button>

      <div id="intro" onClick={openInvitation}>
        <div className="curtain left">
          <div className="silk" />
          <div className="sheen" />
        </div>
        <div className="curtain right">
          <div className="silk" />
          <div className="sheen" />
        </div>
        <div className="i-content">
          <div className="k">Sizga taklifnoma keldi</div>
          <div className="nm">
            <span className="groom" style={nameStyle}>
              {site.groom}
            </span>
            <span className="amp" style={nameStyle}>
              &amp;
            </span>
            <span className="bride" style={nameStyle}>
              {site.bride}
            </span>
          </div>
          <div className="sub">{site.dateText}</div>
          <button
            className="lock"
            id="openBtn"
            aria-label="Taklifnomani ochish"
          >
            🔒
          </button>
          <div className="hint">Ekranga bosib, taklifnomani oching</div>
        </div>
      </div>

      <div className="content">
        {/* 1. HERO */}
        <section className="hero">
          <div className="flo tr" />
          <div className="flo bl" />
          <div className="inv reveal">
            <div className="bism">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <div className="invite">
              <span className="salom">Assalomu alaykum!</span>
              <span className="greet">Hurmatli aziz mehmonimiz.</span>
              Sizni nikoh to&apos;yimizga bag&apos;ishlangan tantanali kechaning
              aziz mehmoni bo&apos;lishga taklif etamiz.
            </div>
            <div className="h-names">
              <div className="n">{site.groom}</div>
              <div className="amp">&amp;</div>
              <div className="n">{site.bride}</div>
            </div>
            <div className="dateblk">
              <div className="dmonth">AVGUST</div>
              <div className="drow">
                <div className="side">SHANBA</div>
                <div className="big">1</div>
                <div className="side">{site.timeText}</div>
              </div>
              <div className="dyear">2026</div>
            </div>
            <div className="addr">
              {site.venue}
              <br />
              Farg&apos;ona viloyati, Bog&apos;dod tumani
            </div>
          </div>
          <div className="scrollcue">⌄</div>
        </section>

        {/* 2. COUNTDOWN */}
        <section>
          <div className="flo cl" />
          <div className="flo cr" />
          <div className="reveal">
            <div className="eyebrow">To&apos;ygacha qolgan vaqt</div>
            <h2 className="stitle">Sanoqli kunlar</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="rings-img" alt="uzuklar" src="/rings.png" />
            <div className="timer">
              <div className="cell">
                <div className="n">{time.d}</div>
                <div className="l">Kun</div>
              </div>
              <div className="cell">
                <div className="n">{time.h}</div>
                <div className="l">Soat</div>
              </div>
              <div className="cell">
                <div className="n">{time.m}</div>
                <div className="l">Daqiqa</div>
              </div>
              <div className="cell">
                <div className="n">{time.s}</div>
                <div className="l">Soniya</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WELCOME */}
        <section>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="poppy l" src="/poppy.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="poppy r" src="/poppy.png" alt="" />
          <div className="wpetals" ref={wpetalsRef} />
          <div
            className="reveal"
            style={{ position: "relative", zIndex: 3, maxWidth: 600 }}
          >
            <Flourish />
            <div className="eyebrow" style={{ marginTop: 20 }}>
              Hurmatli mehmonlar
            </div>
            <div className="wbig">Sizni kutamiz</div>
            <p className="wlead">
              Biz uchun aziz bo&apos;lgan ushbu kunni siz bilan birga
              nishonlashni istaymiz. Quvonchimizga sherik bo&apos;lishingizdan
              chin qalbdan mamnun bo&apos;lamiz.
            </p>
            <Flourish bottom />
          </div>
        </section>

        {/* 4. VENUE */}
        <section>
          <div className="flo cl" />
          <div className="flo cr" />
          <div className="panel reveal">
            <Flourish />
            <div className="eyebrow" style={{ marginTop: 16 }}>
              Marosim joyi
            </div>
            <div className="vname">{site.venue}</div>
            <div className="vsub">
              Farg&apos;ona viloyati, Bog&apos;dod tumani
              <br />
              O&apos;zbekiston
            </div>
            <div className="vtime">
              <span />
              {`1-AVGUST · SOAT ${site.timeText} DAN`}
              <span />
            </div>
            <div className="map">
              <iframe
                src={`https://www.google.com/maps?q=${site.latitude},${site.longitude}&z=16&output=embed`}
                loading="lazy"
                title={`${site.venue} joylashuvi`}
              />
            </div>
            <div className="btns">
              <a
                className="btn solid"
                href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Yo&apos;l ko&apos;rsatish
              </a>
              <a
                className="btn"
                href={`https://yandex.uz/maps/?ll=${site.longitude}%2C${site.latitude}&z=16&pt=${site.longitude},${site.latitude},pm2rdm`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Yandex xarita
              </a>
            </div>
          </div>
        </section>

        {/* 5. RSVP */}
        <section className="rsvp-section">
          <div className="flo cl" />
          <div className="flo cr" />
          <div className="rsvp-wrap reveal">
            <div className="rsvp-heading">
              <div className="eyebrow">Ishtirokingizni tasdiqlang</div>
              <h2>Biz bilan bo‘ling</h2>
            </div>
            <div className="rsvp-shell">
              <RsvpForm initialState={initialRsvpState} />
            </div>
          </div>
        </section>

        {/* 6. CLOSING */}
        <section className="closing">
          <div className="flo tl" />
          <div className="flo ctr" />
          <div className="wpetals" ref={cpetalsRef} />
          <div
            className="reveal"
            style={{ position: "relative", zIndex: 3, maxWidth: 600 }}
          >
            <Flourish />
            <div className="eyebrow">Chin qalbdan</div>
            <div className="cbig">Tashakkur</div>
            <div className="cnames">
              <span className="nm">{site.groom}</span>{" "}
              <span className="amp">&amp;</span>{" "}
              <span className="nm">{site.bride}</span>
            </div>
            <div className="cdate">
              <span />
              {`1-AVGUST 2026 · ${site.timeText}`}
              <span />
            </div>
            <p className="thx">
              Bu baxtli kunda biz bilan birga bo&apos;lganingiz uchun samimiy
              minnatdorchilik bildiramiz. Sizning ishtirokingiz — biz uchun eng
              qadrli sovg&apos;a.
            </p>
            <div className="heart">♡</div>
            <Flourish bottom />
            <ContactCta />
          </div>
        </section>
      </div>
    </>
  );
}
