import {
  Workflow,
  BarChart3,
  MessageSquareCode,
  ShieldCheck,
  Zap,
  GitBranch,
} from 'lucide-react';

const features = [
  {
    icon: Workflow,
    title: 'Automated Workflows',
    desc: 'Build multi-step AI pipelines with visual orchestration. Chain prompts, conditions, and API calls without writing glue code.',
    accent: 'from-brand-500 to-violet-500',
    tag: 'Visual Builder',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Track token usage, latency, cost, and quality metrics across every call. Dashboards update live as your prompts execute.',
    accent: 'from-cyan-500 to-brand-500',
    tag: 'Live Metrics',
  },
  {
    icon: MessageSquareCode,
    title: 'Custom Prompts',
    desc: 'Version-controlled prompt templates with A/B testing, variables, and conditional logic. Roll back instantly when needed.',
    accent: 'from-violet-500 to-pink-500',
    tag: 'Versioned',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security',
    desc: 'SOC 2 Type II, GDPR, and HIPAA compliant. End-to-end encryption, SSO, granular RBAC, and audit logs out of the box.',
    accent: 'from-emerald-500 to-cyan-500',
    tag: 'SOC 2',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Sub-200ms inference with our global edge network. Streaming responses keep your users engaged from the first token.',
    accent: 'from-amber-500 to-brand-500',
    tag: '<200ms',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    desc: 'Every prompt, workflow, and config is versioned. Review changes, create branches, and deploy with confidence.',
    accent: 'from-rose-500 to-violet-500',
    tag: 'Git-like',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 mb-4">
            <span className="text-xs font-medium text-brand-400">Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to ship
            <span className="text-brand-gradient"> AI products</span>
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            A complete toolkit for building, testing, and scaling AI-powered features — from prototype to production.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative glass glass-hover rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500`} />

              {/* Border highlight on hover */}
              <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-all duration-300 pointer-events-none" />

              <div className="relative">
                {/* Icon */}
                <div className="mb-5">
                  <div className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} p-[1px]`}>
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-ink-800">
                      <feature.icon className="h-6 w-6 text-white" strokeWidth={1.8} />
                    </div>
                  </div>
                </div>

                {/* Tag */}
                <span className="inline-block text-[10px] font-mono font-medium text-white/40 uppercase tracking-wider mb-2">
                  {feature.tag}
                </span>

                {/* Title + desc */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              {/* Corner accent */}
              <div className={`absolute bottom-0 right-0 h-20 w-20 rounded-tl-3xl rounded-br-2xl bg-gradient-to-tl ${feature.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
