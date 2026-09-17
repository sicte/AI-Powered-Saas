import { useState, useRef } from 'react';
import {
  MessageSquare,
  History,
  LayoutTemplate,
  BarChart3,
  Settings,
  Sparkles,
  Send,
  Loader2,
  ChevronDown,
  Thermometer,
  Download,
  Copy,
  Plus,
  Search,
  User,
  LogOut,
  ArrowLeft,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  onExit: () => void;
}

type NavItem = 'chats' | 'history' | 'templates' | 'analytics' | 'settings';

const navItems: { id: NavItem; label: string; icon: typeof MessageSquare }[] = [
  { id: 'chats', label: 'Chats', icon: MessageSquare },
  { id: 'history', label: 'History', icon: History },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const models = [
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', desc: 'Anthropic · Advanced reasoning', badge: 'New' },
  { id: 'gpt-4o', name: 'GPT-4o', desc: 'OpenAI · Multimodal & fast', badge: '' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', desc: 'Google · High throughput', badge: '' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Google · 2M context', badge: 'Beta' },
];

const chatHistory = [
  { title: 'Q4 Revenue Analysis', time: '2 min ago' },
  { title: 'Marketing copy draft', time: '1 hr ago' },
  { title: 'Python data scraper', time: '3 hrs ago' },
  { title: 'Customer feedback summary', time: 'Yesterday' },
  { title: 'SQL query optimization', time: '2 days ago' },
  { title: 'API documentation generator', time: '3 days ago' },
];

const mockResponse = `Here's a breakdown of the key insights from your request:

**Summary:** The analysis reveals three actionable patterns in your data.

1. **Top performers** — Enterprise tier drives 48% of revenue with 92% retention
2. **Growth opportunity** — SMB segment shows 17% QoQ growth, underutilized
3. **Risk factors** — Churn concentrated in months 2-3 of onboarding

**Recommended actions:**
- Double down on enterprise sales motion
- Launch SMB onboarding improvement sprint
- Implement early-warning churn detection

Would you like me to create a detailed implementation plan for any of these?`;

export default function Dashboard({ onExit }: DashboardProps) {
  const [activeNav, setActiveNav] = useState<NavItem>('chats');
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSend = async () => {
    if (!prompt.trim() || isGenerating) return;

    const userMsg = { role: 'user' as const, content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = prompt;
    setPrompt('');
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          model: selectedModel.id,
          temperature: temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response from backend service.');
      }

      const data = await response.json();
      const aiContent = data.response || 'Received empty response from backend service.';

      setIsGenerating(false);
      setMessages((prev) => [...prev, { role: 'ai', content: aiContent }]);
    } catch (error: any) {
      setIsGenerating(false);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: `Error communicating with backend: ${error.message || 'Unknown error'}` },
      ]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setPrompt('');
  };

  return (
    <div className="fixed inset-0 bg-ink-950 flex overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`absolute lg:relative z-40 h-full w-64 glass-strong border-r border-white/[0.06] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo + exit */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 blur-md opacity-50" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="font-bold text-sm">Omni<span className="text-brand-400">AI</span></span>
          </div>
          <button
            onClick={onExit}
            className="flex items-center justify-center h-8 w-8 rounded-lg glass glass-hover text-white/60 hover:text-white"
            title="Back to site"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        {/* New chat */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeNav === item.id
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}

          {/* Chat history */}
          {activeNav === 'chats' && (
            <div className="pt-4">
              <div className="px-3 mb-2 text-[10px] font-mono font-medium text-white/30 uppercase tracking-wider">
                Recent
              </div>
              <div className="space-y-0.5">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.title}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors group"
                  >
                    <div className="truncate font-medium">{chat.title}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{chat.time}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User card */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg glass">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">Alex Morgan</div>
              <div className="text-[10px] text-white/40 truncate">Pro Plan</div>
            </div>
            <button className="text-white/40 hover:text-white" title="Sign out">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="relative flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-white/[0.06] glass-strong">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg glass"
            >
              <Search className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-semibold text-white capitalize">{activeNav}</h1>
          </div>

          {/* Control pills */}
          <div className="flex items-center gap-2">
            {/* Model selector */}
            <div className="relative">
              <button
                onClick={() => setModelOpen(!modelOpen)}
                className="inline-flex items-center gap-2 rounded-lg glass glass-hover px-3 py-2 text-xs font-medium text-white/80"
              >
                <Zap className="h-3.5 w-3.5 text-brand-400" />
                <span className="hidden sm:inline">{selectedModel.name}</span>
                <span className="sm:hidden">Model</span>
                <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
              </button>

              {modelOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 glass-strong rounded-xl p-2 shadow-2xl z-50 animate-fade-down">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model); setModelOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                        selectedModel.id === model.id ? 'bg-brand-600/15' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="text-left">
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          {model.name}
                          {model.badge && (
                            <span className="text-[9px] font-bold uppercase bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">{model.desc}</div>
                      </div>
                      {selectedModel.id === model.id && (
                        <div className="h-2 w-2 rounded-full bg-brand-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Temperature */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg glass px-3 py-2">
              <Thermometer className="h-3.5 w-3.5 text-white/40" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-xs font-mono text-white/60 w-8">{temperature.toFixed(1)}</span>
            </div>

            {/* Export */}
            <button className="inline-flex items-center gap-1.5 rounded-lg glass glass-hover px-3 py-2 text-xs font-medium text-white/80">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto" onClick={() => modelOpen && setModelOpen(false)}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {messages.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 blur-xl opacity-30 animate-glow-pulse" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600">
                    <Sparkles className="h-8 w-8 text-white" strokeWidth={2} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
                <p className="text-sm text-white/50 mb-8 max-w-md">
                  Ask me anything — from code generation to data analysis. I'm powered by {selectedModel.name}.
                </p>

                {/* Suggestion cards */}
                <div className="grid sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {[
                    { title: 'Analyze data', desc: 'Process and visualize datasets', icon: BarChart3 },
                    { title: 'Write code', desc: 'Generate clean, documented code', icon: LayoutTemplate },
                    { title: 'Draft content', desc: 'Create marketing copy & docs', icon: MessageSquare },
                    { title: 'Debug issues', desc: 'Find and fix code problems', icon: Settings },
                  ].map((card) => (
                    <button
                      key={card.title}
                      onClick={() => setPrompt(`Help me ${card.title.toLowerCase()}: ${card.desc}`)}
                      className="group glass glass-hover rounded-xl p-4 text-left transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600/15 group-hover:bg-brand-600/25 transition-colors">
                          <card.icon className="h-4 w-4 text-brand-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{card.title}</div>
                          <div className="text-xs text-white/40 mt-0.5">{card.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className="flex gap-4 animate-fade-up">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-white/5'
                        : 'bg-gradient-to-br from-brand-500 to-violet-500'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-white/60" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                         <span className="text-xs font-semibold text-white">
                           {msg.role === 'user' ? 'You' : 'OmniAI'}
                         </span>
                        {msg.role === 'ai' && (
                          <span className="text-[10px] text-white/30 font-mono">{selectedModel.id}</span>
                        )}
                      </div>
                      <div className="text-sm text-white/75 leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </div>
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mt-3">
                          <button className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                          <button className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
                            <Download className="h-3 w-3" />
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Generating indicator */}
                {isGenerating && (
                  <div className="flex gap-4 animate-fade-in">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500">
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    </div>
                    <div className="flex items-center gap-2 h-8">
                      <div className="flex gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0s' }} />
                        <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0.2s' }} />
                        <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <span className="text-xs text-white/40 font-mono">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-white/[0.06] glass-strong p-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-xl p-2 flex items-end gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message OmniAI..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none max-h-32"
                  style={{ minHeight: '40px' }}
                />
              <button
                onClick={handleSend}
                disabled={!prompt.trim() || isGenerating}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-brand-500/40 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-white/30 text-center mt-2 font-mono">
              OmniAI models can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
