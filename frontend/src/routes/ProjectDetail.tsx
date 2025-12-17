import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { fetchRemotePortfolioItem, RemotePortfolioItem } from '../lib/api';

const fallbackHero = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<RemotePortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchRemotePortfolioItem(id)
      .then((data) => {
        if (data) {
          setItem(data);
        }
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <Card className="p-8 flex items-center gap-3 text-muted">
          <Loader2 size={18} className="animate-spin" /> Loading project...
        </Card>
      </PageShell>
    );
  }

  if (!item) {
    return (
      <PageShell>
        <Card className="p-8 text-center space-y-3">
          <p className="text-lg font-semibold">Project not found</p>
          <button
            onClick={() => navigate('/projects')}
            className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold"
          >
            Back to projects
          </button>
        </Card>
      </PageShell>
    );
  }

  const ownerName = item.profile?.name || 'Student';
  const updatedLabel = new Date(item.updatedAt).toLocaleDateString();
  const links = (() => {
    try {
      return item.linksJson ? JSON.parse(item.linksJson) : [];
    } catch {
      return [];
    }
  })() as { label: string; url: string }[];

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="orange">{item.type}</Badge>
          <Badge tone="gray">Updated {updatedLabel}</Badge>
          {item.state && <Badge tone={item.state === 'Published' ? 'green' : 'gray'}>{item.state}</Badge>}
        </div>
        <h1 className="text-3xl font-bold clamp-2">{item.title}</h1>
        <p className="text-lg text-muted clamp-3">{item.summary}</p>
        {item.heroImageUrl && (
          <img src={item.heroImageUrl || fallbackHero} alt={item.title} className="h-72 w-full rounded-xl object-cover" />
        )}

        <Card className="p-5 space-y-3">
          <h3 className="text-lg font-semibold">Overview</h3>
          <p className="text-muted leading-relaxed">
            A concise snapshot for recruiters: what this project does, why it exists, and what formats it lives in. Click through the
            owner profile or portfolio detail for more.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">{item.format}</Badge>
            {item.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </Card>

        {links.length > 0 && (
          <Card className="p-5 space-y-3">
            <h3 className="text-lg font-semibold">Links</h3>
            <div className="flex flex-wrap gap-2">
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-focus inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-brand"
                >
                  <ExternalLink size={16} /> {link.label}
                </a>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Owner</h3>
            <Link to={item.profile?.id ? `/students/${item.profile.id}` : '/students'} className="text-sm font-semibold text-brand hover:underline">
              View profile
            </Link>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 px-3 py-2">
            <Avatar name={ownerName} src={item.profile?.avatarUrl || ''} />
            <div className="min-w-0">
              <p className="font-semibold clamp-1">{ownerName}</p>
              <p className="text-sm text-muted clamp-1">{item.profile?.headline || 'Student at Morgan State University'}</p>
            </div>
          </div>
          {item.profile?.id && (
            <Link
              to={`/students/${item.profile.id}/portfolio/${item.id}`}
              className="button-focus inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-brand"
            >
              <ExternalLink size={16} /> View full portfolio item
            </Link>
          )}
        </Card>
      </div>
    </PageShell>
  );
};

export default ProjectDetail;
