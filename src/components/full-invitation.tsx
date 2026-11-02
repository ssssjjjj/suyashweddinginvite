import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  Heart,
  Flower2,
  MapPin,
  Menu,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { wedding as w } from "@/wedding.config";

const events = w.events.filter((e) => e.enabled);
const fmt = (d: string, options: Intl.DateTimeFormatOptions) =>
  new Date(d).toLocaleDateString("en-GB", {
    ...options,
    timeZone: "Asia/Kolkata",
  });
function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />✧<span />
    </div>
  );
}
function GaneshIdol() {
  return (
    <svg
      className="ganesh-idol"
      viewBox="0 0 120 120"
      role="img"
      aria-label="Lord Ganesh idol"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M38 29 46 15h28l8 14M43 22h34M48 15 60 6l12 9" />
      <path
        d="M40 36C20 20 13 44 24 60c4 6 10 8 17 5M80 36c20-16 27 8 16 24-4 6-10 8-17 5"
        fill="currentColor"
        fillOpacity=".08"
      />
      <path d="M60 29c-20 0-26 16-20 31 3 8 10 12 13 16 4 6-3 12 0 20 4 11 22 9 23-1 1-7-7-9-10-4M80 60c6-15 0-31-20-31" />
      <path d="M47 47h5m16 0h5M60 36v8M43 60l5 8 3-7m20 0 3 7 5-8M41 73c-15 1-22 19-14 26 6 5 15 3 21-1M79 73c15 1 22 19 14 26-5 4-10 4-16 2M34 81l8 8m44-8-8 8" />
      <path
        d="M22 105h76l-5 8H27zM36 105c-2-8 6-14 12-12m24-19c7 4 10 10 9 17"
        fill="currentColor"
        fillOpacity=".12"
      />
    </svg>
  );
}
function RoyalArch() {
  return (
    <svg
      className="royal-arch"
      viewBox="0 0 700 800"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path d="M25 785V260Q25 195 100 195Q95 125 180 130Q195 65 275 85Q315 65 350 20Q385 65 425 85Q505 65 520 130Q605 125 600 195Q675 195 675 260V785" />
      <path d="M40 785V260Q40 210 118 210Q110 143 194 146Q205 85 279 102Q322 82 350 43Q378 82 421 102Q495 85 506 146Q590 143 582 210Q660 210 660 260V785" />
      <path d="M350 20V0M337 12h26M25 740h650M25 752h650" />
    </svg>
  );
}
function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      {title && <h2>{title}</h2>}
      <Ornament />
    </div>
  );
}
export default function FullInvitation() {
  const heading = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  const [revealed, setRevealed] = useState(false);
  const [menu, setMenu] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const remaining =
    now === null ? null : Math.max(0, new Date(w.date).getTime() - now);
  const countdown =
    remaining === null
      ? ["—", "—", "—", "—"]
      : [
          Math.floor(remaining / 86400000),
          Math.floor(remaining / 3600000) % 24,
          Math.floor(remaining / 60000) % 60,
          Math.floor(remaining / 1000) % 60,
        ].map((n) => String(n).padStart(2, "0"));
  function calendar() {
    const stamp = (d: string) =>
      new Date(d)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const escape = (s: string) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    const data = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${stamp(w.date)}@wedding-invitation`,
      `DTSTAMP:${stamp(new Date().toISOString())}`,
      `DTSTART:${stamp(w.date)}`,
      `DTEND:${stamp(w.endDate)}`,
      `SUMMARY:${escape(`${w.groom.name} & ${w.bride.name}'s Wedding`)}`,
      `LOCATION:${escape(w.venue + ", " + w.address + ", " + w.city)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([data], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "our-wedding.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const nav = [
    ["The Invitation", "invitation"],
    ["Our Story", "story"],
    ["Celebrations", "celebrations"],
  ].filter(([, id]) => id !== "story" || w.story.enabled);
  return (
    <div className="invitation-site">
      <header className="site-header">
        <a className="monogram" href="#home" aria-label="Back to invitation">
          {w.groom.name[0]}
          <span>&</span>
          {w.bride.name[0]}
          <i>
            {fmt(w.date, {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).replaceAll("/", " · ")}
          </i>
        </a>
        <nav aria-label="Main navigation" className={menu ? "nav-open" : ""}>
          {nav.map(([label, id]) => (
            <a href={`#${id}`} key={id} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
          <a href="#rsvp" className="nav-rsvp" onClick={() => setMenu(false)}>
            Kindly RSVP <ArrowRight size={14} />
          </a>
        </nav>
        <button
          className="menu-toggle"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <section
          id="home"
          className="hero is-open"
          style={{
            backgroundImage: `url('${w.heroImage}')`,
          }}
        >
          <div className="hero-border" aria-hidden="true" />
          <RoyalArch />
          <div className="hero-floral hero-floral-left" aria-hidden="true" />
          <div className="hero-floral hero-floral-right" aria-hidden="true" />
          <div className="hero-content">
            <div className="ganesh">
              <GaneshIdol />
              <span lang="sa">श्री गणेशाय नमः</span>
            </div>
            <p className="eyebrow">TOGETHER WITH OUR FAMILIES</p>
            <h1 ref={heading} tabIndex={-1}>
              <span className="hero-person">
                <small className="honorific">{w.groom.honorific}</small>
                <span className="person-name">{w.groom.invitationName}</span>
              </span>
              <span className="hero-ampersand">&</span>
              <span className="hero-person">
                <small className="honorific">{w.bride.honorific}</small>
                <span className="person-name">{w.bride.invitationName}</span>
              </span>
            </h1>
            <Ornament />
            <p className="hero-date">{w.dateLabel}</p>
            <a className="primary-button" href="#invitation">
              View invitation <ArrowDown size={16} />
            </a>
            <p className="hero-footnote">
              A CELEBRATION OF LOVE, FAMILY & NEW BEGINNINGS
            </p>
          </div>
          <a
            href="#invitation"
            className="scroll-hint"
            aria-label="Scroll to invitation"
          >
            <span>SCROLL TO DISCOVER</span>
            <ArrowDown size={16} />
          </a>
        </section>
        <div className="intro-strip">
          <span>WITH LOVE IN OUR HEARTS</span>
          <span className="little-flower">✧</span>
          <span>AND YOU BY OUR SIDE</span>
          <span className="little-flower">✧</span>
          <span>OUR FOREVER BEGINS</span>
        </div>
        <section id="invitation" className="invitation-section section-pad">
          <div className="invitation-copy">
            <SectionHeading eyebrow="YOU ARE CORDIALLY INVITED" />
            <p>{w.invitation}</p>
            <p className="script-line">
              Come for the vows. Stay for the memories.
            </p>
            <p className="blessing">{w.blessing}</p>
          </div>
          <div className="date-card">
            <span className="corner top-left" />
            <span className="corner bottom-right" />
            <p className="eyebrow">A DATE WRITTEN IN THE STARS</p>
            {!revealed ? (
              <>
                <div className="date-flower" aria-hidden="true">
                  ✺
                </div>
                <h3>Something beautiful awaits.</h3>
                <button
                  className="text-button"
                  onClick={() => setRevealed(true)}
                >
                  Tap to reveal our date <Sparkles size={15} />
                </button>
              </>
            ) : (
              <div className="date-reveal">
                <p className="date-month">{fmt(w.date, { month: "long" })}</p>
                <strong>{fmt(w.date, { day: "numeric" })}</strong>
                <p className="date-year">{fmt(w.date, { year: "numeric" })}</p>
                <p>{fmt(w.date, { weekday: "long" })}</p>
              </div>
            )}
            <div className="countdown" aria-label="Countdown to the wedding">
              {countdown.map((v, i) => (
                <div key={i}>
                  <b>{v}</b>
                  <small>{["DAYS", "HOURS", "MINS", "SECS"][i]}</small>
                </div>
              ))}
            </div>
            {remaining === 0 && (
              <p className="wedding-day">Our forever has begun.</p>
            )}
            <button className="text-button" onClick={calendar}>
              <CalendarDays size={15} /> Add to calendar
            </button>
          </div>
        </section>
        <section className="families section-pad">
          <SectionHeading
            eyebrow="TWO HEARTS, TWO FAMILIES"
            title="Made for each other"
          />
          <div className="couple-grid">
            {[w.groom, w.bride].map((person, i) => (
              <div className="person" key={person.name}>
                <span className="eyebrow">
                  {i === 0 ? "THE GROOM" : "THE BRIDE"}
                </span>
                <h3>
                  <small className="honorific">{person.honorific}</small>
                  {person.fullName}
                </h3>
                <span className="parent-label">
                  {i === 0 ? "Beloved son of" : "Beloved daughter of"}
                </span>
                <p className="parents">{person.parents}</p>
                <span className="parent-label">With blessings from</span>
                <p className="parents">{person.grandparents}</p>
              </div>
            ))}
            <Heart className="couple-heart" size={28} strokeWidth={1} />
          </div>
        </section>
        {w.story.enabled && (
          <section id="story" className="story-section section-pad">
            <span className="story-mark" aria-hidden="true">
              “
            </span>
            <p className="eyebrow">OUR LITTLE LOVE STORY</p>
            <h2>{w.story.heading}</h2>
            <p>{w.story.text}</p>
            <Ornament />
          </section>
        )}
        <section id="celebrations" className="celebrations section-pad">
          <SectionHeading
            eyebrow="OUR CELEBRATIONS. A LIFETIME OF MEMORIES."
            title="Let the festivities begin"
          />
          <div className="event-grid">
            {events.map((event, i) => (
              <article
                className={`event-card event-${event.id}`}
                key={event.id}
              >
                <span className="event-number" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="event-art"
                  style={{ color: event.color }}
                  aria-hidden="true"
                >
                  {event.id === "haldi" ? (
                    <Flower2 className="haldi-flower" strokeWidth={1.2} />
                  ) : (
                    <span>{["☀", "❧", "♫", "❦", "✧"][i % 5]}</span>
                  )}
                </div>
                <p className="eyebrow">
                  {fmt(event.date, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3>{event.name}</h3>
                <p className="event-subtitle">{event.subtitle}</p>
                <div className="event-details">
                  <span>
                    <CalendarDays size={14} />
                    {event.time} IST
                  </span>
                  <span>
                    <MapPin size={14} />
                    {event.venue}
                  </span>
                </div>
                <p className="dress-code">{event.dressCode}</p>
              </article>
            ))}
          </div>
          <p className="venue-note">
            <MapPin size={15} />
            <span>
              All celebrations at {w.venue}
              <br />
              {w.address}
              <br />
              <a
                href={w.maps}
                target="_blank"
                rel="noreferrer"
                className="text-button"
              >
                View venue on Google Maps <ArrowRight size={14} />
              </a>
            </span>
          </p>
        </section>
        <section id="rsvp" className="rsvp-section section-pad">
          <div className="rsvp-intro">
            <p className="eyebrow">THE CELEBRATION NEEDS YOU</p>
            <h2>
              Save a little space
              <br />
              for our big day.
            </h2>
            <Ornament />
            <p>
              Our happiness is a little more complete with you in it. Let us
              know if you can join us.
            </p>
            <p className="rsvp-deadline">{w.rsvpPrompt}</p>
            <span className="script-line">
              We can’t wait to celebrate with you.
            </span>
          </div>
          <Rsvp />
        </section>
        <footer className="closing-page" aria-labelledby="closing-blessing">
          <div className="closing-card">
            <Flower2
              className="closing-flower"
              size={36}
              strokeWidth={1}
              aria-hidden="true"
            />
            <h2 id="closing-blessing">{w.closing.blessing}</h2>
            <Ornament />
            <p className="closing-signoff">{w.closing.signoff}</p>
            <div className="closing-hosts">
              {w.closing.hosts.map((host) => (
                <p key={host}>{host}</p>
              ))}
            </div>
            <p className="closing-family">{w.closing.family}</p>
            <button
              type="button"
              className="closing-share"
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(`Join us in celebrating ${w.groom.name} & ${w.bride.name}'s wedding! ${window.location.origin}`)}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <Share2 size={17} aria-hidden="true" /> Share the Invitation
            </button>
          </div>
        </footer>
      </main>

    </div>
  );
}
export function Rsvp() {
  const [attendance, setAttendance] = useState("accept");
  const [selected, setSelected] = useState<string[]>(events.map((e) => e.id));
  const [status, setStatus] = useState<"idle" | "complete">("idle");
  const [error, setError] = useState("");
  const [guest, setGuest] = useState("");
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (attendance !== "decline" && selected.length === 0) {
      setError("Please choose at least one celebration.");
      return;
    }
    setError("");
    setGuest(name);
    setStatus("complete");
  }
  if (status === "complete")
    return (
      <div className="rsvp-form confirmation" role="status">
        <span className="success-seal">
          <Check size={30} />
        </span>
        <p className="eyebrow">THANK YOU FOR YOUR WISHES</p>
        <h3>Thank you, {guest}.</h3>
        <p>
          {attendance === "decline"
            ? "You’ll be with us in spirit. Thank you for your love and blessings."
            : attendance === "maybe"
              ? "We hope you can be part of our celebration."
              : "We look forward to celebrating with you."}
        </p>
        <p>{w.rsvpLocalNotice}</p>
        <Ornament />
        <p className="script-line">
          With love, {w.groom.name} & {w.bride.name}
        </p>
      </div>
    );
  return (
    <form className="rsvp-form" onSubmit={submit}>
      <fieldset>
        <legend>Will you celebrate with us?</legend>
        <div className="attendance-options">
          {[
            ["accept", "Joyfully accept"],
            ["maybe", "Maybe"],
            ["decline", "Regretfully decline"],
          ].map(([value, label]) => (
            <label
              key={value}
              className={attendance === value ? "selected" : ""}
            >
              <input
                type="radio"
                name="attendance"
                value={value}
                checked={attendance === value}
                onChange={() => setAttendance(value)}
              />
              {label}
            </label>
          ))}
        </div>
        <div className="form-row">
          <label>
            Your full name
            <input
              name="name"
              required
              maxLength={100}
              placeholder="As we know and love you"
              autoComplete="name"
            />
          </label>
          {attendance !== "decline" && (
            <label>
              Number of guests
              <select name="attendees" defaultValue="1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        {attendance !== "decline" && (
          <fieldset className="ceremony-picker">
            <legend>Which celebrations can we count you in for?</legend>
            <div>
              {events.map((event) => (
                <label key={event.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(event.id)}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, event.id]
                          : selected.filter((id) => id !== event.id),
                      )
                    }
                  />
                  {event.name}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <label>
          A little love for the couple{" "}
          <span className="optional">(optional)</span>
          <textarea
            name="message"
            maxLength={1000}
            placeholder="Your wishes mean the world to us…"
            rows={3}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="primary-button"
          type="submit"
        >
          Complete response
          <Heart size={15} />
        </button>
        <p className="form-privacy">
          {w.rsvpLocalNotice}
        </p>
      </fieldset>
    </form>
  );
}
