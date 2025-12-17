import { LogIn, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const { signIn, onboarded } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    const result = signIn();
    if (!result.onboarded) {
      navigate('/onboarding');
    } else {
      navigate('/profile');
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
            onClick={handleSignIn}
            className="button-focus inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white shadow-card hover:shadow-none"
          >
            <span className="rounded-full bg-white px-2 py-1 text-ink">G</span>
            Sign in with Google
            <LogIn size={16} />
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
