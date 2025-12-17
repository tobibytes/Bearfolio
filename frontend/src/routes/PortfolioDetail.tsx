import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LinkIcon, Loader2 } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { fetchRemotePortfolioItem, RemotePortfolioItem } from '../lib/api';

const formatIcon = (format: string) => {
  switch (format) {
    case 'Paper':
    case 'Report':
      return '📄';
    case 'Poster':
      return '🖼️';
    case 'Deck':
      return '🗂️';
    case 'Video':
      return '🎥';
    case 'Prototype':
      return '🧪';
    case 'Gallery':
      return '🎨';
    case 'Code':
      return '💻';
    default:
      return '📄';
  }
};

type ParsedContent = {
  overview?: string;
  challenge?: string;
  process?: string;
  outcome?: string;
  highlights?: string[];
  researchQuestion?: string;
  method?: string;
  results?: string;
  references?: string;
  gallery?: string[];
  artistStatement?: string;
  tools?: string;
  credits?: string;
};

type Link = { label: string; url: string };

const PortfolioDetail = () => {
  const { itemId } = useParams<{ id: string; itemId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<RemotePortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    fetchRemotePortfolioItem(itemId)
      .then((data) => {
        if (data) {
          setItem(data);
        }
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [itemId]);

  if (loading) {
    return (
      <PageShell>
        <Card className="p-8 flex items-center gap-3 text-muted">
          <Loader2 className="animate-spin" size={18} /> Loading portfolio item...
        </Card>
      </PageShell>
    );
  }

  if (!item) {
    return (
      <PageShell>
        <Card className="p-8 text-center space-y-3">
          <p className="text-lg font-semibold">Portfolio item not found</p>
          <button onClick={() => navigate(-1)} className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold">
            Go back
          </button>
        </Card>
      </PageShell>
    );
  }

  const template = item.detailTemplate || 'CaseStudy';
  const content: ParsedContent = (() => {
    try {
      return item.contentJson ? JSON.parse(item.contentJson) : {};
    } catch {
      return {};
    }
  })();
  
  const links: Link[] = (() => {
    try {
      return item.linksJson ? JSON.parse(item.linksJson) : [];
    } catch {
      return [];
    }
  })();

  const ownerName = item.profile?.name || 'Student';

  const sidebar = (
    <div className="space-y-3">
      <Card className="p-4 space-y-3">
        <h3 className="text-lg font-semibold">Details</h3>
        <Badge tone="orange">{item.type}</Badge>
        <Badge tone="green">{item.format} {formatIcon(item.format)}</Badge>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        {links.length > 0 && (
          <>
            <h4 className="text-sm font-semibold text-muted">Links</h4>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-focus inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-brand"
                >
                  <LinkIcon size={16} /> {link.label}
                </a>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="text-brand">{ownerName}</span>
          <span>/</span>
          <span>{item.title}</span>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="orange">{item.type}</Badge>
            <Badge tone="green">{item.format}</Badge>
            <span className="text-sm text-muted">{new Date(item.updatedAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-bold clamp-2">{item.title}</h1>
          <p className="text-lg text-muted clamp-3">{item.summary}</p>
          {item.heroImageUrl && (
            <img src={item.heroImageUrl} alt={item.title} className="h-72 w-full rounded-xl object-cover" />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            {template === 'CaseStudy' && (
              <>
                {content.overview && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Overview</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.overview}</p>
                  </Card>
                )}
                {content.challenge && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">The challenge</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.challenge}</p>
                  </Card>
                )}
                {content.process && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Process</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.process}</p>
                  </Card>
                )}
                {content.outcome && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Outcome</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.outcome}</p>
                  </Card>
                )}
                {content.highlights && content.highlights.length > 0 && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Highlights</h3>
                    <ul className="list-disc space-y-2 pl-5 text-muted">
                      {content.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </Card>
                )}
              </>
            )}

            {template === 'Research' && (
              <>
                {content.researchQuestion && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Research question</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.researchQuestion}</p>
                  </Card>
                )}
                {content.method && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Method</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.method}</p>
                  </Card>
                )}
                {content.results && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Results</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.results}</p>
                  </Card>
                )}
                {content.references && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">References</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.references}</p>
                  </Card>
                )}
              </>
            )}

            {template === 'Creative' && (
              <>
                {content.gallery && content.gallery.length > 0 && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Gallery</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {content.gallery.map((imageUrl, i) => (
                        <img key={i} src={imageUrl} alt={`Gallery ${i + 1}`} className="h-40 w-full rounded-lg object-cover" />
                      ))}
                    </div>
                  </Card>
                )}
                {content.artistStatement && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Artist statement</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.artistStatement}</p>
                  </Card>
                )}
                {content.tools && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Tools / medium</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.tools}</p>
                  </Card>
                )}
                {content.credits && (
                  <Card className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">Credits</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{content.credits}</p>
                  </Card>
                )}
              </>
            )}
          </div>

          {sidebar}
        </div>
      </div>
    </PageShell>
  );
};

export default PortfolioDetail;
