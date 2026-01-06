import React, { useState, useRef, useEffect } from "react";
import { getMentorResponse } from "../api/apiService";
import { motion } from 'framer-motion';

interface Message {
  role: string;
  content: string;
}

interface MentorBotProps {
  closeBot: () => void;
}

export const MentorBot: React.FC<MentorBotProps> = ({ closeBot }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hello! I’m your AI Mentor. Ask me anything about your career path!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.filter(m => m.role !== 'system'); // Keep conversation context
      const { data: assistantMessage } = await getMentorResponse(input, history);

      if (assistantMessage?.content) {
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "I received an empty response. Please try rephrasing your question." }]);
      }
    } catch (error) {
      console.error("MentorBot Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="chat-window"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <div className="chat-header">
        <span>AI Mentor Bot</span>
        <button onClick={closeBot}>&times;</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`chat-message ${msg.role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {msg.content}
          </motion.div>
        ))}
        {isLoading && <div className="chat-message assistant">...</div>}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="chat-input"
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-button" disabled={isLoading}>
          Send
        </button>
      </form>
    </motion.div>
  );
};
