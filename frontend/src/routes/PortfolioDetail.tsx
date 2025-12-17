import { Link, useNavigate, useParams } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { portfolioItems, students } from '../mock';

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

const PortfolioDetail = () => {
  const { id, itemId } = useParams<{ id: string; itemId: string }>();
  const navigate = useNavigate();
  const item = portfolioItems.find((p) => p.id === itemId);
  const owner = students.find((s) => s.id === id);

  if (!item || !owner) {
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

  const template = item.detailTemplate;

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
        <div className="flex flex-wrap gap-2">
          {item.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className="button-focus inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-brand"
            >
              <LinkIcon size={16} /> {link.label}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link to={`/students/${owner.id}`} className="text-brand hover:underline">{owner.name}</Link>
          <span>/</span>
          <span>{item.title}</span>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="orange">{item.type}</Badge>
            <Badge tone="green">{item.format}</Badge>
            <span className="text-sm text-muted">{item.updatedAt}</span>
          </div>
          <h1 className="text-3xl font-bold clamp-2">{item.title}</h1>
          <p className="text-lg text-muted clamp-3">{item.summary}</p>
          <img src={item.heroImageUrl} alt={item.title} className="h-72 w-full rounded-xl object-cover" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            {template === 'CaseStudy' && (
              <>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Overview</h3>
                  <p className="text-muted leading-relaxed">A concise overview of the work, outcomes, and stakeholders.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">The challenge</h3>
                  <p className="text-muted leading-relaxed">What problem did you focus on? Who was affected? Include constraints and timelines.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Process</h3>
                  <p className="text-muted leading-relaxed">Outline research, experiments, sketches, prototypes, or iterations.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Outcome</h3>
                  <p className="text-muted leading-relaxed">Share results, signals, and what you would do next.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Highlights</h3>
                  <ul className="list-disc space-y-2 pl-5 text-muted">
                    {item.tags.slice(0, 4).map((tag) => (
                      <li key={tag}>{tag} impact statement.</li>
                    ))}
                  </ul>
                </Card>
              </>
            )}

            {template === 'Research' && (
              <>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Research question</h3>
                  <p className="text-muted leading-relaxed">State the guiding question and why it matters.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Method</h3>
                  <p className="text-muted leading-relaxed">Describe your method, participants, and data collection.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Results</h3>
                  <p className="text-muted leading-relaxed">Summarize findings with visuals or key stats.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">References</h3>
                  <p className="text-muted leading-relaxed">Cite sources, collaborators, and acknowledgements.</p>
                </Card>
              </>
            )}

            {template === 'Creative' && (
              <>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Gallery</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="h-28 rounded-lg bg-slate-100" />
                    ))}
                  </div>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Artist statement</h3>
                  <p className="text-muted leading-relaxed">Explain the intent, medium, and inspiration behind this work.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Tools / medium</h3>
                  <p className="text-muted leading-relaxed">List tools, materials, or techniques used.</p>
                </Card>
                <Card className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">Credits</h3>
                  <p className="text-muted leading-relaxed">Call out collaborators, mentors, and contributors.</p>
                </Card>
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
