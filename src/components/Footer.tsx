import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  onLaunch: () => void;
}

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Playground', 'Pricing', 'Changelog', 'Roadmap'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Tutorials', 'Blog', 'Community'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Press Kit', 'Partners', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance', 'SLA'],
  },
];

export default function Footer({ onLaunch }: FooterProps) {
  return (
    <footer className="relative border-t border-white/[0.06] pt-16 pb-8 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-600/5 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 blur-md opacity-60" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600">
                  <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight">
                Nexus<span className="text-brand-400">AI</span>
              </span>
            </a>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed mb-5">
              The enterprise-grade AI platform for building, deploying, and scaling intelligent applications.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg glass glass-hover text-white/60 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="glass rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white">Stay in the loop</h4>
            <p className="text-sm text-white/50 mt-1">Get product updates and AI insights delivered monthly.</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 sm:w-64 rounded-lg glass px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500/40 transition-colors"
            />
            <button
              onClick={onLaunch}
              className="rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-white/40">
            © 2026 NexusAI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
