import { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Play, Zap, Send } from 'lucide-react';

interface HeroProps {
  onLaunch: () => void;
}

const demoPrompts = [
  'Summarize the latest AI research papers on transformers...',
  'Generate a marketing copy for a new SaaS product launch...',
  'Write Python code to scrape and analyze stock data...',
  'Create a customer support response for a billing issue...',
];

const demoResponse = `OmniAI orchestrates multi-provider models (Claude 3.5 Sonnet, GPT-4o, Gemini) in seconds. Here's a concise summary:

1. **Multi-Model Routing** — Dynamically route requests between Anthropic, OpenAI, and Google
2. **Unified Database** — PostgreSQL & Prisma persistence for all conversations and usage
3. **Long-context Windows** — Extended context up to 1M+ tokens across models
4. **Multimodal Fusion** — Cross-attention unifies text, image, and document streams

These backend capabilities enable high-throughput production AI workflows.`;

export default function Hero({ onLaunch }: HeroProps) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [typedResponse, setTypedResponse] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let charIdx = 0;
    const prompt = demoPrompts[promptIndex];
    setTypedPrompt('');
    setShowResponse(false);
    setTypedResponse('');
    setIsGenerating(false);

    const typePrompt = () => {
      if (charIdx <= prompt.length) {
        setTypedPrompt(prompt.slice(0, charIdx));
        charIdx++;
        timerRef.current = setTimeout(typePrompt, 35);
      } else {
        setIsGenerating(true);
        timerRef.current = setTimeout(() => {
          setIsGenerating(false);
          setShowResponse(true);
          typeResponse();
        }, 1800);
      }
    };

    const typeResponse = () => {
      let respIdx = 0;
      const typeResp = () => {
        if (respIdx <= demoResponse.length) {
          setTypedResponse(demoResponse.slice(0, respIdx));
          respIdx += 2;
          timerRef.current = setTimeout(typeResp, 12);
        } else {
          timerRef.current = setTimeout(() => {
            setPromptIndex((i) => (i + 1) % demoPrompts.length);
          }, 4000);
        }
      };
      typeResp();
    };

    timerRef.current = setTimeout(typePrompt, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [promptIndex]);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
      <div className="absolute top-60 left-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6 animate-fade-down">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              <span className="text-xs font-medium text-white/80">Introducing AI v2.0</span>
              <span className="text-xs text-brand-400 font-semibold">New</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] animate-fade-up">
              Intelligence,
              <br />
              <span className="text-brand-gradient">amplified.</span>
            </h1>

            {/* Subheadline */}
             <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
               OmniAI is the multi-provider enterprise platform that connects your frontend directly to production AI models (Claude, GPT-4o, Gemini) and backend microservices.
             </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={onLaunch}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <Zap className="h-4 w-4 fill-white" />
                Start Building Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#playground"
                className="group inline-flex items-center justify-center gap-2 rounded-xl glass glass-hover px-6 py-3.5 text-sm font-semibold text-white"
              >
                <Play className="h-4 w-4 text-brand-400" />
                Watch Demo
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex -space-x-2">
                {['from-brand-500 to-violet-500', 'from-cyan-500 to-brand-500', 'from-violet-500 to-pink-500', 'from-amber-500 to-brand-500', 'from-emerald-500 to-cyan-500'].map((grad, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full bg-gradient-to-br ${grad} border-2 border-ink-950`} />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 1l2.928 6.371L20 8.36l-5 5.014L16.18 20 10 16.5 3.82 20 5 13.374 0 8.36l7.072-.989z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-0.5">Trusted by 12,000+ teams</p>
              </div>
            </div>
          </div>

          {/* Right: Interactive preview card */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-600/20 via-violet-600/10 to-transparent rounded-3xl blur-2xl" />
            <div className="relative glass-strong rounded-2xl p-1 shadow-2xl shadow-brand-500/10">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                  <span className="font-mono">omni-ai / playground</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-white/40">Live</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 min-h-[380px]">
                {/* Prompt bar */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600/20">
                      <Send className="h-3.5 w-3.5 text-brand-400" />
                    </div>
                    <div className="flex-1 min-h-[24px]">
                      <p className="text-sm text-white/80 font-mono leading-relaxed">
                        {typedPrompt}
                        <span className="inline-block w-0.5 h-4 bg-brand-400 ml-0.5 animate-blink align-middle" />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Generating state */}
                {isGenerating && (
                  <div className="flex items-center gap-3 px-4 animate-fade-in">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0s' }} />
                      <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0.2s' }} />
                      <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-xs text-white/40 font-mono">Generating response...</span>
                    <div className="flex-1 h-px shimmer-bg" />
                  </div>
                )}

                {/* Response */}
                {showResponse && (
                  <div className="glass rounded-xl p-4 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white/40 mb-2 font-mono">nexus-ai-2.0 · 1.2s</p>
                        <div className="text-sm text-white/75 leading-relaxed whitespace-pre-line font-mono">
                          {typedResponse}
                          {typedResponse.length < demoResponse.length && (
                            <span className="inline-block w-0.5 h-4 bg-brand-400 ml-0.5 animate-blink align-middle" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30 font-mono">Model:</span>
                    <span className="text-xs text-brand-400 font-mono font-medium">claude-3-5-sonnet</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
                    <span>128k ctx</span>
                    <span>·</span>
                    <span>0.7 temp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -top-3 -right-3 glass-strong rounded-lg px-3 py-2 shadow-xl animate-float">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-white/80">99.9% uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
