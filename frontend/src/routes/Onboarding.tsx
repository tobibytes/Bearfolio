import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { createProfile, fetchMyProfile, updateProfile } from '../lib/api';
import { Skill } from '../mock';

const Onboarding = () => {
  const { user, completeOnboarding, updateUser, token } = useAuth();
  const navigate = useNavigate();

  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [strengths, setStrengths] = useState((user?.strengths || []).join(', '));
  const [location, setLocation] = useState(user?.location || '');
  const [year, setYear] = useState<number>(user?.year || 2025);
  const [portfolio, setPortfolio] = useState(user?.links.portfolio || '');
  const [linkedin, setLinkedin] = useState(user?.links.linkedin || '');
  const [github, setGithub] = useState(user?.links.github || '');
  const [website, setWebsite] = useState(user?.links.website || '');
  const [email, setEmail] = useState(user?.links.email || '');
  const [skillsText, setSkillsText] = useState(
    (user?.skills || [])
      .map((s) => `${s.category} | ${s.name} | ${s.level}`)
      .join('\n')
  );
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!token) return;
    fetchMyProfile()
      .then((profile) => {
        if (profile) {
          setProfileId(profile.id);
          setHeadline(profile.headline || user.headline);
          setBio(profile.bio || user.bio);
          setStrengths((profile.strengths || []).join(', '));
          setLocation(profile.location || user.location);
          setYear(profile.year || user.year);
          const links = profile.linksJson ? JSON.parse(profile.linksJson) : {};
          setPortfolio(links.portfolio || portfolio);
          setLinkedin(links.linkedin || linkedin);
          setGithub(links.github || github);
          setWebsite(links.website || website);
          setEmail(links.email || email);
          if (profile.skillsJson) {
            try {
              const skills = JSON.parse(profile.skillsJson) as Skill[];
              setSkillsText(skills.map((s) => `${s.category} | ${s.name} | ${s.level}`).join('\n'));
            } catch {
              /* ignore */
            }
          }
        }
      })
      .catch(() => {});
  }, [token]);

  const handleComplete = () => {
    setError(null);
    const nextStrengths = strengths
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedSkills = skillsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [category = 'General', name = '', level = 'Intermediate'] = line.split('|').map((p) => p.trim());
        return { category, name, level: (level || 'Intermediate') as Skill['level'] };
      })
      .filter((s) => s.name);
    const payload = {
      name: user.name,
      headline: headline || user.headline,
      bio: bio || user.bio,
      location: location || user.location,
      year: year || user.year,
      fields: user.fields,
      interests: user.interests,
      strengths: nextStrengths,
      avatarUrl: user.avatarUrl,
      linksJson: JSON.stringify({
        portfolio,
        linkedin,
        github,
        website,
        email,
        ...user.links,
      }),
      skillsJson: JSON.stringify(parsedSkills),
      onboarded: true,
    };

    const persist = async () => {
      if (!token) {
        updateUser({ headline, strengths: nextStrengths });
        completeOnboarding();
        navigate('/profile');
        return;
      }
      setLoading(true);
      try {
        if (profileId) {
          await updateProfile(profileId, payload);
        } else {
          const created = await createProfile(payload);
          setProfileId(created.id);
        }
        updateUser({ headline, strengths: nextStrengths });
        completeOnboarding();
        navigate('/profile');
      } catch (err) {
        setError('Could not save to backend. Please try again or check your session.');
      } finally {
        setLoading(false);
      }
    };

    void persist();
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
            <label className="text-sm font-semibold text-muted" htmlFor="bio">
              Bio
            </label>
            <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="location">
                Location
              </label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="year">
                Graduation year
              </label>
              <Input id="year" value={year} onChange={(e) => setYear(Number(e.target.value) || 0)} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="portfolio">
                Portfolio
              </label>
              <Input id="portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="linkedin">
                LinkedIn
              </label>
              <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="github">
                GitHub
              </label>
              <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="website">
                Website
              </label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="email">
                Email
              </label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@morgan.edu" />
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
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted" htmlFor="skills">
              Skills (one per line: Category | Skill | Level)
            </label>
            <textarea
              id="skills"
              className="input-base h-28 resize-none"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Design | Wireframing | Intermediate"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleComplete}
              disabled={loading}
              className="button-focus inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:shadow-card disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Complete onboarding'}
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