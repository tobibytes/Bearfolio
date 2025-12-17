import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, Users } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { portfolioItems, students } from '../mock';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = portfolioItems.find((p) => p.id === id);

  if (!item) {
    return (
      <PageShell>
        <Card className="p-8 text-center space-y-3">
          <p className="text-lg font-semibold">Project not found</p>
          <button onClick={() => navigate('/projects')} className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold">
            Back to projects
          </button>
        </Card>
      </PageShell>
    );
  }

  const owner = students.find((s) => s.id === item.studentId);
  const featured = [owner, ...students.filter((s) => s.id !== item.studentId)].slice(0, 3).filter(Boolean);

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="orange">{item.type}</Badge>
          <Badge tone="gray">Updated {item.updatedAt}</Badge>
        </div>
        <h1 className="text-3xl font-bold clamp-2">{item.title}</h1>
        <p className="text-lg text-muted clamp-3">{item.summary}</p>
        <img src={item.heroImageUrl} alt={item.title} className="h-72 w-full rounded-xl object-cover" />

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

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Owner</h3>
            <Link to={`/students/${item.studentId}`} className="text-sm font-semibold text-brand hover:underline">
              View profile
            </Link>
          </div>
          {owner && (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 px-3 py-2">
              <Avatar name={owner.name} src={owner.avatarUrl} />
              <div className="min-w-0">
                <p className="font-semibold clamp-1">{owner.name}</p>
                <p className="text-sm text-muted clamp-1">{owner.headline}</p>
              </div>
            </div>
          )}
          <button className="button-focus inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-brand">
            <ExternalLink size={16} /> View portfolio item
          </button>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted">
            <Users size={16} /> Featured students
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {featured.map((student) => (
              <Card key={student!.id} className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar name={student!.name} src={student!.avatarUrl} />
                  <div className="min-w-0">
                    <p className="font-semibold text-ink clamp-1">{student!.name}</p>
                    <p className="text-xs text-muted clamp-1">{student!.headline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {student!.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill.name}>{skill.name}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
};

export default ProjectDetail;
