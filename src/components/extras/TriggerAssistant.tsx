"use client";

import { getOpenAIResponse } from "@/api/openai+api";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import OpenAI from "openai";

const VoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [micPermission, setMicPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // const handleSubmit = async () => {
    //   const aiResponse = await getOpenAIResponse("Hello mate");
    //   console.log({ h: aiResponse.choices[0].text });
    // };
    // handleSubmit();
    // const openapi = async () => {
    //   const client = new OpenAI({
    //     apiKey:
    //       "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",
    //     dangerouslyAllowBrowser: true,
    //   });
    //   const response = await client.responses.create({
    //     model: "gpt-4.1",
    //     input: "Write a one-sentence bedtime story about a unicorn.",
    //   });
    //   console.log(response.output_text);
    // };
    // openapi();
  }, []);

  useEffect(() => {
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((res) => {
        setMicPermission(res.state as any);
        res.onchange = () => {
          setMicPermission(res.state as any);
        };
      })
      .catch(() => {
        // Some browsers (e.g. Safari) don't support Permissions API
        console.warn("Permissions API not available");
      });
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    const triggerPhrases = [
      "hey init",
      "ay init",
      "hey in it",
      "ay in it",
      "hey enit",
      "hay init",
      "hey innit",
      "hey and it",
      "hey you need",
      "pay init",
    ];

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .trim();

    const speak = (text: string) => {
      const synth = window.speechSynthesis;

      const say = () => {
        const voices = synth.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              /female/i.test(v.name + v.voiceURI) && v.lang.startsWith("en")
          ) ||
          voices.find((v) => v.name.includes("Martha")) ||
          voices.find((v) => v.lang.startsWith("en"));

        const utter = new SpeechSynthesisUtterance(text);
        if (preferredVoice) {
          utter.voice = preferredVoice;
        }

        utter.onend = () => {
          // 👇 Restart recognition after speaking
          try {
            recognitionRef.current?.start();
          } catch (err) {
            console.warn("Recognition restart failed:", err);
          }
        };

        // Stop recognition before speaking to avoid conflict
        recognitionRef.current?.stop();
        synth.speak(utter);
      };

      if (synth.getVoices().length > 0) {
        say();
      } else {
        synth.onvoiceschanged = () => say();
      }
    };

    recognition.onresult = (event: {
      results: SpeechRecognitionResultList;
    }) => {
      const transcriptRaw =
        event.results[event.results.length - 1][0].transcript;
      const transcript = normalize(transcriptRaw);
      console.log("Heard:", transcript);

      const isTriggered = triggerPhrases.some((phrase) =>
        transcript.includes(phrase)
      );

      if (isTriggered) {
        console.log("Init activated!");
        speak("Hi, I'm Init. What can I do for you?");
      } else {
        console.log("Unrecognized command.");
        speak("I didn't quite catch that. Could you repeat that, please?");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      if (event.error === "not-allowed") {
        setMicPermission("denied");
        recognition.stop();
      }
    };

    if (isActive && micPermission === "granted") {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Recognition start failed:", err);
      }
    }

    return () => {
      recognition.stop();
    };
  }, [isActive, micPermission]);

  const handleClick = () => {
    if (micPermission === "denied") {
      alert(
        "Microphone access denied. Please enable it in your browser settings."
      );
    } else {
      setIsActive(true);
    }
  };

  return (
    <>
      {!isActive && (
        <button
          onClick={handleClick}
          //   style={{
          //     position: "fixed",
          //     bottom: 20,
          //     right: 20,
          //     padding: 12,
          //     background: micPermission === "denied" ? "gray" : "#0070f3",
          //     borderRadius: "50%",
          //     border: "none",
          //     cursor: micPermission === "denied" ? "not-allowed" : "pointer",
          //     color: "white",
          //     fontSize: 24,
          //   }}
          title={
            micPermission === "denied"
              ? "Microphone access denied"
              : "Activate voice assistant"
          }
        >
          <FaMicrophone />
        </button>
      )}
    </>
  );
};

export default VoiceAssistant;
