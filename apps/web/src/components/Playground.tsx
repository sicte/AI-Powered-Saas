import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Code2, BarChart3, FileText, Hash } from 'lucide-react';

type OutputType = 'text' | 'code' | 'data';

const sampleOutputs: Record<OutputType, { title: string; content: string }> = {
  text: {
    title: 'Generated Response',
    content: `# AI Market Analysis 2026

The AI software market is projected to reach **$1.3 trillion** by 2032, driven by three key trends:

## Key Findings

1. **Enterprise Adoption** — 73% of Fortune 500 companies now use AI in production workflows
2. **Cost Reduction** — Average inference costs have dropped 85% year-over-year
3. **Multimodal AI** — Text, image, and video models are converging into unified systems

> "The next decade will be defined by AI-native applications that reimagine user experiences from the ground up."

## Recommendations

- Invest in **AI infrastructure** now to capture compounding efficiency gains
- Build **proprietary datasets** as a competitive moat
- Prioritize **responsible AI** practices to maintain user trust`,
  },
  code: {
    title: 'Generated Code',
    content: `import { AIOrchestrationService } from '@ai-saas/ai-sdk';

// Initialize the multi-provider client
const ai = new AIOrchestrationService();
const provider = ai.getProvider('openai');

// Analyze customer feedback at scale
async function analyzeFeedback(reviews: string[]) {
  const response = await provider.generateText({
    model: 'gpt-4o',
    messages: reviews.map(r => ({
      role: 'user',
      content: \`Analyze sentiment and extract key themes from this review: \${r}\`
    })),
    temperature: 0.3,
  });

  return response.content;
}

// Process reviews with real-time backend integration
const insights = await analyzeFeedback(feedbackData);
console.log(insights);`,
  },
  data: {
    title: 'Data Visualization',
    content: `QUARTERLY REVENUE ANALYSIS
========================

Q1 2026:  ████████████████████░░░░░  $2.4M  (+18%)
Q2 2026:  ██████████████████████░░░  $2.8M  (+17%)
Q3 2026:  ████████████████████████░  $3.1M  (+11%)
Q4 2026:  ██████████████████████████  $3.6M  (+16%)

SEGMENT BREAKDOWN
-----------------
Enterprise:    48% ██████████████████████
SMB:          31% ████████████████
Startup:      15% ████████
Individual:    6% ███

GROWTH METRICS
--------------
• Net Revenue Retention:  134%
• Customer Acquisition:   +2,847
• Churn Rate:             2.1% ↓
• Avg. Contract Value:    $14.2K ↑`,
  },
};

const outputTypes: { type: OutputType; icon: typeof Code2; label: string }[] = [
  { type: 'text', icon: FileText, label: 'Text' },
  { type: 'code', icon: Code2, label: 'Code' },
  { type: 'data', icon: BarChart3, label: 'Data' },
];

const suggestions = [
  'Analyze Q4 revenue and generate a report',
  'Write a Python script for sentiment analysis',
  'Create a data visualization of user growth',
];

export default function Playground() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [outputType, setOutputType] = useState<OutputType>('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [displayedOutput, setDisplayedOutput] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setHasResult(false);
    setOutput('');
    setDisplayedOutput('');

    const currentPrompt = prompt;

    try {
      const response = await fetch('http://localhost:8000/api/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          model: 'gemini-3.5-flash',
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Backend generation failed.');
      }

      const data = await response.json();
      const result = data.response || 'No response returned.';

      setIsGenerating(false);
      setHasResult(true);
      setOutput(result);
      setDisplayedOutput(result);
    } catch (error: any) {
      setIsGenerating(false);
      setHasResult(true);
      const errResult = `Error connecting to backend service: ${error.message || 'Unknown error'}`;
      setOutput(errResult);
      setDisplayedOutput(errResult);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };

  return (
    <section id="playground" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 mb-4">
            <span className="text-xs font-medium text-brand-400">Try it now</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            The <span className="text-brand-gradient">Playground</span>
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Type a prompt and watch OmniAI generate a response in real time via backend API. Switch between text, code, and data output modes.
          </p>
        </div>

        {/* Workspace */}
        <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/5">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white/80">OmniAI Playground</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Output type switcher */}
              <div className="flex items-center gap-1 glass rounded-lg p-1">
                {outputTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setOutputType(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      outputType === type
                        ? 'bg-brand-600/30 text-brand-300'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Split view */}
          <div className="grid md:grid-cols-2 min-h-[440px]">
            {/* Left: Input */}
            <div className="flex flex-col p-5 border-b md:border-b-0 md:border-r border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Input Prompt</label>
                <span className="text-xs text-white/30 font-mono">{prompt.length} chars</span>
              </div>

              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate();
                }}
                placeholder="Ask OmniAI anything... e.g. 'Analyze Q4 revenue and generate a report'"
                className="flex-1 w-full resize-none rounded-xl glass p-4 text-sm text-white/80 placeholder:text-white/30 font-mono leading-relaxed focus:outline-none focus:border-brand-500/40 transition-colors min-h-[200px]"
              />

              {/* Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs text-white/50 hover:text-white/80 glass rounded-full px-3 py-1.5 transition-colors hover:border-white/20"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Submit */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-white/30 font-mono hidden sm:block">
                  ⌘ + Enter to send
                </span>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-brand-500/40 transition-all duration-300 enabled:hover:scale-[1.02]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Output */}
            <div className="flex flex-col p-5 bg-black/20">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider">
                  {sampleOutputs[outputType].title}
                </label>
                {hasResult && (
                  <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
                    <Hash className="h-3 w-3" />
                    <span>claude-3-5-sonnet</span>
                  </div>
                )}
              </div>

              <div className="flex-1 rounded-xl glass p-4 overflow-auto min-h-[200px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0s' }} />
                      <div className="h-2.5 w-2.5 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0.2s' }} />
                      <div className="h-2.5 w-2.5 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <p className="text-xs text-white/40 font-mono">Generating response...</p>
                  </div>
                ) : hasResult ? (
                  <pre className={`text-sm leading-relaxed whitespace-pre-wrap font-mono ${outputType === 'code' ? 'text-green-300/90' : 'text-white/80'}`}>
                    {displayedOutput}
                    {displayedOutput.length < output.length && (
                      <span className="inline-block w-0.5 h-4 bg-brand-400 animate-blink align-middle" />
                    )}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                    <Sparkles className="h-8 w-8 text-white/10" />
                    <p className="text-sm text-white/30">Your AI-generated response will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
