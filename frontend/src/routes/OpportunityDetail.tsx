import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { PageShell } from '../components/PageShell';
import { Avatar } from '../components/Avatar';
import { fetchRemoteOpportunity, fetchRemoteStudents, RemoteStudent } from '../lib/api';
import { Loader2 } from 'lucide-react';

type OpportunityWithStatus = {
  id: string;
  title: string;
  org: string;
  category: string;
  summary: string;
  fields: string[];
  tags: string[];
  formatDesired: string[];
  updatedAt: string;
  status?: string;
};

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<OpportunityWithStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<RemoteStudent[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchRemoteOpportunity(id)
      .then((data) => {
        if (data) {
          setOpportunity({
            id: data.id,
            title: data.title,
            org: data.org,
            category: data.category as any,
            summary: (data as any).summary || 'Opportunity details coming soon.',
            fields: data.fields || [],
            tags: data.tags || [],
            formatDesired: data.desiredFormats || [],
            updatedAt: data.updatedAt || new Date().toISOString(),
            status: data.status,
          });
        }
      })
      .catch(() => setOpportunity(null))
      .finally(() => setLoading(false));
    fetchRemoteStudents().then((list) => setStudents(list)).catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <Card className="p-8 flex items-center gap-3 text-muted">
          <Loader2 size={18} className="animate-spin" /> Loading opportunity...
        </Card>
      </PageShell>
    );
  }

  if (!opportunity) {
    return (
      <PageShell>
        <Card className="p-8 text-center space-y-3">
          <p className="text-lg font-semibold">Opportunity not found</p>
          <button
            onClick={() => navigate('/opportunities')}
            className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold"
          >
            Back to opportunities
          </button>
        </Card>
      </PageShell>
    );
  }

  const featured = students.filter((s) => s.fields.some((f) => opportunity.fields.includes(f))).slice(0, 4);
  const updatedLabel = opportunity.updatedAt.includes('ago')
    ? opportunity.updatedAt
    : new Date(opportunity.updatedAt).toLocaleDateString();

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="orange">{opportunity.category}</Badge>
          <Badge tone="gray">Updated {updatedLabel}</Badge>
          {opportunity.status && <Badge tone="blue">{opportunity.status}</Badge>}
        </div>
          <h1 className="text-3xl font-bold clamp-2">{opportunity.title}</h1>
        <p className="text-lg text-muted clamp-1">{opportunity.org}</p>

        <Card className="p-5 space-y-3">
          <h3 className="text-lg font-semibold">Overview</h3>
          <p className="text-muted leading-relaxed clamp-3">{opportunity.summary}</p>
          <div className="flex flex-wrap gap-2">
            {opportunity.fields.map((f) => (
              <Badge key={f}>{f}</Badge>
            ))}
            {opportunity.tags.map((tag) => (
              <Badge key={tag} tone="blue">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5 space-y-3">
            <h3 className="text-lg font-semibold">Expectations</h3>
            <p className="text-muted leading-relaxed">
              Outline deliverables, cadence, and collaboration style. Keep it welcoming for students from all majors.
            </p>
            <div className="flex flex-wrap gap-2">
              {opportunity.formatDesired.map((f) => (
                <Badge key={f} tone="green">
                  {f}
                </Badge>
              ))}
            </div>
          </Card>
          <Card className="p-5 space-y-3">
            <h3 className="text-lg font-semibold">Formats desired</h3>
            <p className="text-muted leading-relaxed">These formats work best for review. Feel free to share adjacent work too.</p>
            <div className="flex flex-wrap gap-2">
              {opportunity.formatDesired.map((f) => (
                <Badge key={f}>{f}</Badge>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Featured students in this field</h3>
            <Link to="/students" className="text-sm font-semibold text-brand hover:underline">
              View all students
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((student) => (
              <Card key={student.id} className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar name={student.name} src={student.avatarUrl} size="sm" />
                  <div className="min-w-0">
                    <p className="font-semibold text-ink clamp-1">{student.name}</p>
                    <p className="text-xs text-muted clamp-1">{student.headline}</p>
                  </div>
                  <Badge tone="brand">{student.year}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {student.fields.slice(0, 2).map((f) => (
                    <Badge key={f}>{f}</Badge>
                  ))}
                  {student.strengths.slice(0, 2).map((s) => (
                    <Badge key={s} tone="blue">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 text-sm font-semibold">
                  <Link
                    to={`/students/${student.id}`}
                    className="button-focus flex-1 rounded-lg border border-border px-3 py-2 text-center hover:border-brand"
                  >
                    View Profile
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
};

export default OpportunityDetail;
