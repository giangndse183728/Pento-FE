'use client';

import { FormEvent, useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import { gsap } from "gsap";
import { ColorTheme } from "@/constants/color";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import GlassSurface from "@/components/decoration/Liquidglass";
import { usePathname } from "next/navigation";
import "./ChatbotWidget.css";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const initialMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the Pento assistant. Ask me anything about smart food management, recipes, or expiry tracking."
};

function ChatBubble({ message }: { message: ChatMessage }) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === "user";

  useEffect(() => {
    if (bubbleRef.current) {
      gsap.fromTo(
        bubbleRef.current,
        {
          opacity: 0,
          scale: 0.95
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        }
      );
    }
  }, []);

  return (
    <div ref={bubbleRef} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all hover:shadow-2xl markdown-content relative ${isUser
          ? "rounded-br-none"
          : "rounded-bl-none"
          }`}
        style={{
          background: isUser
            ? `linear-gradient(135deg, 
                rgba(118, 159, 205, 0.85) 0%, 
                rgba(17, 63, 103, 0.9) 100%)`
            : `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.4) 0%, 
                rgba(255, 255, 255, 0.25) 100%)`,
          backdropFilter: isUser ? 'blur(20px) saturate(150%)' : 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: isUser ? 'blur(20px) saturate(150%)' : 'blur(30px) saturate(180%)',
          boxShadow: isUser
            ? `0 4px 16px rgba(17, 63, 103, 0.2),
               inset 0 1px 0 rgba(255, 255, 255, 0.2),
               inset 0 -1px 0 rgba(0, 0, 0, 0.1)`
            : `0 4px 16px rgba(0, 0, 0, 0.1),
               inset 0 1px 0 rgba(255, 255, 255, 0.6),
               inset 0 -1px 0 rgba(255, 255, 255, 0.2)`,
          color: isUser ? ColorTheme.iceberg : ColorTheme.darkBlue
        }}
      >
        {/* Glass highlight overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: isUser
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
            mixBlendMode: 'overlay'
          }}
        />
        <div className="relative z-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isAtTop = scrollTop === 0;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

      if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
        e.stopPropagation();
      }

      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    messagesContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => messagesContainer.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  useEffect(() => {
    if (chatBoxRef.current) {
      if (isOpen) {
        gsap.fromTo(
          chatBoxRef.current,
          {
            opacity: 0,
            scale: 0.8,
            y: 20
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
          }
        );
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (isOpen && chatBoxRef.current) {
      gsap.to(chatBoxRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(true);
    }
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: trimmed })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from assistant.");
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data?.response?.content ?? "Sorry, I could not process that request."
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while contacting the assistant."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className={`fixed bottom-6 z-[60] flex flex-col gap-3 font-primary ${isAdmin ? 'left-6 items-start' : 'right-6 items-end'}`}>
      {isOpen && (
        <div
          ref={chatBoxRef}
          className="w-[340px] sm:w-[380px] rounded-3xl overflow-hidden chatbot-glass-surface glass-reflection flex flex-col relative"
          style={{
            background: `linear-gradient(135deg, 
            rgba(247, 251, 252, 0.4) 0%, 
            rgba(214, 230, 242, 0.35) 30%,
            rgba(185, 215, 234, 0.3) 60%,
            rgba(214, 230, 242, 0.35) 100%)`,
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: `1px solid rgba(255, 255, 255, 0.5)`,
            boxShadow: `
            0 8px 32px rgba(17, 63, 103, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.5) inset,
            0 0 80px rgba(118, 159, 205, 0.15),
            inset 0 2px 4px rgba(255, 255, 255, 0.8),
            inset 0 -1px 2px rgba(255, 255, 255, 0.3)`,
            maxHeight: '600px'
          }}
        >
          {/* Enhanced glass overlay gradient for shine */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.25) 0%, 
              rgba(255, 255, 255, 0.15) 25%,
              transparent 50%,
              rgba(255, 255, 255, 0.1) 75%,
              rgba(255, 255, 255, 0.2) 100%)`,
              mixBlendMode: 'overlay'
            }}
          />
          {/* Additional shine layer */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`,
              mixBlendMode: 'soft-light'
            }}
          />
          {/* Header with Logo */}
          <div
            className="px-4 py-3 flex items-center justify-between relative overflow-hidden flex-shrink-0 z-10"
            style={{
              background: `linear-gradient(135deg, 
                rgba(17, 63, 103, 0.5) 0%, 
                rgba(118, 159, 205, 0.4) 100%)`,
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent" />
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/50 shadow-lg">
                <Image
                  src="/logo2.PNG"
                  alt="Pento"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-primary tracking-wide" style={{ color: ColorTheme.iceberg }}>
                    Pento Assistant
                  </span>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: ColorTheme.babyBlue }} />
                </div>
                <span className="text-[10px] opacity-80" style={{ color: ColorTheme.powderBlue }}>
                  Powered by AI
                </span>
              </div>
            </div>

            <button
              type="button"
              className="text-xs rounded-full px-3 py-1.5 transition-all hover:scale-105 relative z-10"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: ColorTheme.iceberg,
                backdropFilter: 'blur(10px) saturate(120%)',
                WebkitBackdropFilter: 'blur(10px) saturate(120%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
              onClick={handleToggle}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 chatbot-scrollbar relative z-10"
            style={{

              minHeight: '320px',
              maxHeight: '400px'
            }}
          >
            {messages.map((message, index) => (
              <ChatBubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-bl-none rounded-2xl px-4 py-3 text-sm border animate-pulse relative"
                  style={{

                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    borderColor: `rgba(185, 215, 234, 0.5)`,
                    boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.6),
                      inset 0 -1px 0 rgba(255, 255, 255, 0.2)`,
                    color: ColorTheme.blueGray
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: ColorTheme.blueGray, animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: ColorTheme.blueGray, animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: ColorTheme.blueGray, animationDelay: '300ms' }} />
                    </div>
                    <span>Thinking</span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div
                className="text-xs rounded-xl px-3 py-2 border relative"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(239, 68, 68, 0.15) 0%, 
                    rgba(220, 38, 38, 0.1) 100%)`,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 8px rgba(239, 68, 68, 0.1)',
                  color: '#dc2626'
                }}
              >
                {error}
              </div>
            )}
            <div ref={messagesEndRef} className="h-0" />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="px-4 py-3 flex-shrink-0 relative z-10"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about recipes, expiry, planning..."
                className="flex-1 rounded-4xl px-4 py-2.5 text-sm border transition-all focus:outline-none focus:ring-2 focus:scale-[1.02] relative"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.5) 0%, 
                    rgba(255, 255, 255, 0.35) 100%)`,
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  borderColor: 'rgba(185, 215, 234, 0.6)',
                  boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.6),
                    inset 0 -1px 1px rgba(255, 255, 255, 0.2),
                    0 2px 8px rgba(0, 0, 0, 0.05)`,
                  color: ColorTheme.darkBlue
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full p-2.5 transition-all hover:scale-110 disabled:opacity-50 disabled:scale-100 relative"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: `0 4px 16px rgba(17, 63, 103, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)`,
                  color: ColorTheme.iceberg
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <GlassSurface
        width={64}
        height={64}
        borderRadius={32}
        blur={15}
        opacity={0.9}
        brightness={60}
        className="transition-all hover:scale-110 chatbot-button-glow"
        style={{
          boxShadow: `0 10px 40px rgba(17, 63, 103, 0.4)`
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className="w-full h-full rounded-full flex items-center justify-center relative group"
          aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        >
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: ColorTheme.blueGray }} />
          <MessageSquare className="w-7 h-7 relative z-10 group-hover:rotate-12 transition-transform" style={{ color: ColorTheme.iceberg }} />
        </button>
      </GlassSurface>
    </div>
  );
}

