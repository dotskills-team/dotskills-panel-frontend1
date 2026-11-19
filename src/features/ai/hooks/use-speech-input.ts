"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getSpeechRecognitionCtor,
  isSpeechSupported,
  joinTranscript,
  mergeWithBase,
  speechErrorMessage,
  type SpeechRecognitionLike,
} from "../utils/speech";

interface Options {
  lang: string;
  onChange: (text: string) => void;
  onError: (message: string) => void;
}

const noopSubscribe = () => () => {};

/** Browser speech-to-text. Nothing is recorded or sent to our servers. */
export function useSpeechInput({ lang, onChange, onError }: Options) {
  const supported = useSyncExternalStore(noopSubscribe, isSpeechSupported, () => false);
  const [listening, setListening] = useState(false);

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const handlers = useRef({ onChange, onError });

  useEffect(() => {
    handlers.current = { onChange, onError };
  });

  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  /** `base` is whatever is already typed; spoken text is appended to it. */
  const start = useCallback(
    (base: string) => {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor || recRef.current) return;

      const rec = new Ctor();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (e) => handlers.current.onChange(mergeWithBase(base, joinTranscript(e)));
      rec.onerror = (e) => {
        const message = speechErrorMessage(e.error);
        if (message) handlers.current.onError(message);
      };
      rec.onend = () => {
        recRef.current = null;
        setListening(false);
      };

      recRef.current = rec;
      try {
        rec.start();
        setListening(true);
      } catch {
        recRef.current = null;
        handlers.current.onError("Voice input could not start. You can keep typing.");
      }
    },
    [lang],
  );

  // Stop on unmount
  useEffect(() => () => recRef.current?.abort(), []);

  return { supported, listening, start, stop };
}
