import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { PageShell } from '../components/PageShell';
import { SkeletonRow } from '../components/Skeleton';
import { opportunities, students } from '../mock';
import { Filter, Search } from 'lucide-react';

const categories = Array.from(new Set(opportunities.map((o) => o.category)));
const fields = Array.from(new Set(opportunities.flatMap((o) => o.fields)));
const formats = Array.from(new Set(opportunities.flatMap((o) => o.formatDesired)));

const Opportunities = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [field, setField] = useState('');
  const [format, setFormat] = useState('');
  const [sort, setSort] = useState('Newest');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), Math.random() * 400 + 400);
    return () => clearTimeout(t);
  }, [query, category, field, format, sort]);

  const filtered = useMemo(() => {
    let list = opportunities.filter((o) => {
      const matchesQuery =
        query.trim() === '' ||
        o.title.toLowerCase().includes(query.toLowerCase()) ||
        o.summary.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === '' || o.category === category;
      const matchesField = field === '' || o.fields.includes(field);
      const matchesFormat = format === '' || o.formatDesired.includes(format);
      return matchesQuery && matchesCategory && matchesField && matchesFormat;
    });
    if (sort === 'Newest') list = list.slice().reverse();
    if (sort === 'Name') list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [category, field, format, query, sort]);

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
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select value={field} onChange={(e) => setField(e.target.value)} className="w-40">
              <option value="">Field</option>
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
            <Select value={format} onChange={(e) => setFormat(e.target.value)} className="w-40">
              <option value="">Format desired</option>
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
                  {opportunity.fields.map((f) => (
                    <Badge key={f}>{f}</Badge>
                  ))}
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} tone="blue">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  {opportunity.formatDesired.map((f) => (
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
      </div>
    </PageShell>
  );
};

export default Opportunities;
