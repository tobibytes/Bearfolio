import { Link, useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const skillsByCategory = user.skills.reduce<Record<string, { name: string; level: string }[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push({ name: skill.name, level: skill.level });
    return acc;
  }, {});

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
                <div className="grid gap-4 md:grid-cols-2">
                  {user.portfolioItems.map((item) => (
                    <Card key={item.id} className="p-4 space-y-3">
                      <img src={item.heroImageUrl} alt={item.title} className="h-40 w-full rounded-lg object-cover" />
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold clamp-1">{item.title}</h3>
                        <Badge tone="orange">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-muted leading-relaxed clamp-2">{item.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="green">
                          {item.format}
                        </Badge>
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 text-sm font-semibold">
                        <Link
                          to={`/students/${user.id}/portfolio/${item.id}`}
                          className="button-focus flex-1 rounded-lg bg-ink px-3 py-2 text-center text-white hover:shadow-card"
                        >
                          View details
                        </Link>
                        <Link
                          to={`/projects/${item.id}`}
                          className="button-focus flex-1 rounded-lg border border-border px-3 py-2 text-center hover:border-brand"
                        >
                          Project view
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

export default Profile;
