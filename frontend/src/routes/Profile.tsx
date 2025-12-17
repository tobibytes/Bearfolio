import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Upload, Trash2, Edit, Eye } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { useAuth } from '../context/AuthContext';
import { fetchMyProfile, publishPortfolioItem, submitPortfolioItem, updatePortfolioItem, deletePortfolioItem, uploadFile } from '../lib/api';
import { Input } from '../components/Input';
import { PortfolioItem as PortfolioItemType } from '../mock';

type ItemWithState = PortfolioItemType & { state?: string; contentJson?: string; detailTemplate?: string; linksJson?: string };

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<ItemWithState[]>(user?.portfolioItems || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [type, setType] = useState('Software');
  const [format, setFormat] = useState('Report');
  const [tags, setTags] = useState('');
  const [detailTemplate, setDetailTemplate] = useState('CaseStudy');
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!user) {
    return (
      <PageShell>
        <Card className="p-8 space-y-3 text-center">
          <p className="text-lg font-semibold">You need to sign in to view your profile.</p>
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
      .then((me) => {
        if (me) {
          setProfileId(me.id);
          setPortfolio(
            (me.portfolioItems || []).map((p) => ({
              id: p.id,
              studentId: me.id,
              type: p.type as any,
              title: p.title,
              summary: p.summary || '',
              tags: p.tags || [],
              updatedAt: p.updatedAt || '',
              heroImageUrl: p.heroImageUrl || '',
              format: p.format as any,
              detailTemplate: (p as any).detailTemplate || 'CaseStudy',
              links: [],
              state: (p as any).state || 'Draft',
              contentJson: (p as any).contentJson,
              linksJson: (p as any).linksJson,
            }))
          );
        }
      })
      .catch(() => {});
  }, [token]);

  const skillsByCategory = user.skills.reduce<Record<string, { name: string; level: string }[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push({ name: skill.name, level: skill.level });
    return acc;
  }, {});

  const handleEdit = (item: ItemWithState) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSummary(item.summary);
    setType(item.type);
    setFormat(item.format);
    setTags(item.tags.join(', '));
    setDetailTemplate(item.detailTemplate || 'CaseStudy');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setSummary('');
    setType('Software');
    setFormat('Report');
    setTags('');
    setDetailTemplate('CaseStudy');
    setFile(null);
  };

  const handleCreate = async () => {
    if (!profileId) {
      setError('Profile not found. Complete onboarding first.');
      return;
    }
    
    if (!title.trim() || !summary.trim()) {
      setError('Title and summary are required.');
      return;
    }

    setError(null);
    setUploadError(null);
    setLoading(true);
    setUploadProgress(0);

    try {
      let heroImageUrl = '';
      if (file) {
        try {
          heroImageUrl = await uploadFile(file, 'portfolioHero', setUploadProgress);
        } catch (err) {
          setUploadError('Upload failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      const payload = {
        profileId,
        type,
        format,
        title: title.trim(),
        summary: summary.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        contentJson: '{}',
        detailTemplate,
        heroImageUrl,
        linksJson: '[]',
      };

      if (editingId) {
        const updated = await updatePortfolioItem(editingId, payload);
        setPortfolio((prev) => prev.map((p) => (p.id === editingId ? {
          id: updated.id,
          studentId: profileId,
          type: updated.type as any,
          title: updated.title,
          summary: updated.summary || '',
          tags: updated.tags || [],
          updatedAt: updated.updatedAt || '',
          heroImageUrl: updated.heroImageUrl || '',
          format: updated.format as any,
          detailTemplate: (updated as any).detailTemplate || 'CaseStudy',
          links: [],
          state: (updated as any).state || 'Draft',
          contentJson: (updated as any).contentJson,
          linksJson: (updated as any).linksJson,
        } : p)));
      } else {
        const created = await submitPortfolioItem(payload);
        setPortfolio((prev) => [
          {
            id: created.id,
            studentId: profileId,
            type: created.type as any,
            title: created.title,
            summary: created.summary || '',
            tags: created.tags || [],
            updatedAt: created.updatedAt || '',
            heroImageUrl: created.heroImageUrl || '',
            format: created.format as any,
            detailTemplate: (created as any).detailTemplate || 'CaseStudy',
            links: [],
            state: (created as any).state || 'Draft',
            contentJson: (created as any).contentJson,
            linksJson: (created as any).linksJson,
          },
          ...prev,
        ]);
      }
      
      handleCancelEdit();
    } catch (e) {
      setError('Could not save portfolio item. Check your session and try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handlePublish = async (id: string) => {
    if (!confirm('Are you sure you want to publish this portfolio item? It will be visible to everyone.')) {
      return;
    }

    setError(null);
    try {
      await publishPortfolioItem(id);
      setPortfolio((prev) => prev.map((p) => (p.id === id ? { ...p, state: 'Published' } : p)));
    } catch {
      setError('Publish failed. Please try again.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setError(null);
    try {
      await deletePortfolioItem(id);
      setPortfolio((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Delete failed. Please try again.');
    }
  };

  return (
    <PageShell>
      <div className="space-y-8">
        <Card className="flex flex-col gap-4 p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={user.name} src={user.avatarUrl} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold clamp-1">{user.name}</h1>
                <Badge tone="brand">Class of {user.year}</Badge>
              </div>
              <p className="text-muted clamp-2">{user.headline}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                {user.fields.map((f) => (
                  <Badge key={f}>{f}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/profile/edit')}
              className="button-focus inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:shadow-card"
            >
              Edit profile
            </button>
          </div>
        </Card>

        <Tabs
          defaultKey="about"
          items={[
            {
              key: 'about',
              label: 'About',
              content: (
                <div className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
                  <Card className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold">Bio</h3>
                    <p className="text-muted leading-relaxed">{user.bio}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted">
                      {user.interests.map((i) => (
                        <Badge key={i} tone="blue">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold">Strengths</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.strengths.map((s) => (
                        <Badge key={s} tone="green">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              key: 'skills',
              label: 'Skills',
              content: (
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <Card key={category} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{category}</h3>
                        <span className="text-xs text-muted">{skills.length} skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill.name} className="flex items-center gap-1">
                            <span>{skill.name}</span>
                            <span className="text-[10px] text-muted">{skill.level}</span>
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ),
            },
            {
              key: 'portfolio',
              label: 'Portfolio',
              content: (
                <div className="space-y-4">
                  <Card className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold">{editingId ? 'Edit portfolio item' : 'Add portfolio item'}</h3>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
                      <Input placeholder="Summary *" value={summary} onChange={(e) => setSummary(e.target.value)} />
                      <Input placeholder="Type (Software, Research...)" value={type} onChange={(e) => setType(e.target.value)} />
                      <Input placeholder="Format (Report, Video...)" value={format} onChange={(e) => setFormat(e.target.value)} />
                      <Input placeholder="Tags comma separated" value={tags} onChange={(e) => setTags(e.target.value)} />
                      <select 
                        value={detailTemplate} 
                        onChange={(e) => setDetailTemplate(e.target.value)}
                        className="input-base"
                      >
                        <option value="CaseStudy">Case Study</option>
                        <option value="Research">Research</option>
                        <option value="Creative">Creative</option>
                      </select>
                      <label className="flex items-center gap-2 text-sm text-muted col-span-2">
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        <Upload size={16} /> Hero image (optional)
                      </label>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="col-span-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-brand h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <p className="text-xs text-muted mt-1">Uploading... {Math.round(uploadProgress)}%</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="button-focus inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:shadow-card disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            {editingId ? 'Updating...' : 'Saving...'}
                          </>
                        ) : (
                          editingId ? 'Update' : 'Save'
                        )}
                      </button>
                      {editingId && (
                        <button
                          onClick={handleCancelEdit}
                          className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-brand"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    {portfolio.map((item) => (
                      <Card key={item.id} className="p-4 space-y-3">
                        {item.heroImageUrl && (
                          <img src={item.heroImageUrl} alt={item.title} className="h-40 w-full rounded-lg object-cover" />
                        )}
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold clamp-1">{item.title}</h3>
                          <div className="flex gap-2">
                            <Badge tone="orange">{item.type}</Badge>
                            <Badge tone={item.state === 'Published' ? 'green' : 'gray'}>{item.state || 'Draft'}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted leading-relaxed clamp-2">{item.summary}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge tone="green">{item.format}</Badge>
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 text-sm font-semibold">
                          <Link
                            to={`/students/${user.id}/portfolio/${item.id}`}
                            className="button-focus flex items-center gap-1 justify-center flex-1 rounded-lg border border-border px-3 py-2 text-center hover:border-brand"
                          >
                            <Eye size={14} /> View
                          </Link>
                          <button
                            onClick={() => handleEdit(item)}
                            className="button-focus flex items-center gap-1 justify-center flex-1 rounded-lg border border-border px-3 py-2 hover:border-brand"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="button-focus flex items-center gap-1 justify-center rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:border-red-500"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                        {item.state !== 'Published' && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            className="button-focus w-full inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Publish
                          </button>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </PageShell>
  );
};

export default Profile;
