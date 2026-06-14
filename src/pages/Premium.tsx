import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Radio, Infinity, Headphones, Zap, Shield, Heart, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    name: 'Free',
    price: '0',
    description: 'Get started with basic access',
    features: ['5 favorites', 'Standard audio', 'Ads', '4 regions', 'Basic support'],
    missing: ['Unlimited favorites', 'HD audio', 'Ad-free', 'All 8 regions'],
    cta: 'Current Plan',
    popular: false,
  },
  {
    name: 'Premium',
    price: '199',
    period: '/month',
    description: 'Unlock everything Hertz has to offer',
    features: [
      'Unlimited favorites',
      'HD audio streaming',
      'Completely ad-free',
      'All 8 world regions',
      'Priority support',
      'Early access to new features',
    ],
    cta: 'Subscribe Now',
    popular: true,
  },
  {
    name: 'Lifetime',
    price: '1,999',
    period: ' one-time',
    description: 'Pay once, own it forever',
    features: [
      'Everything in Premium',
      'Lifetime updates',
      'Exclusive Hertz badge',
      'Beta access',
      'Direct feature requests',
      'Supporter recognition',
    ],
    cta: 'Get Lifetime',
    popular: false,
  },
];

const FEATURE_COMPARE = [
  { feature: 'Favorites', free: '5', premium: 'Unlimited', lifetime: 'Unlimited' },
  { feature: 'Audio Quality', free: 'Standard', premium: 'HD', lifetime: 'HD' },
  { feature: 'Ads', free: 'Shown', premium: 'None', lifetime: 'None' },
  { feature: 'Regions', free: '4', premium: 'All 8', lifetime: 'All 8' },
  { feature: 'Support', free: 'Basic', premium: 'Priority', lifetime: 'Priority' },
];

export default function Premium() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <main className="min-h-screen pt-4 pb-24">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-medium mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary/80">Premium Radio</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
          >
            <span className="text-gradient-gold">Upgrade</span>{' '}
            <span className="text-foreground">your listening</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground/60 max-w-md mx-auto"
          >
            Unlock unlimited favorites, crystal-clear HD audio, and zero interruptions.
          </motion.p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mb-10">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'relative rounded-2xl p-5 md:p-6 transition-all duration-300',
                plan.popular
                  ? 'glass-card border-primary/30 gold-glow'
                  : 'glass-card hover:border-white/10'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-gold rounded-t-2xl" />
              )}

              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-gold-dark text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  Best Value
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{plan.description}</p>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-extrabold text-foreground">₹{plan.price}</span>
                {plan.period && <span className="text-sm text-muted-foreground/50 ml-0.5">{plan.period}</span>}
              </div>

              <ul className="space-y-2.5 mb-5">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-xs text-muted-foreground/70">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {plan.missing?.map((f, j) => (
                  <li key={`miss-${j}`} className="flex items-start gap-2.5 text-xs text-muted-foreground/30">
                    <X className="w-3.5 h-3.5 text-muted-foreground/20 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  'w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200',
                  plan.popular
                    ? 'bg-gradient-gold-dark text-white shadow-[0_0_20px_rgba(255,182,144,0.2)] hover:shadow-[0_0_30px_rgba(255,182,144,0.3)]'
                    : 'glass-card hover:bg-white/10 border border-white/10 text-foreground'
                )}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl glass-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="font-bold text-sm text-foreground">Feature Comparison</h3>
          </div>
          <div className="divide-y divide-white/5">
            {FEATURE_COMPARE.map((row) => (
              <div key={row.feature} className="grid grid-cols-4 px-5 py-3.5 text-xs">
                <span className="text-muted-foreground font-medium">{row.feature}</span>
                <span className="text-muted-foreground/40 text-center">{row.free}</span>
                <span className="text-primary font-medium text-center">{row.premium}</span>
                <span className="text-primary font-medium text-center">{row.lifetime}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
