import { createFileRoute } from "@tanstack/react-router";
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Music2, Pause } from "lucide-react";
import { wedding as w } from "@/wedding.config";

const FullInvitation = lazy(() => import("@/components/full-invitation"));
export const Route = createFileRoute("/")({ component: Invitation });

function InvitationCover({
  loading = false,
  onOpen,
}: {
  loading?: boolean;
  onOpen?: () => void;
}) {
  return (
    <main className="invitation-cover" aria-busy={loading}>
      <div className="cover-envelope" aria-hidden="true" />
      <div className="cover-peach-paper" aria-hidden="true" />
      <article className="cover-stationery">
        <div className="cover-frame" aria-hidden="true" />
        <p className="cover-invocation" lang="sa">
          श्री गणेशाय नमः
        </p>
        <p className="eyebrow">THE WEDDING INVITATION</p>
        <p className="cover-intro">Together with our families</p>
        <h1>
          {w.groom.coverName}
          <span>&</span>
          {w.bride.coverName}
        </h1>
        <p className="cover-date">{w.dateLabel}</p>
        <div className="silk-ribbon" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <button className="cover-open" onClick={onOpen} disabled={loading}>
          {loading ? "Opening your invitation…" : "Tap to open our invitation"}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
        {loading && (
          <p className="cover-loading" role="status">
            Unfolding something beautiful…
          </p>
        )}
      </article>
      <p className="cover-footnote">
        WITH LOVE · {w.groom.coverName} & {w.bride.coverName}
      </p>
    </main>
  );
}

class OpeningBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="opening-error">
          <h1>Your invitation is waiting</h1>
          <p>We couldn’t load the invitation. Please reload to try again.</p>
          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Reload invitation
          </button>
        </main>
      );
    return this.props.children;
  }
}

export function Invitation() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState("");
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => {
    audio.current?.pause();
  }, []);

  async function playMusic() {
    if (!audio.current) return;
    try {
      // Call play before any await so the opening tap authorizes playback,
      // even while the invitation's lazy-loaded code is still downloading.
      await audio.current.play();
      setMusicError("");
    } catch {
      setPlaying(false);
      setMusicError("Music could not play. Tap the music button to try again.");
    }
  }

  function openInvitation() {
    if (w.musicUrl && !audio.current) {
      const track = new Audio(w.musicUrl);
      track.loop = true;
      track.onplaying = () => setPlaying(true);
      track.onpause = () => setPlaying(false);
      track.onerror = () => {
        setPlaying(false);
        setMusicError("Music could not play. Tap the music button to try again.");
      };
      audio.current = track;
      void playMusic();
    }
    setOpened(true);
  }

  function toggleMusic() {
    if (audio.current && !audio.current.paused) {
      audio.current.pause();
    } else {
      void playMusic();
    }
  }

  return (
    <>
      {opened ? (
        <OpeningBoundary>
          <Suspense fallback={<InvitationCover loading />}>
            <FullInvitation />
          </Suspense>
        </OpeningBoundary>
      ) : (
        <InvitationCover onOpen={openInvitation} />
      )}
      {opened && w.musicUrl && (
        <>
          <button
            className="music-button"
            aria-label={playing ? "Pause background music" : "Play background music"}
            aria-pressed={playing}
            onClick={toggleMusic}
          >
            {playing ? <Pause size={17} /> : <Music2 size={17} />}
          </button>
          {musicError && <p role="status" className="music-error">{musicError}</p>}
        </>
      )}
    </>
  );
}
