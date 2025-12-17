import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const { user, signIn, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [strengths, setStrengths] = useState((user?.strengths || []).join(', '));

  if (!user) {
    return (
      <PageShell>
        <Card className="p-8 space-y-3 text-center">
          <p className="text-lg font-semibold">You need to sign in to edit your profile.</p>
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

  const handleSave = () => {
    const parsedStrengths = strengths
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    updateUser({ name, headline, bio, location, strengths: parsedStrengths });
    signIn(user.id);
    navigate('/profile');
  };

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit profile</h1>
        </div>

        <Card className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="name">
                Name
              </label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="headline">
                Headline
              </label>
              <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              className="input-base h-24 resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="location">
                Location
              </label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="portfolio">
                Portfolio link
              </label>
              <Input id="portfolio" placeholder={user.links.portfolio || 'https://'} />
            </div>
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
              onClick={handleSave}
              className="button-focus inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:shadow-card"
            >
              Save (UI only)
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink hover:border-brand"
            >
              Cancel
            </button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
};

export default EditProfile;
