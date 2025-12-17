import { Plus, Save, Settings, User, FileText, Send } from 'lucide-react';
import { Card } from './components/Card';
import { Badge } from './components/Badge';
import { Input, TextArea } from './components/Input';
import { opportunities, profile } from './mock';

const App = () => {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-brand to-sky-500" />
            Bearfolio Admin
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button className="button-focus inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 font-semibold text-ink shadow-sm hover:border-brand">
              <Settings size={16} />
              Settings
            </button>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              <User size={16} />
              <span className="font-semibold clamp-1">{profile.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <section className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted">Profile</p>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-sm text-muted">{profile.role}</p>
              </div>
              <Badge tone="brand">Admin</Badge>
            </div>
            <div className="text-sm text-muted">{profile.email}</div>
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              <Badge tone="green">Can publish</Badge>
              <Badge tone="amber">Drafts auto-save</Badge>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">New opportunity</h3>
              <Badge tone="amber">Draft</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-muted" htmlFor="title">Title</label>
                <Input id="title" placeholder="Opportunity title" />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted" htmlFor="org">Organization</label>
                <Input id="org" placeholder="Org name" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-muted" htmlFor="category">Category</label>
                  <Input id="category" placeholder="Design, Research, Health..." />
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted" htmlFor="formats">Formats</label>
                  <Input id="formats" placeholder="Report, Deck" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-muted" htmlFor="summary">Summary</label>
                <TextArea id="summary" placeholder="Short overview" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              <button className="button-focus inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-ink hover:border-brand">
                <Save size={16} />
                Save draft
              </button>
              <button className="button-focus inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-white shadow-card hover:shadow-none">
                <Send size={16} />
                Publish (UI only)
              </button>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Current opportunities</h2>
            <button className="button-focus inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-brand">
              <Plus size={16} /> New opportunity
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {opportunities.map((opp) => (
              <Card key={opp.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-muted">{opp.org}</p>
                    <h3 className="text-lg font-semibold clamp-1">{opp.title}</h3>
                  </div>
                  <Badge tone={opp.status === 'Published' ? 'green' : 'amber'}>{opp.status}</Badge>
                </div>
                <p className="text-sm text-muted clamp-2">{opp.summary}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  <Badge tone="gray">{opp.category}</Badge>
                  {opp.fields.slice(0, 2).map((f) => (
                    <Badge key={f}>{f}</Badge>
                  ))}
                  {opp.formats.slice(0, 2).map((f) => (
                    <Badge key={f} tone="green">
                      {f}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Updated {opp.updatedAt}</span>
                  <span className="inline-flex items-center gap-1"><FileText size={14} /> Draft tools</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
