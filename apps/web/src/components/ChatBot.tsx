import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Loader2, MessageCircle, User, Sparkles } from 'lucide-react';
import { generateChat } from '@/lib/api';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const suggestions = [
  'What can you do?',
  'Write a Python script to parse CSV data',
  'Summarize the key features of this platform',
  'Help me draft a marketing email',
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, open]);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || isGenerating) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setIsGenerating(true);

    try {
      const data = await generateChat(prompt);
      const aiContent = data.response || 'Received empty response.';
      setMessages((prev) => [...prev, { role: 'ai', content: aiContent }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: `Error communicating with the assistant: ${error.message || 'Unknown error'}` },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Launcher button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <Bot className="h-6 w-6" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-ink-950" />
            </span>
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-[70] w-[min(24rem,calc(100vw-2rem))] h-[min(480px,calc(100vh-8rem))] flex flex-col glass-strong rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-down origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-gradient-to-r from-brand-600/20 to-violet-600/10">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 blur-md opacity-50" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-tight">OmniAI Assistant</div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini · Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg glass glass-hover text-white/60 hover:text-white"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center text-center pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 mb-3">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-white">Hi! I'm the OmniAI assistant.</p>
                <p className="text-xs text-white/50 mt-1 mb-4 max-w-[260px]">
                  Ask me anything — code, analysis, writing, or help with this platform.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs text-white/60 hover:text-white glass rounded-full px-3 py-1.5 transition-colors hover:border-white/20"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      msg.role === 'user' ? 'bg-white/5' : 'bg-gradient-to-br from-brand-500 to-violet-500'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="h-3.5 w-3.5 text-white/60" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-brand-600 to-violet-600 text-white rounded-tr-none'
                        : 'glass text-white/80 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {isGenerating && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500">
                  <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                </div>
                <div className="glass rounded-xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0s' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0.2s' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="text-xs text-white/40">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06]">
            <div className="glass rounded-xl p-1.5 flex items-end gap-1.5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask OmniAI anything..."
                rows={1}
                className="flex-1 resize-none bg-transparent px-2.5 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none max-h-28"
                style={{ minHeight: '36px' }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || isGenerating}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-brand-500/40 transition-all"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-white/30 text-center mt-1.5 font-mono">
              Gemini can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      )}
    </>
  );
}