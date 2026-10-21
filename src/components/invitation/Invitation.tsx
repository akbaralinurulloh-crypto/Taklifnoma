import type { CSSProperties, ReactNode } from "react";
import { dateParts, monthGrid, WEEKDAY_SHORT } from "@/lib/format";
import type { PublicInvitation } from "@/lib/types";
import { Countdown } from "../templates/Countdown";
import { MusicControl } from "../templates/MusicControl";
import { MapLink, Photo, delay, initials } from "../templates/parts";
import { Gate } from "./Gate";
import {
  AtlasBand, Bow, Branch, Clouds, Dove, Heart, LineFlora, OGIVE_PATH, Rose, Silk, Sparkle, Star8, TileBand, TornEdge,
} from "./Ornaments";
import { THEMES, type Theme } from "./themes";

type Parts = NonNullable<ReturnType<typeof dateParts>>;

const DEFAULT_TEXT = "Hayotimizdagi eng baxtli kunda biz bilan birga bo‘lishingizni istaymiz. Sizni to‘yimizga taklif qilamiz.";

function Names({ a, b, className = "", size = "text-[54px]" }: { a: string; b: string; className?: string; size?: string }) {
  return (
    <h1 className={`f-script iv-in break-words text-center leading-[1.02] ${size} ${className}`} style={delay(0.1)}>
      {a}
      <span className="block text-[0.5em] opacity-80">&amp;</span>
      {b}
    </h1>
  );
}

function DateLine({ p, className = "" }: { p: Parts | null; className?: string }) {
  if (!p) return null;
  return (
    <p className={`f-display iv-in text-center text-sm tracking-[0.18em] ${className}`} style={delay(0.35)}>
      {p.weekday}, {p.day}-{p.month} {p.year} · {p.time}
    </p>
  );
}

function Monogram({ a, b, className = "" }: { a: string; b: string; className?: string }) {
  return (
    <div className={`f-script flex items-center justify-center rounded-full border text-5xl ${className}`} aria-hidden>
      {initials(a, b)}
    </div>
  );
}

/* ------------------------------ QAHRAMON (hero) ------------------------------ */

