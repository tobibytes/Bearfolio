import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Avatar } from '../components/Avatar';
import { PageShell } from '../components/PageShell';
import { SkeletonRow } from '../components/Skeleton';
import { PortfolioItemType, students } from '../mock';
import { Calendar, Filter, Sparkles } from 'lucide-react';

const typeList: PortfolioItemType[] = ['Software', 'Research', 'Design', 'Writing', 'Business', 'Engineering', 'Art', 'Health', 'Education', 'Community'];
const formats = ['Paper', 'Poster', 'Deck', 'Video', 'Prototype', 'Gallery', 'Code', 'Report'];

const Students = () => {
  const [params] = useSearchParams();
  const initialType = params.get('type');

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>(initialType ? [initialType] : []);
  const [fieldFilter, setFieldFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [yearFilter, setYearFilter] = useState<number | ''>('');
  const [sort, setSort] = useState('Most recent');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const delay = Math.random() * 400 + 400; // 400-800ms
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [query, typeFilter, fieldFilter, formatFilter, yearFilter, sort]);

  const years = useMemo(() => Array.from(new Set(students.map((s) => s.year))).sort(), []);
  const fields = useMemo(() => Array.from(new Set(students.flatMap((s) => s.fields))), []);

  const filtered = useMemo(() => {
    return students
      .map((student) => {
        const featured = student.portfolioItems.find((i) => i.id === student.featuredItemId) || student.portfolioItems[0];
        const latestUpdated = student.portfolioItems.reduce((acc, item) => {
          const days = parseInt(item.updatedAt);
          return isNaN(days) ? acc : Math.min(acc, days);
        }, 999);
        return { student, featured, latestUpdated };
      })
      .filter(({ student, featured }) => {
        const matchesQuery =
          query.trim() === '' ||
          student.name.toLowerCase().includes(query.toLowerCase()) ||
          student.bio.toLowerCase().includes(query.toLowerCase()) ||
          student.portfolioItems.some((item) => item.title.toLowerCase().includes(query.toLowerCase()));

        const matchesType =
          typeFilter.length === 0 ||
          student.portfolioItems.some((item) => typeFilter.includes(item.type));

        const matchesField = fieldFilter === '' || student.fields.includes(fieldFilter);
        const matchesFormat =
          formatFilter === '' || student.portfolioItems.some((item) => item.format === formatFilter);
        const matchesYear = yearFilter === '' || student.year === yearFilter;
        return matchesQuery && matchesType && matchesField && matchesFormat && matchesYear && Boolean(featured);
      })
      .sort((a, b) => {
        if (sort === 'Name') return a.student.name.localeCompare(b.student.name);
        if (sort === 'Most items') return b.student.portfolioItems.length - a.student.portfolioItems.length;
        return a.latestUpdated - b.latestUpdated; // Most recent (smallest days)
      });
  }, [fieldFilter, formatFilter, query, sort, typeFilter, yearFilter]);

  const toggleType = (type: string) => {
    setTypeFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const clearFilters = () => {
    setQuery('');
    setTypeFilter([]);
    setFieldFilter('');
    setFormatFilter('');
    setYearFilter('');
    setSort('Most recent');
  };

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-4">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Sparkles size={16} className="text-brand" />
            </div>
            <Input
              placeholder="Search students or work"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search students"
            />
            <div>
              <p className="mb-2 text-sm font-semibold text-muted">Portfolio type</p>
              <div className="flex flex-wrap gap-2">
                {typeList.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`button-focus rounded-full border px-3 py-1 text-sm font-semibold transition ${
                      typeFilter.includes(type)
                        ? 'border-brand bg-brand.soft text-brand.dark'
                        : 'border-border bg-white text-ink hover:border-brand'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted">Field</p>
              <Select value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)}>
                <option value="">Any field</option>
                {fields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted">Format</p>
              <Select value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)}>
                <option value="">Any format</option>
                {formats.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted">Graduation year</p>
              <Select value={yearFilter} onChange={(e) => setYearFilter(e.target.value === '' ? '' : Number(e.target.value))}>
                <option value="">Any year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted">Sort</p>
              <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="Most recent">Most recent</option>
                <option value="Most items">Most items</option>
                <option value="Name">Name</option>
              </Select>
            </div>
            <button onClick={clearFilters} className="button-focus w-full rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-brand">
              Clear filters
            </button>
          </Card>
        </aside>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">Discover students</h1>
              <p className="text-sm text-muted clamp-2">Browse portfolios across every major.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Filter size={16} /> {filtered.length} students
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4 space-y-3">
                  <SkeletonRow lines={5} />
                  <SkeletonRow lines={2} />
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="p-8 space-y-3 text-center">
              <p className="text-lg font-semibold">No students match those filters yet.</p>
              <button
                onClick={clearFilters}
                className="button-focus inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink hover:border-brand"
              >
                Clear filters
              </button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map(({ student, featured }) => (
                <Card key={student.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar name={student.name} src={student.avatarUrl} />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <Link to={`/students/${student.id}`} className="text-lg font-semibold hover:text-brand">
                          <span className="clamp-1">{student.name}</span>
                        </Link>
                        <Badge tone="brand">{student.year}</Badge>
                      </div>
                      <p className="text-sm text-muted clamp-2">{student.headline}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted">
                        {student.fields.map((f) => (
                          <Badge key={f}>{f}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {student.strengths.slice(0, 3).map((s) => (
                      <Badge key={s} tone="blue">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  {featured && (
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-semibold text-ink clamp-1">Featured: {featured.title}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                          <Badge tone="orange">{featured.type}</Badge>
                          <Badge tone="green">{featured.format}</Badge>
                          <span>{featured.updatedAt}</span>
                        </div>
                      </div>
                      <Calendar size={16} className="text-muted" />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{student.portfolioItems.length} portfolio items</span>
                    <span>Updated recently</span>
                  </div>
                  <div className="flex gap-2 text-sm font-semibold">
                    <Link
                      to={`/students/${student.id}`}
                      className="button-focus flex-1 rounded-lg border border-border bg-white px-3 py-2 text-center hover:border-brand"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/students/${student.id}/portfolio/${featured?.id || student.portfolioItems[0]?.id}`}
                      className="button-focus flex-1 rounded-lg bg-ink px-3 py-2 text-center text-white hover:shadow-card"
                    >
                      View Portfolio
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
};

export default Students;
