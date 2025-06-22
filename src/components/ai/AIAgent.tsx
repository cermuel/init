"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useApps } from "@/hooks/useApp";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { getAIResponse } from "@/api/huggingface-api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toggleApp } = useApps();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Check for system commands first
      const command = processCommand(input);
      if (command) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant" as const, content: command },
        ]);
        setIsLoading(false);
        return;
      }

      // If not a command, get AI response
      const response = await getAIResponse(input);
      setMessages((prev: any) => [
        ...prev,
        { role: "assistant" as const, content: response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const processCommand = (input: string): string | null => {
    const lowerInput = input.toLowerCase();

    // App commands
    if (lowerInput.startsWith("open ")) {
      const appName = input.slice(5).trim();
      toggleApp(appName as any);
      return `Opening ${appName}...`;
    }

    // Theme commands
    if (lowerInput === "toggle theme") {
      setTheme(theme === "dark" ? "light" : "dark");
      return `Switched to ${theme === "dark" ? "light" : "dark"} theme`;
    }

    // Help command
    if (lowerInput === "help") {
      return `Available commands:
- open [app name]: Opens an application
- toggle theme: Switches between light and dark mode
- help: Shows this help message
- clear: Clears the chat

You can also chat with me about anything!`;
    }

    // Clear command
    if (lowerInput === "clear") {
      setMessages([]);
      return "Chat cleared";
    }

    return null;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
        style={{ zIndex: 9999 }}
      >
        <FaRobot size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-50"
            style={{ zIndex: 9999 }}
          >
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <button onClick={() => setIsOpen(false)}>
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 border-t dark:border-gray-700"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message or command..."
                  className="flex-1 p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
