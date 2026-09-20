import { useState, type FormEvent } from 'react';
import { Sparkles, ArrowLeft, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthPageProps {
  mode: 'signin' | 'signup';
  onSwitch: (mode: 'signin' | 'signup') => void;
  onSuccess: () => void;
  onBack: () => void;
}

export default function AuthPage({ mode, onSwitch, onSuccess, onBack }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp(name, email, password);
      } else {
        await signIn(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-violet-600/15 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md animate-fade-down">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 blur-md opacity-60" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Omni<span className="text-brand-400">AI</span>
          </span>
        </div>

        <div className="glass-strong rounded-2xl p-8 shadow-2xl shadow-brand-500/10">
          {/* Mode tabs */}
          <div className="flex items-center gap-1 glass rounded-lg p-1 mb-6">
            <button
              onClick={() => { onSwitch('signin'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                mode === 'signin' ? 'bg-brand-600/30 text-brand-300' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </button>
            <button
              onClick={() => { onSwitch('signup'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                mode === 'signup' ? 'bg-brand-600/30 text-brand-300' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Sign Up
            </button>
          </div>

          <h1 className="text-xl font-bold text-white mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-white/50 mb-6">
            {mode === 'signin'
              ? 'Sign in to save chats and unlock full access.'
              : 'Sign up to save chats and unlock full access.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Doe"
                  className="w-full rounded-lg glass px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500/40 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg glass px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-lg glass px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500/40 transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Demo access */}
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-white/40 text-center">
              Just exploring?
              <button
                onClick={onSuccess}
                className="text-brand-400 hover:text-brand-300 font-medium ml-1"
              >
                Continue as Demo
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 mx-auto flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>
      </div>
    </div>
  );
}