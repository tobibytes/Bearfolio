import { LogIn, Shield, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const SignIn = () => {
  const { signIn, onboarded, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleSignIn = () => {
    const result = signIn();
    if (!result.onboarded) {
      navigate('/onboarding');
    } else {
      navigate('/profile');
    }
  };

  const handleGoogle = async () => {
    try {
      setBusy(true);
      const result = await signInWithGoogle();
      if (!result.user) return;
      if (!result.onboarded) navigate('/onboarding');
      else navigate('/profile');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md space-y-4 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand.soft text-brand.dark">
            <Shield size={20} />
          </div>
          <h1 className="text-2xl font-bold">Sign in to Bearfolio</h1>
          <p className="text-sm text-muted">Use your Morgan State Google account. Button is decorative for now.</p>
          <button
            onClick={handleGoogle}
            disabled={busy}
            className="button-focus inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white shadow-card hover:shadow-none disabled:opacity-60"
          >
            <span className="rounded-full bg-white px-2 py-1 text-ink">G</span>
            {busy ? 'Signing in...' : 'Sign in with Google'}
            {busy ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          </button>
          <button
            onClick={handleSignIn}
            className="button-focus inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold hover:border-brand"
          >
            Continue as demo user
          </button>
          <p className="text-xs text-muted">
            By continuing, you agree to the student code of conduct and recruiter-friendly profile guidelines.
          </p>
          <div className="text-xs text-muted">
            <Link to="/" className="text-brand hover:underline">
              Back to home
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
};

export default SignIn;
