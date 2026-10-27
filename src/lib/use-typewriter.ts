"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1400;

/** Types each word out, holds it, deletes it, then moves to the next — returns the text shown right now. */
export function useTypewriter(words: string[]): string {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const word = words.length ? words[index % words.length] : "";

  useEffect(() => {
    if (!word) return;
    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && text === word) delay = HOLD_MS;

    const timer = setTimeout(() => {
      if (!deleting && text === word) return setDeleting(true);
      if (deleting && text === "") {
        setDeleting(false);
        return setIndex((i) => i + 1);
      }
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, word]);

  return text;
}
