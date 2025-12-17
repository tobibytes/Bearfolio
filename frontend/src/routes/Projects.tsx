import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Avatar } from '../components/Avatar';
import { PageShell } from '../components/PageShell';
import { SkeletonRow } from '../components/Skeleton';
import { portfolioItems, students, PortfolioItemType } from '../mock';
import { Filter, Search } from 'lucide-react';

const types: PortfolioItemType[] = ['Software', 'Research', 'Design', 'Writing', 'Business', 'Engineering', 'Art', 'Health', 'Education', 'Community'];
const formats = ['Paper', 'Poster', 'Deck', 'Video', 'Prototype', 'Gallery', 'Code', 'Report'];

const Projects = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [format, setFormat] = useState('');
  const [sort, setSort] = useState('Newest');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), Math.random() * 400 + 400);
    return () => clearTimeout(t);
  }, [query, type, format, sort]);

  const filtered = useMemo(() => {
    let list = portfolioItems.filter((p) => {
      const matchesQuery =
        query.trim() === '' ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.summary.toLowerCase().includes(query.toLowerCase());
      const matchesType = type === '' || p.type === type;
      const matchesFormat = format === '' || p.format === format;
      return matchesQuery && matchesType && matchesFormat;
    });
    if (sort === 'Newest') list = list.slice().reverse();
    if (sort === 'Name') list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [format, query, sort, type]);

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Projects & portfolio items</h1>
          <p className="text-sm text-muted">Browse work across every major with type and format filters.</p>
        </div>

        <Card className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2">
              <Search size={16} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects"
                className="w-full text-sm outline-none"
              />
            </div>
            <Select value={type} onChange={(e) => setType(e.target.value)} className="w-40">
              <option value="">Type</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Select value={format} onChange={(e) => setFormat(e.target.value)} className="w-40">
              <option value="">Format</option>
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-32">
              <option value="Newest">Newest</option>
              <option value="Name">Name</option>
            </Select>
          </div>
        </Card>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-3">
                <SkeletonRow lines={4} />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted">No projects match those filters yet.</Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => {
              const owner = students.find((s) => s.id === item.studentId);
              return (
                <Card key={item.id} className="p-4 space-y-3">
                  <img src={item.heroImageUrl} alt={item.title} className="h-40 w-full rounded-lg object-cover" />
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted clamp-2">{item.summary}</p>
                    </div>
                    <Badge tone="orange">{item.type}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="green">{item.format}</Badge>
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted">
                    <div className="flex items-center gap-2">
                      {owner && <Avatar name={owner.name} src={owner.avatarUrl} size="sm" />}
                      <span className="clamp-1">{owner?.name}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Filter size={14} /> {item.updatedAt}
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm font-semibold">
                    <Link
                      to={`/projects/${item.id}`}
                      className="button-focus flex-1 rounded-lg bg-ink px-3 py-2 text-center text-white hover:shadow-card"
                    >
                      View details
                    </Link>
                    <Link
                      to={`/students/${item.studentId}`}
                      className="button-focus flex-1 rounded-lg border border-border px-3 py-2 text-center hover:border-brand"
                    >
                      View owner
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Projects;
