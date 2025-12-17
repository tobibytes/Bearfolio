import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { PageShell } from '../components/PageShell';
import { SkeletonRow } from '../components/Skeleton';
import { Opportunity } from '../mock';
import { Filter, Search } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { fetchRemoteOpportunities, fetchRemotePortfolioItems, RemoteOpportunity, RemotePortfolioItem } from '../lib/api';

type OpportunityWithStatus = Opportunity & { status?: string };

const Opportunities = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [field, setField] = useState('');
  const [format, setFormat] = useState('');
  const [sort, setSort] = useState('Newest');
  const [loading, setLoading] = useState(false);
  const [remoteOpps, setRemoteOpps] = useState<OpportunityWithStatus[]>([]);
  const [remoteProjects, setRemoteProjects] = useState<RemotePortfolioItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), Math.random() * 400 + 400);
    return () => clearTimeout(t);
  }, [query, category, field, format, sort]);

  useEffect(() => {
    fetchRemoteOpportunities()
      .then((data) => {
        setRemoteOpps(
          data.map((o) => ({
            id: o.id,
            title: o.title,
            org: o.org,
            category: o.category as any,
            summary: (o as any).summary || 'Opportunity details coming soon.',
            fields: o.fields,
            tags: o.tags,
            formatDesired: o.desiredFormats,
            updatedAt: o.updatedAt,
            status: o.status,
          }))
        );
      })
      .catch(() => setError('Could not load opportunities.'));
    fetchRemotePortfolioItems()
      .then((items) => {
        setRemoteProjects(items);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = remoteOpps.filter((o) => {
      const matchesQuery =
        query.trim() === '' ||
        o.title.toLowerCase().includes(query.toLowerCase()) ||
        o.summary?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === '' || o.category === category;
      const matchesField = field === '' || o.fields.includes(field);
      const matchesFormat = format === '' || o.formatDesired.includes(format);
      return matchesQuery && matchesCategory && matchesField && matchesFormat;
    });
    if (sort === 'Newest') list = list.slice().reverse();
    if (sort === 'Name') list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [category, field, format, query, sort, remoteOpps]);

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Explore opportunities</h1>
          <p className="text-sm text-muted">Listings for research, design, writing, business, engineering, art, health, and more.</p>
        </div>

        <Card className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2">
              <Search size={16} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search opportunities"
                className="w-full text-sm outline-none"
              />
            </div>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-40">
              <option value="">Category</option>
              {Array.from(new Set(remoteOpps.map((o) => o.category))).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select value={field} onChange={(e) => setField(e.target.value)} className="w-40">
              <option value="">Field</option>
              {Array.from(new Set(remoteOpps.flatMap((o) => o.fields))).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
            <Select value={format} onChange={(e) => setFormat(e.target.value)} className="w-40">
              <option value="">Format desired</option>
              {Array.from(new Set(remoteOpps.flatMap((o) => o.formatDesired))).map((f) => (
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

        {error ? (
          <Card className="p-8 text-center text-sm text-red-600">{error}</Card>
        ) : loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-3">
                <SkeletonRow lines={4} />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted">No opportunities match those filters yet.</Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((opportunity) => (
              <Card key={opportunity.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold clamp-1">{opportunity.title}</h3>
                    <p className="text-sm text-muted clamp-1">{opportunity.org}</p>
                  </div>
                  <Badge tone="orange">{opportunity.category}</Badge>
                </div>
                <p className="text-sm text-muted leading-relaxed clamp-3">{opportunity.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {opportunity.fields.slice(0, 2).map((f) => (
                    <Badge key={f}>{f}</Badge>
                  ))}
                  {opportunity.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} tone="blue">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  {opportunity.formatDesired.slice(0, 3).map((f) => (
                    <Badge key={f} tone="green">
                      {f}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Updated {opportunity.updatedAt}</span>
                  <span className="inline-flex items-center gap-1">
                    <Filter size={14} /> {opportunity.tags.length} tags
                  </span>
                </div>
                <div className="flex gap-2 text-sm font-semibold">
                  <Link
                    to={`/opportunities/${opportunity.id}`}
                    className="button-focus flex-1 rounded-lg bg-ink px-3 py-2 text-center text-white hover:shadow-card"
                  >
                    View details
                  </Link>
                  <Link
                    to={`/students`}
                    className="button-focus flex-1 rounded-lg border border-border px-3 py-2 text-center hover:border-brand"
                  >
                    Discover students
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projects by students</h2>
            <Link to="/projects" className="text-sm font-semibold text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {remoteProjects.slice(0, 4).map((item) => {
              return (
                <Card key={item.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold clamp-1">{item.title}</h3>
                    <Badge tone="orange">{item.type}</Badge>
                  </div>
                  <p className="text-sm text-muted clamp-2">{item.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="clamp-1">{(item as any).profile?.name || 'Student'}</span>
                  </div>
                  <div className="flex gap-2 text-sm font-semibold">
                    <Link
                      to={`/projects/${item.id}`}
                      className="button-focus flex-1 rounded-lg border border-border px-3 py-2 text-center hover:border-brand"
                    >
                      View project
                    </Link>
                    { (item as any).profile?.id && (
                      <Link
                        to={`/students/${(item as any).profile.id}`}
                        className="button-focus flex-1 rounded-lg bg-ink px-3 py-2 text-center text-white hover:shadow-card"
                      >
                        View student
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Opportunities;
