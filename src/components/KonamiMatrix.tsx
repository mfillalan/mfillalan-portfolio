import { useEffect, useState, useRef, useCallback } from 'react';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const SYMBOLS = ['↑','↑','↓','↓','←','→','←','→','B','A'];

const MESSAGES = [
  'Wake up, Neo...',
  'The Matrix has you...',
  'Follow the white rabbit.',
  'Knock, knock, Neo.',
];

const CHAR_SPEED = 55;
const LINE_PAUSE = 700;

type ScatterStyle = { tx: number; ty: number; rot: number };

function playKnock() {
  try {
    const ctx = new AudioContext();
    const knock = (time: number) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        // decaying noise burst — woody knock character
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      // slight low-pass to make it thuddy
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      src.connect(filter);
      filter.connect(ctx.destination);
      src.start(time);
    };
    knock(ctx.currentTime);
    knock(ctx.currentTime + 0.38);
    // close context after sound finishes
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // AudioContext not available — silently skip
  }
}

export default function KonamiMatrix() {
  const [active, setActive] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [failing, setFailing] = useState(false);
  const [scatter, setScatter] = useState<ScatterStyle[]>([]);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Refs so the single keydown listener always sees current values
  const progressRef = useRef(0);
  const failingRef = useRef(false);
  const activeRef = useRef(false);

  const dismiss = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    activeRef.current = false;
    setActive(false);
    setLines([]);
  }, []);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { failingRef.current = failing; }, [failing]);
  useEffect(() => { activeRef.current = active; }, [active]);

  // Single stable keydown listener — refs avoid stale closure issues
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeRef.current) { dismiss(); return; }
      if (failingRef.current) return;

      const prog = progressRef.current;
      if (e.key === KONAMI[prog]) {
        const next = prog + 1;
        if (next === KONAMI.length) {
          progressRef.current = 0;
          setProgress(0);
          setLines([]);
          activeRef.current = true;
          setActive(true);
        } else {
          progressRef.current = next;
          setProgress(next);
        }
      } else if (prog > 0) {
        // Wrong key — scatter the HUD
        failingRef.current = true;
        setFailing(true);
        const styles: ScatterStyle[] = SYMBOLS.map(() => ({
          tx: (Math.random() - 0.5) * 320,
          ty: -(Math.random() * 160 + 60),
          rot: (Math.random() - 0.5) * 720,
        }));
        setScatter(styles);
        const t = setTimeout(() => {
          failingRef.current = false;
          progressRef.current = 0;
          setFailing(false);
          setProgress(0);
          setScatter([]);
        }, 580);
        timersRef.current.push(t);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dismiss]);

  // Typewriter effect when overlay opens
  useEffect(() => {
    if (!active) return;

    let elapsed = 0;
    MESSAGES.forEach((msg, lineIndex) => {
      for (let charIndex = 1; charIndex <= msg.length; charIndex++) {
        const chunk = msg.slice(0, charIndex);
        const t = setTimeout(() => {
          setLines(prev => {
            const next = [...prev];
            next[lineIndex] = chunk;
            return next;
          });
        }, elapsed);
        timersRef.current.push(t);
        elapsed += CHAR_SPEED;
      }
      elapsed += LINE_PAUSE;
    });

    // After typing finishes: wait 2s, play knock-knock, then dismiss
    const knockDelay = elapsed + 2000;
    const knockTimer = setTimeout(() => {
      playKnock();
      const dismissTimer = setTimeout(dismiss, 1400);
      timersRef.current.push(dismissTimer);
    }, knockDelay);
    timersRef.current.push(knockTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [active, dismiss]);

  const lastLineComplete =
    lines.length > 0 && lines[lines.length - 1] === MESSAGES[lines.length - 1];
  const allComplete = lines.length === MESSAGES.length && lastLineComplete;

  return (
    <>
      {/* Progress HUD — only reveal after ↑↑ */}
      {progress >= 2 && (
        <div className="konami-hud">
          {SYMBOLS.map((sym, i) => {
            const done = i < progress;
            const scatterStyle =
              failing && scatter[i]
                ? ({
                    '--tx': `${scatter[i].tx}px`,
                    '--ty': `${scatter[i].ty}px`,
                    '--rot': `${scatter[i].rot}deg`,
                  } as React.CSSProperties)
                : {};
            return (
              <span
                key={i}
                className={[
                  'konami-key',
                  done ? 'konami-key-done' : '',
                  failing ? 'konami-key-scatter' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={scatterStyle}
              >
                {sym}
              </span>
            );
          })}
        </div>
      )}

      {/* Matrix overlay */}
      {active && (
        <div
          className="konami-overlay"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
        >
          <div className="konami-terminal">
            {lines.map((line, i) => {
              const isCurrentLine = i === lines.length - 1 && !allComplete;
              return (
                <p key={i} className="konami-line">
                  {line}
                  {isCurrentLine && <span className="konami-cursor">█</span>}
                </p>
              );
            })}
            {allComplete && <span className="konami-cursor">█</span>}
            <p className="konami-dismiss">[press any key or click to dismiss]</p>
          </div>
        </div>
      )}
    </>
  );
}
