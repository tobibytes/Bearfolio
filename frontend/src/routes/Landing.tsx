import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, LayoutTemplate, Users } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';

const typeCards = [
  'Software',
  'Research',
  'Design',
  'Writing',
  'Business',
  'Art',
  'Health',
  'Education',
];

const Landing = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();

  const handleBrowseType = (type: string) => {
    setParams({ type });
    navigate(`/students?type=${encodeURIComponent(type)}`);
  };

  return (
    <PageShell>
      <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand.soft px-3 py-1 text-sm font-semibold text-brand.dark">
            Built for every major at Morgan
          </div>
          <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Showcase work from software to studio art with one calm portfolio.
          </h1>
          <p className="text-lg text-muted">
            Bearfolio helps recruiters and mentors discover students across research, design, writing, business,
            engineering, health, and the arts.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link to="/students">
              <button className="button-focus inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-white shadow-card hover:shadow-none">
                Discover students
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/opportunities">
              <button className="button-focus inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-ink shadow-sm hover:border-brand">
                Browse opportunities
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand to-sky-500" />
            <div>
              <p className="text-sm font-semibold">Portfolio item cards</p>
              <p className="text-sm text-muted">Type badges, formats, and updated dates at a glance.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="p-3 bg-slate-50 border-dashed border-border">
              <p className="text-sm font-semibold">Featured work</p>
              <p className="text-xs text-muted">Type, format, and fields stay visible.</p>
            </Card>
            <Card className="p-3 bg-slate-50 border-dashed border-border">
              <p className="text-sm font-semibold">Opportunities</p>
              <p className="text-xs text-muted">Match students to listings by field.</p>
            </Card>
          </div>
        </Card>
      </section>

      <section className="mt-12 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Browse by portfolio type</h2>
          <p className="text-sm text-muted">Jump straight into the fields you care about.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {typeCards.map((type) => (
            <button
              key={type}
              onClick={() => handleBrowseType(type)}
              className="button-focus card-base flex items-center justify-between rounded-xl p-4 text-left hover:border-brand hover:shadow-card"
            >
              <div>
                <p className="text-base font-semibold">{type}</p>
                <p className="text-sm text-muted">See students with {type.toLowerCase()} work</p>
              </div>
              <ArrowRight size={18} className="text-muted" />
            </button>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        {[{
          title: 'Discover students',
          icon: Users,
          description: 'Filter by field, strengths, formats, and portfolio type.',
        },
        {
          title: 'Portfolio items',
          icon: LayoutTemplate,
          description: 'Case studies, research, creative galleries, and more.',
        },
        {
          title: 'Opportunities',
          icon: BookOpen,
          description: 'Listings for research, design, writing, business, art, and beyond.',
        }].map((feature) => (
          <Card key={feature.title} className="p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand.soft text-brand.dark">
              <feature.icon size={18} />
            </div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </section>
    </PageShell>
  );
};

export default Landing;
