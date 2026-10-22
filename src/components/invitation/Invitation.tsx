import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { dateParts, monthGrid } from "@/lib/format";
import { dict, weekdayShort, type Dict, type Lang } from "@/lib/i18n";
import type { PublicInvitation } from "@/lib/types";
import { Countdown } from "../templates/Countdown";
import { MusicControl } from "../templates/MusicControl";
import { MapLink, Photo, delay, initials } from "../templates/parts";
import { ScrollBar } from "./Extras";
import { Fx } from "./Fx";
import { Gallery } from "./Gallery";
import { Gate } from "./Gate";
import { MusicProvider } from "./MusicProvider";
import { Reveal } from "./Reveal";
import { RsvpBox, WishesBox } from "./GuestSections";
import { Bow, Branch, Clouds, Heart } from "./Ornaments";
import { THEMES, type Theme } from "./themes";

type Parts = NonNullable<ReturnType<typeof dateParts>>;

/** Nafis ajratgich: ikki nozik chiziq va o'rtada romb. */
function Rule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`iv-rule flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-14" />
      <i className="block h-[7px] w-[7px] rotate-45" />
      <span className="h-px w-14" />
    </div>
  );
}

function Names({ a, b, size = "text-[54px]" }: { a: string; b: string; size?: string }) {
  return (
    <h1 className={`f-script iv-names break-words text-center leading-[1.05] ${size}`} style={delay(0.1)}>
      {a}
      <span className="my-1 block text-[0.42em] font-medium not-italic opacity-80">&amp;</span>
      {b}
    </h1>
  );
}

function DateLine({ p, lang }: { p: Parts | null; lang: Lang }) {
  if (!p) return null;
  return (
    <p className="f-display iv-in text-center text-[15px] uppercase tracking-[0.2em] opacity-90" style={delay(0.35)}>
      {p.weekday}, {p.day}{lang === "uz" ? "-" : " "}{p.month} {p.year} · {p.time}
    </p>
  );
}

function Monogram({ a, b }: { a: string; b: string }) {
  return (
    <div className="f-script iv-hair mx-auto flex h-[150px] w-[150px] items-center justify-center rounded-full border text-[56px]" aria-hidden>
      {initials(a, b)}
    </div>
  );
}

/* ------------------------------ BOSH EKRAN ------------------------------ */

function Hero({ data, t, p, lang }: { data: PublicInvitation; t: Theme; p: Parts | null; lang: Lang }) {
  const d = dict(lang);
  const { groomName: a, brideName: b, photoUrl } = data;
  const alt = `${a} va ${b}`;
  const style = (t.hero === "silk" || t.hero === "card" ? { color: t.heroInk } : { background: t.heroBg, color: t.heroInk }) as CSSProperties;
  const label = (text: string) => <p className="iv-in text-[14px] uppercase tracking-[0.32em] opacity-85">{text}</p>;

  switch (t.hero) {
    case "full":
      return (
        <header className="relative flex min-h-[640px] flex-col justify-end overflow-hidden text-center" style={style}>
          {photoUrl ? (
            <>
              <Photo url={photoUrl} alt={alt} className="iv-ken absolute inset-0 h-full w-full" />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgb(0 0 0 / .25) 0%,rgb(0 0 0 / .15) 35%,rgb(11 11 12 / .94) 100%)" }} />
            </>
          ) : (
            <div className="absolute inset-x-0 top-24"><Monogram a={a} b={b} /></div>
          )}
          <span aria-hidden className="iv-hair pointer-events-none absolute inset-4 border" />
          <div className="relative px-6 pb-14 pt-24">
            {label(d.invitation)}
            <div className="mt-4"><Names a={a} b={b} size="text-[58px]" /></div>
            <Rule className="my-5" />
            <DateLine p={p} lang={lang} />
          </div>
        </header>
      );
    case "oval":
      return (
        <header className="relative overflow-hidden px-6 pb-14 pt-14 text-center" style={style}>
          {label(d.ourWedding)}
          <div className="relative mx-auto mt-7 h-[340px] w-[260px]">
            <span aria-hidden className="iv-hair absolute -inset-3 rounded-[50%] border" />
            {photoUrl ? <Photo url={photoUrl} alt={alt} className="h-full w-full rounded-[50%]" /> : <div className="flex h-full w-full items-center justify-center"><Monogram a={a} b={b} /></div>}
          </div>
          <div className="mt-8"><Names a={a} b={b} /></div>
          <Rule className="my-5" />
          <DateLine p={p} lang={lang} />
        </header>
      );
    case "round":
      return (
        <header className="relative overflow-hidden px-6 pb-14 pt-12 text-center" style={style}>
          {t.branch && <Branch className="mx-auto block h-12 w-36" leaf="#8ea16b" stem="#4a5c30" />}
          <div className="mt-2">{label(d.invitation)}</div>
          <div className="relative mx-auto mt-6 h-[240px] w-[240px]">
            <span aria-hidden className="iv-hair absolute -inset-2.5 rounded-full border" />
            {photoUrl ? <Photo url={photoUrl} alt={alt} className="h-full w-full rounded-full" /> : <Monogram a={a} b={b} />}
          </div>
          <div className="mt-8"><Names a={a} b={b} /></div>
          <Rule className="my-5" />
          <DateLine p={p} lang={lang} />
        </header>
      );
    case "frame":
      return (
        <header className="relative overflow-hidden px-6 pb-14 pt-14 text-center" style={style}>
          {label(d.nikohInvite)}
          <div className="relative mx-auto mt-8 w-[230px]">
            <span aria-hidden className="iv-hair absolute inset-0 translate-x-3 translate-y-3 border" />
            {photoUrl ? <Photo url={photoUrl} alt={alt} className="relative h-[290px] w-full" /> : <div className="relative flex h-[290px] items-center justify-center iv-paper"><Monogram a={a} b={b} /></div>}
          </div>
          <div className="mt-10"><Names a={a} b={b} /></div>
          <Rule className="my-5" />
          <DateLine p={p} lang={lang} />
        </header>
      );
    case "sky":
      return (
        <header className="relative overflow-hidden px-6 pb-14 pt-12 text-center" style={style}>
          <Clouds className="pointer-events-none absolute inset-x-0 top-0 h-20 w-full opacity-70" fill="#ffffff" />
          <p className="iv-in relative text-[15px] tracking-[0.12em] opacity-90">{d.nikohDay}</p>
          <p className="iv-in relative mt-1 text-[14px] uppercase tracking-[0.3em] opacity-80" style={delay(0.15)}>{p ? `${p.day}.${p.monthNum}.${p.year}` : ""}</p>
          <div className="relative mx-auto mt-7 w-[250px]">
            <div aria-hidden className="iv-sky-glow absolute -inset-6" />
            <div className="iv-hair relative rounded-t-[125px] border p-1.5">
              {photoUrl ? <Photo url={photoUrl} alt={alt} className="h-[320px] w-full rounded-t-[119px]" /> : <div className="flex h-[260px] items-center justify-center rounded-t-[119px] bg-white/60"><Monogram a={a} b={b} /></div>}
            </div>
          </div>
          <div className="relative mt-8"><Names a={a} b={b} /></div>
          <Rule className="relative my-5" />
          <DateLine p={p} lang={lang} />
        </header>
      );
    case "silk":
      return (
        <header className="iv-silk-gold relative flex min-h-[620px] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center" style={style}>
          {label(d.forYou)}
          <h2 className="f-script iv-in mt-2 text-[40px] font-medium" style={delay(0.15)}>{d.invitation}</h2>
          <div className="relative mx-auto mt-6 h-[210px] w-[210px]">
            <span aria-hidden className="absolute -inset-2.5 rounded-full border border-white/55" />
            {photoUrl ? <Photo url={photoUrl} alt={alt} className="h-full w-full rounded-full" /> : <Monogram a={a} b={b} />}
          </div>
          <div className="mt-8" style={{ textShadow: "0 2px 18px rgb(60 35 5 / .45)" }}><Names a={a} b={b} size="text-[52px]" /></div>
          <Rule className="my-5" />
          <DateLine p={p} lang={lang} />
        </header>
      );
    case "card":
      return (
        <header className={`iv-silk-${t.silk ?? "olive"} relative overflow-hidden px-5 py-12`} style={{ color: t.heroInk }}>
          <div className="iv-oval relative mx-auto w-full max-w-[330px] bg-[var(--paper)] px-8 pb-16 pt-16 text-center shadow-[0_30px_60px_-28px_rgb(0_0_0/.55)]">
            <Bow className="mx-auto h-14 w-20" color={t.vars["--accent2"]} dark={t.vars["--accent"]} />
            <p className="iv-in mt-5 text-[14px] uppercase tracking-[0.2em] iv-muted">{d.invitedYou}</p>
            {photoUrl && <Photo url={photoUrl} alt={alt} className="mx-auto mt-5 h-[150px] w-[120px] rounded-t-[60px]" />}
            <div className="mt-6 iv-accent"><Names a={a} b={b} size="text-[46px]" /></div>
            <Rule className="my-5" />
            <div className="iv-accent"><DateLine p={p} lang={lang} /></div>
          </div>
        </header>
      );
    case "arch":
    default:
      return (
        <header className="relative overflow-hidden px-6 pb-14 pt-14 text-center" style={style}>
          <span aria-hidden className="iv-hair pointer-events-none absolute inset-3 border" />
          {label(d.invitation)}
          <div className="iv-hair mx-auto mt-7 w-[240px] rounded-t-[120px] border p-1.5">
            {photoUrl ? <Photo url={photoUrl} alt={alt} className="h-[310px] w-full rounded-t-[114px]" /> : <div className="flex h-[250px] items-center justify-center"><Monogram a={a} b={b} /></div>}
          </div>
          <div className="mt-8"><Names a={a} b={b} /></div>
          <Rule className="my-5" />
          <DateLine p={p} lang={lang} />
        </header>
      );
  }
}

function Calendar({ iso, lang, heart = false }: { iso: string | null; lang: Lang; heart?: boolean }) {
  const g = monthGrid(iso, lang);
  if (!g) return null;
  return (
    <div className="mt-5">
      <p className="f-display text-[21px] iv-accent">{g.title}, {g.year}</p>
      <div className="mx-auto mt-3 grid max-w-[300px] grid-cols-7 gap-y-1 text-[16px]" role="grid" aria-label={`${g.title} ${g.year}`}>
        {weekdayShort(lang).map((w) => (
          <span key={w} className="text-[12.5px] uppercase tracking-normal iv-muted">{w}</span>
        ))}
        {g.cells.map((c, i) => (
          <span key={i} className="relative flex h-9 items-center justify-center">
            {c === g.day && (heart ? <Heart className="absolute h-9 w-9 iv-accent" /> : <span className="iv-accent-bg absolute h-8 w-8 rounded-full" />)}
            <span className={`f-body relative ${c === g.day ? "font-bold" : ""}`} style={c === g.day ? { color: "var(--on)" } : undefined}>{c ?? ""}</span>
          </span>
        ))}
      </div>
    </div>
  );
}


type Section = { key: string; title: string; pre?: ReactNode; node: ReactNode };

function buildSections(data: PublicInvitation, t: Theme, p: Parts | null, lang: Lang, slug?: string, guest?: string, inlineMusic = true): Section[] {
  const d: Dict = dict(lang);
  const left = t.layout === "journey";
  const out: Section[] = [];

  out.push({
    key: "hello",
    title: d.hello,
    pre: (
      <>
        {data.parents && <p className="iv-in mb-4 text-[14.5px] uppercase tracking-[0.22em] iv-muted">{data.parents}</p>}
        {guest && <p className="f-display mb-3 break-words text-[21px] iv-accent">{d.dear(guest)}</p>}
      </>
    ),
    node: (
      <>
        <p className="f-body mt-4 whitespace-pre-line break-words text-[22px] leading-relaxed">{data.extraText ?? d.defaultText}</p>
        {inlineMusic && <MusicControl track={data.music} lang={lang} className={`mt-6 iv-muted ${left ? "items-start" : ""}`} />}
      </>
    ),
  });

  if (data.gallery.length > 0) {
    out.push({ key: "gallery", title: d.gallery, node: <Gallery urls={data.gallery} alt={`${data.groomName} & ${data.brideName}`} variant="grid" /> });
  }
  if (p) {
    out.push({
      key: "date",
      title: d.weddingDay,
      node: (
        <>
          <p className="f-display mt-3 text-[18px] iv-muted">{d.fullDate(p.weekday, p.day, p.month, p.year, p.time)}</p>
          <Calendar iso={data.weddingAt} lang={lang} heart={t.heart} />
        </>
      ),
    });
  }
  if (data.weddingAt) {
    out.push({
      key: "count",
      title: d.untilWedding,
      node: (
        <div className="mt-5">
          <Countdown
            iso={data.weddingAt}
            boxClass="iv-accent"
            numClass="f-display text-[38px] leading-none"
            labelClass="mt-1 text-[14px] uppercase tracking-[0.2em] iv-muted"
            pastClass="f-body iv-muted"
            labels={d.units}
            pastText={d.started}
            ariaLabel={d.ariaTimer}
          />
        </div>
      ),
    });
  }
  if (data.program.length > 0) {
    out.push({
      key: "program",
      title: d.program,
      node: (
        <ol className={`mt-6 max-w-[280px] space-y-5 border-l pl-6 text-left iv-hair ${left ? "" : "mx-auto"}`}>
          {data.program.map((it, i) => (
            <li key={`${it.time}-${i}`} className="relative">
              <span aria-hidden className="iv-accent-bg absolute -left-[28px] top-2 h-2.5 w-2.5 rotate-45" />
              <span className="f-display block text-[24px] iv-accent">{it.time}</span>
              <span className="f-body block break-words text-[21px]">{it.title}</span>
            </li>
          ))}
        </ol>
      ),
    });
  }
  out.push({
    key: "place",
    title: d.address,
    node: (
      <>
        <p className="f-display mt-4 break-words text-[28px]">{data.venueName}</p>
        <p className="f-body mt-1 break-words text-[21px] iv-muted">{data.venueAddress}</p>
        <MapLink address={data.venueAddress} label={d.map} className="iv-accent-bg mt-5 inline-block px-7 py-3 text-[15px] uppercase tracking-[0.12em]" />
      </>
    ),
  });
  if (data.dressCode) {
    out.push({ key: "dress", title: d.dress, node: <p className="f-body mt-4 whitespace-pre-line break-words text-[21px] leading-relaxed">{data.dressCode}</p> });
  }
  if (slug) {
    out.push({ key: "rsvp", title: d.rsvp.title, node: <RsvpBox slug={slug} lang={lang} initialName={guest ?? ""} /> });
    out.push({ key: "wishes", title: d.wishesTitle, node: <WishesBox slug={slug} lang={lang} initialName={guest ?? ""} /> });
  }
  return out;
}

/** Uch skelet: "rule" (chiziq bilan ajratilgan), "panels" (ramkali panellar), "journey" (chap tekislangan yo'l). */
function Body({ data, t, p, lang, slug, guest, inlineMusic, motion }: { data: PublicInvitation; t: Theme; p: Parts | null; lang: Lang; slug?: string; guest?: string; inlineMusic: boolean; motion: boolean }) {
  const d: Dict = dict(lang);
  const sections = buildSections(data, t, p, lang, slug, guest, inlineMusic);
  const closing = (
    <div className="px-6 pt-6 text-center">
      <p className="f-script text-[38px] iv-accent">{d.waitYou}</p>
      <p className="f-display mt-1 break-words text-[15px] uppercase tracking-[0.2em] iv-muted">{data.groomName} &amp; {data.brideName}</p>
    </div>
  );

  if (t.layout === "journey") {
    return (
      <div className="relative pb-12 pt-4">
        <div className="iv-hair ml-9 border-l">
          {sections.map((s, i) => (
            <Reveal as="section" kind="left" enabled={motion} key={s.key} className="relative py-9 pl-8 pr-7 text-left">
              <span aria-hidden className="iv-accent-bg absolute -left-[6px] top-[3.1rem] h-[11px] w-[11px] rotate-45" />
              <p className="f-display text-[14px] tracking-[0.3em] iv-muted">{String(i + 1).padStart(2, "0")}</p>
              {s.pre && <div className="mt-3">{s.pre}</div>}
              <h2 className="iv-ttl iv-accent mt-1">{s.title}</h2>
              {s.node}
            </Reveal>
          ))}
        </div>
        <div className="pt-8">{closing}</div>
      </div>
    );
  }

  const silkBg = t.silk ? `iv-silk-${t.silk}` : "";
  const cardShape = t.round ? "rounded-[44px]" : "iv-hair border";

  if (t.layout === "panels") {
    return (
      <div className={`relative space-y-6 pb-12 pt-8 ${silkBg}`}>
        {sections.map((s) => (
          <Reveal key={s.key} kind="up" enabled={motion}>
            <section className={`iv-paper iv-frame mx-5 px-6 py-10 text-center ${cardShape}`}>
              {s.pre}
              <h2 className="iv-ttl iv-accent">{s.title}</h2>
              {s.node}
            </section>
          </Reveal>
        ))}
        {closing}
      </div>
    );
  }

  return (
    <div className={`relative pb-12 pt-6`}>
      {sections.map((s, i) => (
        <Reveal as="section" key={s.key} kind="up" enabled={motion} className="px-7 py-8 text-center">
          {i > 0 && <Rule className="mb-9" />}
          {s.pre}
          <h2 className="iv-ttl iv-accent">{s.title}</h2>
          {s.node}
        </Reveal>
      ))}
      <Rule className="mb-6 mt-4" />
      {closing}
    </div>
  );
}

/** Taklifnoma: preview, namuna va mehmon sahifasi shu bitta komponentni ishlatadi. `gate` faqat mehmon sahifasida va namunada yoqiladi. */
export function Invitation({ data, gate = false, lang = "uz", slug, guest, langHref, motion = true }: { data: PublicInvitation; gate?: boolean; lang?: Lang; slug?: string; guest?: string; langHref?: string; motion?: boolean }) {
  const t = THEMES[data.design];
  const p = dateParts(data.weddingAt, lang);
  const dateText = p ? `${p.day}.${p.monthNum}.${p.year}` : null;

  return (
    <MusicProvider track={data.music} lang={lang} bar={gate}>
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
        lang={lang}
      >
        <article className="iv relative mx-auto w-full max-w-[420px] overflow-hidden" style={t.vars as unknown as CSSProperties} lang={lang} data-dark={!!t.dark}>
          {motion && t.fx !== "none" && <Fx kind={t.fx} colors={t.fxColors} density={t.fxDensity} />}
          {motion && gate && <ScrollBar />}
          {langHref && (
            <Link href={langHref} prefetch={false} className="absolute right-3 top-3 z-20 bg-black/45 px-3 py-1 text-[14.5px] text-white backdrop-blur" hrefLang={lang === "uz" ? "ru" : "uz"}>
              {dict(lang).switchTo}
            </Link>
          )}
          <Hero data={data} t={t} p={p} lang={lang} />
          <Body data={data} t={t} p={p} lang={lang} slug={slug} guest={guest} inlineMusic={!gate} motion={motion} />
        </article>
      </Gate>
    </MusicProvider>
  );
}
