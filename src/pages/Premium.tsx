import { motion } from 'framer-motion';
import { Crown, Check, Zap, Globe, Headphones, Star, Shield, Wifi, Download, Music2, Radio, ChevronRight, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const premiumFeatures = [
  { icon: Globe, text: 'All 8 regions unlocked', desc: 'Every country, every station' },
  { icon: Download, text: 'HD audio streaming', desc: 'Up to 320kbps bitrate' },
  { icon: Zap, text: 'Ad-free experience', desc: 'Zero interruptions' },
  { icon: Shield, text: 'Unlimited favorites', desc: 'Save as many as you want' },
  { icon: Star, text: 'Live track metadata', desc: 'See what\'s playing now' },
  { icon: Headphones, text: 'Priority support', desc: '24/7 dedicated assistance' },
];

const plans = [
  { id: 'free', name: 'Basic', price: 'Free', period: 'forever', popular: false, cta: 'Current Plan' },
  { id: 'premium_trial', name: 'Pro Trial', price: 'Free', period: 'for 60 days', popular: true, savings: '100% OFF', cta: 'Start Free Trial' },
  { id: 'premium_monthly', name: 'Pro Monthly', price: '₹99', period: 'per month', popular: false, savings: 'Cancel anytime', cta: 'Subscribe' },
  { id: 'premium_annual', name: 'Pro Annual', price: '₹999', period: 'per year', popular: false, savings: 'Best Value', cta: 'Subscribe' },
];

const regions = [
  { emoji: '🇮🇳', name: 'India', stations: 'Radio Mirchi, Red FM, AIR', locked: false },
  { emoji: '🇺🇸', name: 'USA', stations: 'iHeart, NPR, ESPN Radio', locked: false },
  { emoji: '🇬🇧', name: 'Europe', stations: 'BBC Radio, RTL, Capital FM', locked: false },
  { emoji: '🇦🇺', name: 'Australia', stations: 'Triple J, Nova, ABC Radio', locked: true },
  { emoji: '🇧🇷', name: 'South America', stations: 'Rádio Gaúcha, Caracol', locked: true },
  { emoji: '🌍', name: 'Africa', stations: 'Metro FM, Kaya FM', locked: true },
  { emoji: '🇯🇵', name: 'Asia Pacific', stations: 'J-Wave, KBS, Radio Taiwan', locked: true },
  { emoji: '🇦🇪', name: 'Middle East', stations: 'Dubai Eye, Radio Jordan', locked: true },
];

const comparisonRows = [
  { label: 'Regions', free: '3 regions', premium: '8+ regions' },
  { label: 'Audio Quality', free: 'Standard', premium: 'HD 320kbps' },
  { label: 'Advertisements', free: 'Yes', premium: 'None' },
  { label: 'Favourites', free: '5 max', premium: 'Unlimited' },
  { label: 'Live Track Info', free: 'Basic', premium: 'Full metadata' },
  { label: 'Support', free: 'Standard', premium: 'Priority 24/7' },
];

export default function Premium() {
  const { isPremium, user, loading } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-28 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-gold-dark flex items-center justify-center mx-auto mb-5 shadow-[0_0_32px_rgba(255,182,144,0.2)]">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Premium Unlocked!</h1>
          <p className="text-muted-foreground mb-6">You have full access to all features.</p>
          <Link to="/" className="inline-block py-2.5 px-6 rounded-xl bg-gradient-gold-dark text-white font-bold text-sm hover:shadow-[0_0_24px_rgba(255,182,144,0.3)] transition-all">
            Return to Home
          </Link>
        </div>
        <AudioPlayer />
      </div>
    );
  }

  const activateFreeTrial = async () => {
    if (!user) { toast.error('Please sign in first'); return; }
    setIsCheckingOut(true);
    try {
      await setDoc(doc(db, 'users', user.uid), { isPremium: true, premiumSince: Date.now(), premiumTrialEnd: Date.now() + 60 * 24 * 60 * 60 * 1000 }, { merge: true });
      toast.success('Premium activated!', { description: 'Enjoy full features for the next 60 days' });
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err: any) { toast.error('Failed to activate Premium', { description: err.message || 'Please try again later' }); }
    finally { setIsCheckingOut(false); }
  };

  const handleRazorpayCheckout = async (planId: string, amount: number) => {
    if (!user) { toast.error('Please sign in first'); return; }
    setIsCheckingOut(true);
    try {
      const createOrder = httpsCallable(functions, 'createRazorpayOrder');
      const result = await createOrder({ amount, currency: 'INR', userId: user.uid });
      const order = result.data as any;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Hertz',
        description: `${planId === 'premium_monthly' ? 'Monthly' : 'Annual'} Premium Subscription`,
        order_id: order.id,
        prefill: { email: user.email, contact: '' },
        handler: async (response: any) => {
          const verifyPayment = httpsCallable(functions, 'verifyRazorpayPayment');
          await verifyPayment({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, userId: user.uid });
          toast.success('Payment successful!', { description: 'Thank you for subscribing!' });
          setTimeout(() => { window.location.href = '/'; }, 1500);
        },
        modal: { ondismiss: () => { setIsCheckingOut(false); } },
        theme: { color: '#f97316' },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => { toast.error('Payment failed', { description: response.error.description || 'Please try again' }); setIsCheckingOut(false); });
      rzp.open();
    } catch (err: any) { toast.error('Failed to start payment', { description: err.message || 'Please try again later' }); setIsCheckingOut(false); }
  };

  const handleCheckout = async (planId: string) => {
    if (!user) { toast.error('Please sign in first'); return; }
    if (planId === 'premium_trial') await activateFreeTrial();
    else if (planId === 'premium_monthly') await handleRazorpayCheckout(planId, 9900);
    else if (planId === 'premium_annual') await handleRazorpayCheckout(planId, 99900);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />

      {/* Hero */}
      <section className="relative pt-10 pb-6 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-primary/20 mb-5">
              <Crown className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Hertz Premium</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
              The World's Radio,
              <br />
              <span className="text-gradient-gold">Unleashed</span>
            </h1>

            <p className="text-sm text-muted-foreground/70 max-w-sm mx-auto leading-relaxed">
              No ads. HD audio. Every region on Earth. <span className="font-semibold text-primary">Free for first 60 days</span> — no card required.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-4">
        {/* Trial Banner */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 p-4 rounded-2xl glass-card border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-gold-dark flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,182,144,0.15)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-foreground mb-1">Launch Special Offer</h3>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
                Start your <span className="font-semibold text-primary">60-day free trial</span> today! After the trial, continue for just <span className="font-semibold text-foreground">₹99/month</span> or save with annual <span className="font-semibold text-foreground">₹999/year</span>. No credit card needed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Plans */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-8">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">Choose your plan</p>
          <div className="flex flex-col gap-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "relative rounded-2xl p-5 transition-all",
                  plan.popular
                    ? "glass-card border-primary/30 gold-glow"
                    : "glass-card border-white/5"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-gold-dark text-white text-[9px] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,182,144,0.2)]">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-1">{plan.name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-xs text-muted-foreground/60">{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <p className="text-[11px] text-primary mt-0.5 font-medium">{plan.savings}</p>
                    )}
                  </div>

                  <div>
                    {plan.comingSoon ? (
                      <div className="text-[10px] text-muted-foreground/40 font-medium px-4 py-2 rounded-lg bg-white/5">Coming soon</div>
                    ) : plan.id === 'free' ? (
                      <div className="text-[10px] text-muted-foreground/40 font-medium px-4 py-2 rounded-lg bg-white/5">Current</div>
                    ) : (
                      <Button
                        size="sm"
                        className={cn("text-xs font-bold", plan.popular ? "bg-gradient-gold-dark text-white shadow-[0_0_16px_rgba(255,182,144,0.2)] hover:shadow-[0_0_24px_rgba(255,182,144,0.3)]" : "glass-card text-foreground border border-white/10 hover:bg-white/10")}
                        onClick={() => handleCheckout(plan.id)}
                        disabled={isCheckingOut}
                      >
                        {isCheckingOut ? 'Processing...' : plan.cta}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-[10px] text-muted-foreground/50 mt-3">
            ✓ 60-day free trial · Then ₹99/month or ₹999/year · Cancel anytime
          </p>
        </motion.section>

        {/* Comparison */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">Free vs Premium</p>
          <div className="rounded-2xl glass-card border border-white/5 overflow-hidden">
            <div className="grid grid-cols-3 bg-white/[0.03] px-4 py-3 border-b border-white/5">
              <span className="text-xs font-semibold text-muted-foreground/60">Feature</span>
              <span className="text-xs font-semibold text-muted-foreground/60 text-center">Free</span>
              <span className="text-xs font-semibold text-primary text-center flex items-center justify-center gap-1">
                <Crown className="w-3 h-3" /> Premium
              </span>
            </div>
            {comparisonRows.map((row, i) => (
              <div key={row.label} className={cn("grid grid-cols-3 px-4 py-3 text-xs", i % 2 === 0 ? "" : "bg-white/[0.02]", "border-b border-white/5 last:border-0")}>
                <span className="text-muted-foreground/60 font-medium">{row.label}</span>
                <span className="text-center text-muted-foreground/40">{row.free}</span>
                <span className="text-center text-primary font-semibold">{row.premium}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-8">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">What you get</p>
          <div className="grid grid-cols-1 gap-2">
            {premiumFeatures.map((f) => (
              <div key={f.text} className="flex items-center gap-3 p-3 rounded-xl glass-card border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-gold-dark/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-foreground font-medium">{f.text}</span>
                  <p className="text-[10px] text-muted-foreground/50">{f.desc}</p>
                </div>
                <Check className="w-4 h-4 text-primary/60 flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Regions */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">Regions</p>
          <div className="flex flex-col gap-2">
            {regions.map((r) => (
              <div key={r.name} className={cn("flex items-center gap-3 p-3 rounded-xl glass-card border border-white/5 transition-all", r.locked && "opacity-50")}>
                <span className="text-xl">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground/50 truncate">{r.stations}</p>
                </div>
                {r.locked ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    <Crown className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-bold text-primary uppercase tracking-wider">Premium</span>
                  </div>
                ) : (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="pb-4">
          <div className="rounded-2xl glass-card border border-primary/20 overflow-hidden">
            <div className="h-0.5 bg-gradient-gold" />
            <div className="p-6 text-center">
              <Crown className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground mb-1">Start Your Free Trial</h3>
              <p className="text-xs text-muted-foreground/70 mb-5 max-w-xs mx-auto">Get 60 days of Pro features absolutely free. After trial: ₹99/month or ₹999/year.</p>
              <Button className="w-full font-bold bg-gradient-gold-dark text-white shadow-[0_0_20px_rgba(255,182,144,0.2)] hover:shadow-[0_0_32px_rgba(255,182,144,0.3)]" onClick={() => handleCheckout('premium_trial')} disabled={isCheckingOut}>
                {isCheckingOut ? 'Activating...' : 'Start 60-Day Free Trial'}
              </Button>
              <p className="text-[9px] text-muted-foreground/40 mt-3">No credit card required · Cancel anytime</p>
            </div>
          </div>
        </motion.div>
      </main>

      <AudioPlayer />
    </div>
  );
}
