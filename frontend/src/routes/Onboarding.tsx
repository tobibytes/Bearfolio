import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const { user, completeOnboarding, updateUser } = useAuth();
  const navigate = useNavigate();

  const [headline, setHeadline] = useState(user?.headline || '');
  const [strengths, setStrengths] = useState((user?.strengths || []).join(', '));

  if (!user) {
    return (
      <PageShell>
        <Card className="p-8 space-y-3 text-center">
          <p className="text-lg font-semibold">Please sign in to continue onboarding.</p>
          <button
            onClick={() => navigate('/signin')}
            className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-brand"
          >
            Go to sign in
          </button>
        </Card>
      </PageShell>
    );
  }

  const handleComplete = () => {
    const nextStrengths = strengths
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    updateUser({ headline, strengths: nextStrengths });
    completeOnboarding();
    navigate('/profile');
  };

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <p className="text-sm text-muted">Finish these quick fields to personalize your profile. UI only.</p>
        </div>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted" htmlFor="headline">
              Headline
            </label>
            <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted" htmlFor="strengths">
              Strengths (comma separated)
            </label>
            <Input
              id="strengths"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Public speaking, Data analysis, Writing"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleComplete}
              className="button-focus inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:shadow-card"
            >
              Complete onboarding
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink hover:border-brand"
            >
              Skip for now
            </button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
};

export default Onboarding;