function Hero({ data, t, p }: { data: PublicInvitation; t: Theme; p: Parts | null }) {
  const { groomName: a, brideName: b, photoUrl } = data;
  const alt = `${a} va ${b}`;

  switch (t.hero) {
    case "full": {
      const dark = t.vars["--bg"] === "#0c0c0c";
      return (
        <header className="relative flex min-h-[680px] flex-col items-center justify-end overflow-hidden px-6 pb-14 text-center" style={{ background: dark ? "#050505" : "linear-gradient(160deg,#7d1228,#3d0711)" }}>
          {photoUrl ? (
            <Photo url={photoUrl} alt={alt} className={`absolute inset-0 h-full w-full ${dark ? "grayscale" : ""}`} />
          ) : dark ? (
            <>
              <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 45% at 50% 32%,#ffffff2e,transparent 70%)" }} />
              <Sparkle className="iv-pulse absolute left-12 top-24 h-4 w-4" fill="#fff" />
              <Sparkle className="iv-pulse absolute right-14 top-44 h-5 w-5" fill="#fff" />
              <Sparkle className="iv-pulse absolute left-24 top-72 h-3 w-3" fill="#fff" />
              <Dove className="absolute right-20 top-20 h-6 w-9 opacity-50" />
            </>
          ) : (
            <>
              <Rose className="iv-drift absolute -left-10 -top-8 h-48 w-48" />
              <Rose className="absolute -right-12 top-24 h-40 w-40" c1="#5d0f1d" c2="#8a1c2b" c3="#c4485b" />
              <Rose className="iv-drift absolute -bottom-10 -right-6 h-44 w-44" />
              <Dove className="absolute left-10 top-28 h-8 w-12 opacity-80" />
              <Dove className="absolute right-20 top-16 h-6 w-9 opacity-60" />
            </>
          )}
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0000 35%,#000a 100%)" }} />
          <div className="relative text-white">
            <p className="iv-in mb-3 text-[12px] uppercase tracking-[0.5em]">{dark ? "Taklifnoma" : "Nikoh kuni"}</p>
            <Names a={a} b={b} />
            <DateLine p={p} className="mt-5" />
          </div>
        </header>
      );
    }
    case "arch": {
      const olive = t.vars["--bg"] === "#f4f5ef";
      return (
        <header className="relative overflow-hidden px-6 pb-12 pt-10 text-center" style={{ background: olive ? "linear-gradient(170deg,#6a7640,#2b3216 70%)" : "linear-gradient(180deg,#e8d8c4,#f6efe8)" }}>
          {olive ? <Silk className="absolute -top-1 left-0 h-24 w-full opacity-70" stops={["#aeb98a", "#6b7743", "#d3dbb4", "#55612f"]} flip /> : <Sparkle className="absolute right-8 top-10 h-6 w-6" fill="#c4a27a" />}
          <div className="relative mx-auto w-[310px] rounded-t-[155px] rounded-b-[28px] px-6 pb-10 pt-8 shadow-xl" style={{ background: t.vars["--paper"] }}>
            <Bow className="mx-auto h-16 w-24" color={olive ? "#8ea16b" : "#b78d68"} dark={olive ? "#5f7040" : "#6a4331"} />
            {photoUrl ? (
              <Photo url={photoUrl} alt={alt} className="mx-auto mt-3 h-[260px] w-[220px] rounded-t-[110px] rounded-b-2xl" />
            ) : (
              <Monogram a={a} b={b} className="mx-auto mt-3 h-[150px] w-[150px] iv-line iv-accent" />
            )}
            <p className="mt-5 text-[11px] uppercase tracking-[0.35em] iv-muted">Siz to‘yimizga taklif etilgansiz</p>
            <Names a={a} b={b} size="text-[46px]" className="mt-2 iv-accent" />
            <DateLine p={p} className="mt-3 iv-muted" />
          </div>
        </header>
      );
    }
    case "oval":
      return (
        <header className="relative overflow-hidden px-6 pb-14 pt-12 text-center" style={{ background: "linear-gradient(180deg,#cfe1f1,#f1f6fa 60%,#fbf4e8)" }}>
          <Clouds className="iv-drift absolute left-0 top-4 h-24 w-full" />
          <Sparkle className="absolute left-10 top-32 h-5 w-5" />
          <Sparkle className="absolute right-12 top-24 h-4 w-4" />
          <p className="iv-in relative text-[11px] uppercase tracking-[0.45em] iv-muted">Taklifnoma</p>
          {photoUrl ? (
            <Photo url={photoUrl} alt={alt} className="relative mx-auto mt-6 h-[230px] w-[230px] rounded-full ring-8 ring-white/80" />
          ) : (
            <Monogram a={a} b={b} className="relative mx-auto mt-6 h-[170px] w-[170px] bg-white/70 iv-accent iv-line" />
          )}
          <Names a={a} b={b} className="relative mt-6 iv-accent" />
          <DateLine p={p} className="relative mt-4 iv-muted" />
        </header>
      );
    case "polaroid":
      return (
        <header className="relative overflow-hidden px-6 pb-28 pt-16 text-center">
          <Branch className="absolute -left-12 -top-2 h-24 w-40" leaf="#7c8c58" stem="#55663a" />
          <Branch className="absolute -bottom-1 -right-14 h-20 w-32" leaf="#7c8c58" stem="#55663a" flip />
          <p className="iv-in relative text-[11px] uppercase tracking-[0.45em] iv-muted">Bizning to‘yimiz</p>
          <div className="relative mx-auto mt-8 w-[250px] -rotate-3 rounded-sm bg-white p-3 pb-12 shadow-[0_14px_30px_-12px_rgba(0,0,0,.4)]">
            {photoUrl ? (
              <Photo url={photoUrl} alt={alt} className="h-[250px] w-full" />
            ) : (
              <Monogram a={a} b={b} className="h-[250px] w-full rounded-none border-0 bg-[#eef1e6] iv-accent" />
            )}
          </div>
          <Names a={a} b={b} className="relative mt-8 iv-accent" />
          <DateLine p={p} className="relative mt-4 iv-muted" />
        </header>
      );
    case "silk":
      return (
        <header className="relative overflow-hidden px-6 pb-16 pt-16 text-center text-white" style={{ background: "linear-gradient(160deg,#5c4414,#c9a557 40%,#7b5f20 75%,#e8d49a)" }}>
          <Silk className="absolute inset-x-0 top-0 h-40 w-full opacity-60" flip />
          <Silk className="absolute inset-x-0 bottom-0 h-40 w-full opacity-70" />
          <p className="iv-in relative text-[12px] uppercase tracking-[0.5em]">To‘y uchun taklifnoma</p>
          {photoUrl ? (
            <Photo url={photoUrl} alt={alt} className="relative mx-auto mt-8 h-[250px] w-[210px] rounded-[40px] border-[6px] border-white/70" />
          ) : (
            <Monogram a={a} b={b} className="relative mx-auto mt-8 h-[170px] w-[170px] border-white/60 bg-white/10" />
          )}
          <Names a={a} b={b} className="relative mt-8" />
          <DateLine p={p} className="relative mt-4" />
        </header>
      );
    case "plain":
      return (
        <header className="relative min-h-[620px] overflow-hidden px-16 pb-20 pt-36 text-center">
          <LineFlora className="absolute -right-10 -top-4 h-36 w-44" color="#2a2a2a" />
          <LineFlora className="absolute -bottom-4 -left-10 h-40 w-48" color="#2a2a2a" flip />
          {p && (
            <div className="iv-in absolute left-5 top-36 flex flex-col items-center gap-1 border-l-2 pl-3 text-sm leading-tight iv-line" style={delay(0.4)}>
              <span>{p.day}</span>
              <span className="uppercase">{p.month.slice(0, 3)}</span>
              <span>{p.year.slice(2)}</span>
            </div>
          )}
          <p className="iv-in relative text-[12px] uppercase tracking-[0.4em] iv-muted">To‘y uchun taklifnoma</p>
          {photoUrl && <Photo url={photoUrl} alt={alt} className="relative mx-auto mt-6 h-[150px] w-[150px] rounded-full" />}
          <Names a={a} b={b} className="relative mt-10" />
          <DateLine p={p} className="relative mt-5 iv-muted" />
        </header>
      );
    case "tile":
      return (
        <header className="relative overflow-hidden text-center" style={{ background: "linear-gradient(180deg,#0a6a72,#064147)" }}>
          <TileBand className="h-10 w-full" />
          <div className="relative px-6 pb-12 pt-10 text-white">
            <Star8 className="absolute left-1/2 top-4 h-72 w-72 -translate-x-1/2 text-[#d9a441] opacity-25" />
            {photoUrl ? (
              <div className="relative mx-auto h-[280px] w-[200px]" style={{ clipPath: `path('${OGIVE_PATH}')` }}>
                <Photo url={photoUrl} alt={alt} className="h-full w-full" />
              </div>
            ) : (
              <div className="relative mx-auto flex h-[220px] w-[160px] items-center justify-center rounded-t-[80px] border-2 border-[#d9a441]/70">
                <span className="f-script text-5xl text-[#f5eecf]">{initials(a, b)}</span>
              </div>
            )}
            <p className="iv-in relative mt-6 text-[11px] uppercase tracking-[0.4em] text-[#f5eecf]">Nikoh to‘yiga taklif</p>
            <Names a={a} b={b} className="relative mt-2 text-[#f5eecf]" size="text-[50px]" />
            <DateLine p={p} className="relative mt-4 text-[#f5eecf]" />
          </div>
          <TileBand className="h-10 w-full" />
        </header>
      );
    case "atlas":
    default:
      return (
        <header className="relative overflow-hidden text-center" style={{ background: "#fff8e8" }}>
          <AtlasBand className="h-[70px] w-full" />
          <div className="px-6 pb-10 pt-8">
            <p className="iv-in text-[12px] uppercase tracking-[0.4em] iv-muted">Taklifnoma</p>
            {photoUrl ? (
              <div className="mx-auto mt-5 w-[240px] rounded-sm border-[6px] p-1" style={{ borderColor: "#c8281e" }}>
                <Photo url={photoUrl} alt={alt} className="h-[290px] w-full" />
              </div>
            ) : (
              <Monogram a={a} b={b} className="mx-auto mt-5 h-[150px] w-[150px] iv-accent iv-line" />
            )}
            <Names a={a} b={b} className="mt-6 iv-accent" size="text-[50px]" />
            <DateLine p={p} className="mt-4 iv-muted" />
          </div>
          <AtlasBand className="h-[70px] w-full" />
        </header>
      );
  }
}

