"use client";

import { useState, useCallback, useEffect } from "react";

export function useSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((text: string, lang: string = "en-US") => {
        if (!window.speechSynthesis) {
            console.error("Speech Synthesis not supported in this browser.");
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Map common language names to BCP-47 tags if possible
        // This is a simplified mapping; browser support for specific voices varies.
        const langMap: Record<string, string> = {
            "English": "en-US",
            "Spanish": "es-ES",
            "French": "fr-FR",
            "German": "de-DE",
            "Hindi": "hi-IN",
            "Bengali": "bn-IN",
            "Japanese": "ja-JP",
            "Korean": "ko-KR",
            "Chinese": "zh-CN",
            "Russian": "ru-RU",
            "Arabic": "ar-SA"
        };

        utterance.lang = langMap[lang] || lang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, []);

    const stop = useCallback(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
    }, []);

    // Stop speech when the component unmounts
    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return { speak, stop, isSpeaking };
}
