import { useEffect, useRef, useState } from 'react';

const lines = [
  { prompt: '~', cmd: 'git clone dendrite-mcp && cd dendrite-mcp' },
  { prompt: 'dendrite-mcp', cmd: 'npm run build', output: '✓ compiled in 312ms' },
  { prompt: 'dendrite-mcp', cmd: 'dendrite memory sync --agent copilot', output: '↗ 142 memories indexed · 0 conflicts' },
  { prompt: '~', cmd: 'cd WILD-2.0 && git log --oneline -3', output: 'a5c99e9 feat: complete React migration\nb3d12f1 refactor: replace Web Forms layer\nc8e04a2 chore: drop Oracle dependency' },
  { prompt: 'WILD-2.0', cmd: 'npm run dev', output: '  VITE ready in 271ms  →  http://localhost:5173' },
];

const CHAR_DELAY = 42;
const LINE_PAUSE = 900;
const LOOP_PAUSE = 2800;

export default function TerminalTyper() {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<'typing-cmd' | 'showing-output' | 'done'>('typing-cmd');
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState<{ prompt: string; cmd: string; output?: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [displayed, charIndex]);

  useEffect(() => {
    const current = lines[lineIndex];

    if (phase === 'typing-cmd') {
      if (charIndex < current.cmd.length) {
        const t = setTimeout(() => setCharIndex((c) => c + 1), CHAR_DELAY);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('showing-output'), LINE_PAUSE / 2);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'showing-output') {
      const t = setTimeout(() => {
        setDisplayed((d) => [...d, { prompt: current.prompt, cmd: current.cmd, output: current.output }]);
        const next = lineIndex + 1;
        if (next < lines.length) {
          setLineIndex(next);
          setCharIndex(0);
          setPhase('typing-cmd');
        } else {
          setPhase('done');
        }
      }, current.output ? LINE_PAUSE : 120);
      return () => clearTimeout(t);
    }

    if (phase === 'done') {
      const t = setTimeout(() => {
        setDisplayed([]);
        setLineIndex(0);
        setCharIndex(0);
        setPhase('typing-cmd');
      }, LOOP_PAUSE);
      return () => clearTimeout(t);
    }
  }, [phase, charIndex, lineIndex]);

  const current = lines[lineIndex];

  return (
    <div className="terminal-window" aria-hidden="true">
      <div className="terminal-bar">
        <span className="t-dot t-red" />
        <span className="t-dot t-yellow" />
        <span className="t-dot t-green" />
        <span className="t-title">bash</span>
      </div>
      <div className="terminal-body">
        {displayed.map((line, i) => (
          <div key={i} className="t-line">
            <span className="t-prompt">{line.prompt} $</span>
            <span className="t-cmd">{line.cmd}</span>
            {line.output && <div className="t-output">{line.output}</div>}
          </div>
        ))}
        {phase !== 'done' && (
          <div className="t-line">
            <span className="t-prompt">{current.prompt} $</span>
            <span className="t-cmd">{current.cmd.slice(0, charIndex)}</span>
            <span className="t-cursor" />
          </div>
        )}
        {phase === 'done' && (
          <div className="t-line">
            <span className="t-prompt">~ $</span>
            <span className="t-cursor" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
