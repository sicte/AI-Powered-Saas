import { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface PricingProps {
  onLaunch: () => void;
}

type BillingCycle = 'monthly' | 'annual';

const plans = [
  {
    name: 'Starter',
    desc: 'For individuals exploring AI development',
    monthly: 0,
    annual: 0,
    highlighted: false,
    cta: 'Start Free',
    features: [
      '1,000 messages / month',
      'Powered by Gemini',
      'Community support',
      'Basic analytics dashboard',
      '3 prompt templates',
      '1 project workspace',
    ],
  },
  {
    name: 'Pro',
    desc: 'For teams building AI-powered products',
    monthly: 49,
    annual: 39,
    highlighted: true,
    cta: 'Start 14-Day Trial',
    features: [
      '50,000 messages / month',
      'Priority AI responses',
      'Priority support (8h SLA)',
      'Advanced analytics & A/B testing',
      'Unlimited prompt templates',
      '10 project workspaces',
      'Custom workflows & pipelines',
      'Team collaboration (5 seats)',
    ],
  },
  {
    name: 'Enterprise',
    desc: 'For organizations at scale',
    monthly: null,
    annual: null,
    highlighted: false,
    cta: 'Contact Sales',
    features: [
      'Unlimited API calls',
      'Dedicated infrastructure',
      '24/7 dedicated support (1h SLA)',
      'Custom model fine-tuning',
      'SSO, SAML & SCIM',
      'SOC 2, HIPAA & GDPR',
      'On-premise deployment option',
      'Unlimited seats',
      'Custom SLAs & contracts',
    ],
  },
];

export default function Pricing({ onLaunch }: PricingProps) {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-600/10 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 mb-4">
            <span className="text-xs font-medium text-brand-400">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, <span className="text-brand-gradient">transparent</span> pricing
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium transition-colors ${billing === 'monthly' ? 'text-white' : 'text-white/40'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
            className="relative h-7 w-14 rounded-full glass p-1 transition-colors"
            aria-label="Toggle billing cycle"
          >
            <div
              className={`h-5 w-5 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 shadow-lg shadow-brand-500/30 transition-transform duration-300 ${
                billing === 'annual' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${billing === 'annual' ? 'text-white' : 'text-white/40'}`}>
            Annual
          </span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 rounded-full px-2.5 py-1">
            Save 20%
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {plans.map((plan) => {
            const price = billing === 'monthly' ? plan.monthly : plan.annual;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 transition-all duration-300 ${
                  plan.highlighted
                    ? 'glass-strong border-brand-500/30 glow-brand-lg md:-translate-y-3 md:scale-[1.03]'
                    : 'glass glass-hover hover:-translate-y-1'
                }`}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-600/10 to-transparent pointer-events-none" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-1.5 shadow-lg shadow-brand-500/30">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                        <span className="text-xs font-semibold text-white">Most Popular</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="relative">
                  {/* Plan name */}
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{plan.desc}</p>

                  {/* Price */}
                  <div className="mt-5 mb-1">
                    {price === null ? (
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold text-white">Custom</span>
                      </div>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold text-white">${price}</span>
                        <span className="text-sm text-white/40 mb-1">/mo</span>
                        {billing === 'annual' && price > 0 && (
                          <span className="text-xs text-white/30 mb-1.5 ml-1">billed annually</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={onLaunch}
                    className={`mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02]'
                        : 'glass glass-hover text-white'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.highlighted ? 'bg-brand-600/30' : 'bg-white/5'
                        }`}>
                          <Check className={`h-3 w-3 ${plan.highlighted ? 'text-brand-400' : 'text-white/60'}`} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm text-white/60 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
