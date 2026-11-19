import type { ReactNode } from "react";

/**
 * Tiny, safe renderer for assistant replies: paragraphs, "-"/"*" bullets, "1." lists and **bold**.
 * It only creates React elements from plain text, so model output can never inject HTML.
 */

const renderInline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );

const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

export function AiMarkdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  let numbered: string[] = [];
  let key = 0;

  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={key++} className="list-disc space-y-1 pl-5">
          {bullets.map((b, i) => (
            <li key={i}>{renderInline(b)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
    if (numbered.length) {
      blocks.push(
        <ol key={key++} className="list-decimal space-y-1 pl-5">
          {numbered.map((b, i) => (
            <li key={i}>{renderInline(b)}</li>
          ))}
        </ol>,
      );
      numbered = [];
    }
  };

  for (const line of text.split("\n")) {
    const bullet = line.match(BULLET);
    const num = line.match(NUMBERED);
    if (bullet) {
      if (numbered.length) flush();
      bullets.push(bullet[1]);
    } else if (num) {
      if (bullets.length) flush();
      numbered.push(num[1]);
    } else {
      flush();
      if (line.trim()) blocks.push(<p key={key++}>{renderInline(line)}</p>);
    }
  }
  flush();

  return <div className="space-y-2 break-words">{blocks}</div>;
}