/* ------------------------------ BO'LIMLAR ------------------------------ */

function Divider({ t }: { t: Theme }) {
  switch (t.hero) {
    case "full":
      return t.vars["--bg"] === "#0c0c0c" ? (
        <div aria-hidden className="mx-auto my-2 flex items-center justify-center gap-3 py-4"><span className="h-px w-16 bg-white/40" /><Sparkle className="h-4 w-4" fill="#fff" /><span className="h-px w-16 bg-white/40" /></div>
      ) : (
        <TornEdge className="-mb-px block h-8 w-full" fill="#fdf8f4" flip />
      );
    case "silk":
    case "arch":
      return <Silk className="block h-14 w-full opacity-70" stops={t.hero === "silk" ? undefined : ["#cdd5b0", "#8f9c62", "#e9ecd6"]} />;
    case "tile":
      return <TileBand className="h-8 w-full" />;
    case "atlas":
      return <AtlasBand className="h-12 w-full" />;
    case "oval":
      return <Clouds className="block h-16 w-full opacity-80" fill="#e4eef7" />;
    case "polaroid":
      return <Branch className="mx-auto block h-16 w-40" leaf="#7c8c58" stem="#55663a" />;
    default:
      return <LineFlora className="mx-auto block h-20 w-24 opacity-70" color="#2a2a2a" />;
  }
}

