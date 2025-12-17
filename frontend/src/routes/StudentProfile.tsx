import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Github, Globe, Linkedin, Mail, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { PortfolioItem, Student } from '../mock';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { Card } from '../components/Card';
import { fetchRemoteStudent, RemoteStudent } from '../lib/api';

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

const fallbackHero = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80';
const mapRemoteStudent = (remote: RemoteStudent): Student => {
  const links = (() => {
    try {
      return remote.linksJson ? JSON.parse(remote.linksJson) : {};
    } catch {
      return {};
    }
  })() as Student['links'];
  const skills = (() => {
    try {
      return remote.skillsJson ? JSON.parse(remote.skillsJson) : [];
    } catch {
      return [];
    }
  })() as Student['skills'];
  const portfolioItems = (remote.portfolioItems || []).map<PortfolioItem>((p) => ({
    id: p.id,
    studentId: remote.id,
    type: (p.type as any) || 'Software',
    title: p.title,
    summary: p.summary || 'Portfolio item summary coming soon.',
    tags: p.tags || [],
    updatedAt: p.updatedAt || new Date().toISOString(),
    heroImageUrl: p.heroImageUrl || fallbackHero,
    format: (p.format as any) || 'Report',
    detailTemplate: 'CaseStudy',
    links: [],
  }));
  return {
    id: remote.id,
    name: remote.name,
    headline: remote.headline || remote.bio.slice(0, 120) || 'Student at Morgan State University',
    bio: remote.bio || '',
    year: remote.year || 2025,
    location: remote.location || 'Baltimore, MD',
    avatarUrl: remote.avatarUrl || '',
    links: { github: '', linkedin: '', website: '', portfolio: '', email: '', ...links },
    strengths: remote.strengths || [],
    fields: remote.fields || [],
    interests: remote.interests || [],
    skills: skills || [],
    portfolioItems,
    featuredItemId: portfolioItems[0]?.id || '',
  };
};

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchRemoteStudent(id)
      .then((data) => {
        if (data) {
          setStudent(mapRemoteStudent(data));
        }
      })
      .catch(() => setStudent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <Card className="p-8 flex items-center gap-3 text-muted">
          <Loader2 size={18} className="animate-spin" /> Loading profile...
        </Card>
      </PageShell>
    );
  }

  if (!student) {
    return (
      <PageShell>
        <Card className="p-8 text-center space-y-3">
          <p className="text-lg font-semibold">Student not found</p>
          <button onClick={() => navigate('/students')} className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold">
            Back to students
          </button>
        </Card>
      </PageShell>
    );
  }

  const contactLinks = [
    student.links.linkedin && { icon: Linkedin, href: student.links.linkedin, label: 'LinkedIn' },
    student.links.website && { icon: Globe, href: student.links.website, label: 'Website' },
    student.links.portfolio && { icon: ExternalLink, href: student.links.portfolio, label: 'Portfolio' },
    student.links.email && { icon: Mail, href: `mailto:${student.links.email}`, label: 'Email' },
    student.links.github && { icon: Github, href: student.links.github, label: 'GitHub' },
  ].filter(Boolean) as { icon: typeof Globe; href: string; label: string }[];

  const skillsByCategory = useMemo(() => {
    return student.skills.reduce<Record<string, { name: string; level: string }[]>>((acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push({ name: skill.name, level: skill.level });
      return acc;
    }, {});
  }, [student.skills]);

  return (
    <PageShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={student.name} src={student.avatarUrl} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold clamp-1">{student.name}</h1>
                <Badge tone="brand">Class of {student.year}</Badge>
              </div>
              <p className="text-muted clamp-2">{student.headline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-1"><MapPin size={16} /> {student.location}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {contactLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="button-focus inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-ink hover:border-brand"
                  >
                    <Icon size={16} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <button className="button-focus inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white shadow-card hover:shadow-none">
            Contact
          </button>
        </div>

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
                    <p className="text-muted leading-relaxed">{student.bio}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted">
                      {student.fields.map((f) => (
                        <Badge key={f}>{f}</Badge>
                      ))}
                      {student.interests.map((i) => (
                        <Badge key={i} tone="blue">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <p className="text-muted text-sm">Morgan State University</p>
                    <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-ink">Class of {student.year}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {student.strengths.map((s) => (
                          <Badge key={s} tone="green">
                            {s}
                          </Badge>
                        ))}
                      </div>
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
                <div className="grid gap-4 md:grid-cols-2">
                  {student.portfolioItems.map((item) => (
                    <Card key={item.id} className="p-4 space-y-3">
                      <img src={item.heroImageUrl} alt={item.title} className="h-40 w-full rounded-lg object-cover" />
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold clamp-1">{item.title}</h3>
                        <Badge tone="orange">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-muted leading-relaxed clamp-2">{item.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="green">{item.format} {formatIcon(item.format)}</Badge>
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{item.updatedAt}</span>
                        <span>{item.links.length} links</span>
                      </div>
                      <div className="flex gap-2 text-sm font-semibold">
                        <Link
                          to={`/students/${student.id}/portfolio/${item.id}`}
                          className="button-focus flex-1 rounded-lg bg-ink px-3 py-2 text-center text-white hover:shadow-card"
                        >
                          View details
                        </Link>
                        <Link
                          to={`/opportunities`}
                          className="button-focus flex-1 rounded-lg border border-border px-3 py-2 text-center hover:border-brand"
                        >
                          Opportunities
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </PageShell>
  );
};

export default StudentProfile;
