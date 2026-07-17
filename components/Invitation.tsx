"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/seo";

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

export default function Invitation() {
  const [opened, setOpened] = useState(false);
  const [time, setTime] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const wpetalsRef = useRef<HTMLDivElement>(null);
  const cpetalsRef = useRef<HTMLDivElement>(null);

  // Qulf holati — <body> classlarini boshqaradi.
  useEffect(() => {
    document.body.classList.toggle("opened", opened);
    document.body.classList.toggle("locked", !opened);
  }, [opened]);

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

      <div id="intro">
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
            onClick={() => setOpened(true)}
            aria-label="Taklifnomani ochish"
          >
            🔒
          </button>
          <div className="hint">Qulfni bosib, taklifnomani oching</div>
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
              Sizni nikoh to&apos;yimizga
              <br />
              taklif etamiz
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
              Orzu To&apos;yxonasi
              <br />
              Farg&apos;ona, Bog&apos;dod tumani
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
            <div className="divider" />
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
            <div className="vname">Orzu To&apos;yxonasi</div>
            <div className="vsub">
              Farg&apos;ona viloyati, Bog&apos;dod tumani
              <br />
              II Bog&apos;dod MFY
            </div>
            <div className="vtime">
              <span />
              {`1-AVGUST · SOAT ${site.timeText} DAN`}
              <span />
            </div>
            <div className="map">
              <iframe
                src="https://www.google.com/maps?q=Bog'dod+tumani,+Farg'ona,+Uzbekistan&output=embed"
                loading="lazy"
                title="Orzu To'yxonasi joylashuvi"
              />
            </div>
            <div className="btns">
              <a
                className="btn solid"
                href="https://maps.google.com/?q=Bog'dod+tumani+Farg'ona"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yo&apos;l ko&apos;rsatish
              </a>
              <a
                className="btn"
                href="https://yandex.uz/maps/?text=Bog'dod+tumani+Farg'ona"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yandex xarita
              </a>
            </div>
          </div>
        </section>

        {/* 5. CLOSING */}
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
          </div>
        </section>
      </div>
    </>
  );
}
