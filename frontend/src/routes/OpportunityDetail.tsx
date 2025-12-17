import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { PageShell } from '../components/PageShell';
import { opportunities, students } from '../mock';

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const opportunity = opportunities.find((o) => o.id === id);

  if (!opportunity) {
    return (
      <PageShell>
        <Card className="p-8 text-center space-y-3">
          <p className="text-lg font-semibold">Opportunity not found</p>
          <button onClick={() => navigate('/opportunities')} className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold">
            Back to opportunities
          </button>
        </Card>
      </PageShell>
    );
  }

  const featured = students
    .filter((s) => s.fields.some((f) => opportunity.fields.includes(f)))
    .slice(0, 4);

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="orange">{opportunity.category}</Badge>
          <Badge tone="gray">Updated {opportunity.updatedAt}</Badge>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">{student.name}</p>
                    <p className="text-xs text-muted">{student.headline}</p>
                  </div>
                  <Badge tone="brand">{student.year}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {student.fields.map((f) => (
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
                  <Link
                    to={`/students/${student.id}/portfolio/${student.featuredItemId}`}
                    className="button-focus flex-1 rounded-lg bg-ink px-3 py-2 text-center text-white hover:shadow-card"
                  >
                    Portfolio
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
