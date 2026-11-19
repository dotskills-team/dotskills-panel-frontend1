import { AI_MAX_MESSAGE_LENGTH } from "../constants/ai.constants";

/** Minimal Web Speech API typings (lib.dom does not ship them consistently). */
export interface SpeechAlternativeLike {
  transcript: string;
}
export interface SpeechResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechAlternativeLike;
}
export interface SpeechResultEventLike {
  results: { length: number; [index: number]: SpeechResultLike };
}
export interface SpeechErrorEventLike {
  error: string;
}
export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechResultEventLike) => void) | null;
  onerror: ((e: SpeechErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export const getSpeechRecognitionCtor = (): SpeechRecognitionCtor | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

export const isSpeechSupported = (): boolean => getSpeechRecognitionCtor() !== null;

/** Rebuilds the whole transcript from every result (avoids duplicated text on Android). */
export const joinTranscript = (event: SpeechResultEventLike): string => {
  let text = "";
  for (let i = 0; i < event.results.length; i++) {
    text += event.results[i][0]?.transcript ?? "";
  }
  return text.trim();
};

/** base + spoken text, single space between, clamped to the message limit. */
export const mergeWithBase = (base: string, spoken: string): string => {
  const head = base.trimEnd();
  const merged = head && spoken ? `${head} ${spoken}` : head || spoken;
  return merged.slice(0, AI_MAX_MESSAGE_LENGTH);
};

export const speechErrorMessage = (code: string): string | null => {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone permission denied. Allow it in your browser settings to use voice input.";
    case "no-speech":
      return "I didn't hear anything. Try again.";
    case "audio-capture":
      return "No microphone was found.";
    case "network":
      return "Can't reach the speech service. Check your connection.";
    case "language-not-supported":
      return "This language isn't supported by your browser's voice input.";
    case "aborted":
      return null;
    default:
      return "Voice input failed. You can keep typing.";
  }
};
