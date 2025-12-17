import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { fetchMyProfile, updateProfile, uploadFile } from '../lib/api';
import { Skill } from '../mock';
import { Avatar } from '../components/Avatar';

const EditProfile = () => {
  const { user, signIn, updateUser, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [year, setYear] = useState<number>(user?.year || 2025);
  const [portfolio, setPortfolio] = useState(user?.links.portfolio || '');
  const [linkedin, setLinkedin] = useState(user?.links.linkedin || '');
  const [github, setGithub] = useState(user?.links.github || '');
  const [website, setWebsite] = useState(user?.links.website || '');
  const [email, setEmail] = useState(user?.links.email || '');
  const [strengths, setStrengths] = useState((user?.strengths || []).join(', '));
  const [skillsText, setSkillsText] = useState(
    (user?.skills || [])
      .map((s) => `${s.category} | ${s.name} | ${s.level}`)
      .join('\n')
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!token) return;
    fetchMyProfile()
      .then((profile) => {
        if (profile) {
          setProfileId(profile.id);
          setName(profile.name || name);
          setHeadline(profile.headline || headline);
          setBio(profile.bio || bio);
          setLocation(profile.location || location);
          setYear(profile.year || year);
          setAvatarUrl(profile.avatarUrl || avatarUrl);
          const links = profile.linksJson ? JSON.parse(profile.linksJson) : {};
          setPortfolio(links.portfolio || portfolio);
          setLinkedin(links.linkedin || linkedin);
          setGithub(links.github || github);
          setWebsite(links.website || website);
          setEmail(links.email || email);
          setStrengths((profile.strengths || []).join(', '));
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

  const handleSave = async () => {
    setError(null);
    setUploadError(null);
    setLoading(true);
    setUploadProgress(0);

    try {
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        try {
          finalAvatarUrl = await uploadFile(avatarFile, 'avatar', setUploadProgress);
        } catch (err) {
          setUploadError('Avatar upload failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      const parsedStrengths = strengths
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
      const links = { ...user.links, portfolio, linkedin, github, website, email };
      const payload = {
        name,
        headline,
        bio,
        location,
        year,
        fields: user.fields,
        interests: user.interests,
        strengths: parsedStrengths,
        avatarUrl: finalAvatarUrl,
        linksJson: JSON.stringify(links),
        skillsJson: JSON.stringify(parsedSkills),
        onboarded: true,
      };

      if (token && profileId) {
        await updateProfile(profileId, payload);
      } else if (token) {
        const created = await updateProfile(user.id, payload);
        setProfileId(created.id);
      }
      updateUser({ name, headline, bio, location, year, strengths: parsedStrengths, links, skills: parsedSkills, avatarUrl: finalAvatarUrl });
      signIn(user.id);
      navigate('/profile');
    } catch (err) {
      setError('Could not save profile. Please check your session and try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit profile</h1>
        </div>

        <Card className="p-6 space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-muted">Avatar</label>
            <div className="flex items-center gap-4">
              <Avatar name={name} src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl} size="lg" />
              <label className="button-focus inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold cursor-pointer hover:border-brand">
                <Upload size={16} />
                Choose file
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} 
                />
              </label>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-brand h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-muted mt-1">Uploading avatar... {Math.round(uploadProgress)}%</p>
              </div>
            )}
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          </div>

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
              <label className="text-sm font-semibold text-muted" htmlFor="year">
                Graduation year
              </label>
              <Input id="year" value={year} onChange={(e) => setYear(Number(e.target.value) || 0)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted" htmlFor="portfolio">
                Portfolio link
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
              onClick={handleSave}
              disabled={loading}
              className="button-focus inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:shadow-card disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                'Save'
              )}
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