function Card({ t, children, className = "" }: { t: Theme; children: ReactNode; className?: string }) {
  const shape = t.card === "arch" ? "rounded-t-[160px] rounded-b-3xl" : t.card === "round" ? "rounded-3xl" : "rounded-sm border iv-line";
  return <section className={`iv-paper mx-5 px-6 py-9 text-center shadow-sm ${shape} ${className}`}>{children}</section>;
}

function Title({ children }: { children: ReactNode }) {
  return <h2 className="f-script iv-accent text-[38px] leading-none">{children}</h2>;
}

function Calendar({ iso, selected }: { iso: string | null; selected: "heart" | "dot" }) {
  const g = monthGrid(iso);
  if (!g) return null;
  return (
    <div className="mt-5">
      <p className="f-display text-lg iv-accent">{g.title}, {g.year}</p>
      <div className="mx-auto mt-3 grid max-w-[300px] grid-cols-7 gap-y-1 text-sm" role="grid" aria-label={`${g.title} ${g.year}`}>
        {WEEKDAY_SHORT.map((w) => (
          <span key={w} className="text-[11px] uppercase tracking-wider iv-muted">{w}</span>
        ))}
        {g.cells.map((c, i) => (
          <span key={i} className="relative flex h-9 items-center justify-center">
            {c === g.day && (selected === "heart" ? <Heart className="absolute h-9 w-9 iv-accent" /> : <span className="iv-accent-bg absolute h-8 w-8 rounded-full" />)}
            <span className={`f-body relative ${c === g.day ? "font-bold" : ""}`} style={c === g.day ? { color: "var(--on)" } : undefined}>{c ?? ""}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Body({ data, t, p }: { data: PublicInvitation; t: Theme; p: Parts | null }) {
  const heartThemes = t.hero === "full" || t.hero === "silk" || t.hero === "oval";
  return (
    <div className="space-y-6 pb-10 pt-8">
      {/* Salom va taklif matni */}
      <Card t={t}>
        {t.hero === "arch" && <Bow className="mx-auto -mt-1 mb-3 h-12 w-16" color="#8ea16b" dark="#5f7040" />}
        {data.parents && <p className="iv-in mb-4 text-xs uppercase tracking-[0.25em] iv-muted">{data.parents}</p>}
        <Title>Assalomu alaykum</Title>
        <p className="f-body mt-4 whitespace-pre-line break-words text-[19px] leading-relaxed">{data.extraText ?? DEFAULT_TEXT}</p>
        <MusicControl track={data.music} className="mt-6 iv-muted" />
      </Card>

      {/* Taqvim */}
      {p && (
        <Card t={t}>
          <Title>To‘y kuni</Title>
          <p className="f-display mt-3 text-base iv-muted">{p.weekday}, {p.day}-{p.month} {p.year}-yil, soat {p.time}</p>
          <Calendar iso={data.weddingAt} selected={heartThemes ? "heart" : "dot"} />
        </Card>
      )}

      {/* Sanoq */}
      {data.weddingAt && (
        <Card t={t}>
          <Title>To‘ygacha</Title>
          <div className="mt-5">
            <Countdown
              iso={data.weddingAt}
              boxClass="iv-accent"
              numClass="f-display text-[34px] leading-none"
              labelClass="mt-1 text-[11px] uppercase tracking-[0.2em] iv-muted"
              pastClass="f-body iv-muted"
            />
          </div>
        </Card>
      )}

      {/* Dastur */}
      {data.program.length > 0 && (
        <Card t={t}>
          <Title>To‘y dasturi</Title>
          <ol className="mx-auto mt-6 max-w-[280px] space-y-5 border-l-2 pl-6 text-left iv-line">
            {data.program.map((it, i) => (
              <li key={`${it.time}-${i}`} className="relative">
                <span aria-hidden className="iv-accent-bg absolute -left-[31px] top-1.5 h-3 w-3 rounded-full" />
                <span className="f-display block text-xl iv-accent">{it.time}</span>
                <span className="f-body block break-words text-[18px]">{it.title}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Manzil */}
      <Card t={t}>
        <Title>Manzil</Title>
        <p className="f-display mt-4 break-words text-2xl">{data.venueName}</p>
        <p className="f-body mt-1 break-words text-[18px] iv-muted">{data.venueAddress}</p>
        <MapLink address={data.venueAddress} className="iv-accent-bg mt-5 inline-block rounded-full px-6 py-3 text-sm tracking-wide" />
      </Card>

      {/* Kiyim kodi */}
      {data.dressCode && (
        <Card t={t}>
          <Title>Kiyim kodi</Title>
          <p className="f-body mt-4 whitespace-pre-line break-words text-[18px] leading-relaxed">{data.dressCode}</p>
        </Card>
      )}

      <div className="px-6 pt-4 text-center">
        <p className="f-script text-[34px] iv-accent">Sizni kutamiz!</p>
        <p className="f-display mt-1 break-words text-sm tracking-[0.2em] iv-muted">{data.groomName} &amp; {data.brideName}</p>
      </div>
    </div>
  );
}

/** Taklifnoma: preview, namuna va mehmon sahifasi shu bitta komponentni ishlatadi. `gate` faqat mehmon sahifasida va namunada yoqiladi. */
export function Invitation({ data, gate = false }: { data: PublicInvitation; gate?: boolean }) {
  const t = THEMES[data.design];
  const p = dateParts(data.weddingAt);
  const dateText = p ? `${p.day}.${String(["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"].indexOf(p.month) + 1).padStart(2, "0")}.${p.year}` : null;

  return (
    <Gate
      enabled={gate}
      kind={t.gate}
      groom={data.groomName}
      bride={data.brideName}
      dateText={dateText}
      bg={t.gateBg}
      ink={t.gateInk}
      color={t.gateColor}
      color2={t.gateColor2}
    >
      <article className="iv mx-auto w-full max-w-[420px] overflow-hidden" style={t.vars as unknown as CSSProperties}>
        <Hero data={data} t={t} p={p} />
        <Divider t={t} />
        <Body data={data} t={t} p={p} />
      </article>
    </Gate>
  );
}
