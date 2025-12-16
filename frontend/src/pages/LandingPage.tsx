import {
  ArrowRight,
  Compass,
  Palette,
  Play,
  Sparkles,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { featureBlocks, heroStats, projects } from '../data';

const LandingPage = () => {
  const spotlight = projects.slice(0, 3);

  return (
    <div className="container">
      <section className="hero">
        <div>
          <div className="pill" style={{ marginBottom: 12 }}>
            <Sparkles size={16} />
            Morgan State x Bearfolio preview
          </div>
          <h1>
            A brighter, story-led portfolio experience for Morgan State students who build and ship.
          </h1>
          <p>
            We rebuilt the interface to focus on narrative, craft, and momentum. Browse the new showcase,
            experiment with dashboard blocks, and imagine how your work feels when it is framed with intent.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/auth">
              <button className="btn primary">
                Start with Google
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/projects">
              <button className="btn ghost">
                Watch the flow
                <Play size={16} />
              </button>
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--muted)' }}>Portfolio quality</p>
                <h3 style={{ margin: '6px 0', fontFamily: 'var(--headline)' }}>Ready to ship</h3>
              </div>
              <div className="pill alt">New layout</div>
            </div>
            <div className="progress-line">
              <span />
            </div>
            <small>Live preview with recruiter-ready case study blocks.</small>
          </div>

          <div className="tile" style={{ marginTop: 14 }}>
            <h4>Showcase checklist</h4>
            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
              <li>Warm hero copy + proof points</li>
              <li>Artifacts pulled into one strip</li>
              <li>Timeline of decisions</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="stat-strip">
          {heroStats.map((stat) => (
            <div key={stat.label} className="stat">
              <strong>{stat.value}</strong>
              <span style={{ color: 'var(--muted)' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2>What feels new</h2>
            <p>
              Clarity and craft forward. We reduced noise, elevated storytelling, and paired everything with
              thoughtful signals recruiters actually want.
            </p>
          </div>
          <button className="btn ghost">
            Preview UI kit
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid three">
          {featureBlocks.map((block) => (
            <div key={block.title} className="card">
              <div className="pill" style={{ marginBottom: 12 }}>
                <Palette size={16} />
                Crafted
              </div>
              <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--headline)' }}>{block.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{block.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2>Student work, framed to impress</h2>
            <p>
              A tighter grid, better tags, and more breathing room. Each project card surfaces the story,
              collaborators, and status at a glance.
            </p>
          </div>
          <div className="pill">
            <Compass size={14} />
            curated set
          </div>
        </div>
        <div className="projects-grid">
          {spotlight.map((project) => (
            <div key={project.title} className="project-card">
              <img className="cover" src={project.cover} alt={project.title} />
              <div className="project-meta">
                <span className="pill alt">{project.stage}</span>
                <span>{project.stats}</span>
              </div>
              <h3 style={{ margin: '12px 0 6px', fontFamily: 'var(--headline)' }}>{project.title}</h3>
              <p style={{ margin: '0 0 8px', color: 'var(--muted)' }}>{project.summary}</p>
              <div className="badge-line">
                {project.tags.map((tag) => (
                  <span key={tag} className="pill" style={{ background: 'rgba(15, 23, 42, 0.05)', color: 'var(--ink)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2>Build with momentum</h2>
            <p>
              From first note to polished case study, the new flow keeps you moving. Guided prompts, a crisp
              review bar, and a predictable layout for every project.
            </p>
          </div>
          <div className="pill">
            <Target size={14} />
            3-step guide
          </div>
        </div>
        <div className="timeline">
          {[1, 2, 3].map((step) => (
            <div key={step} className="row">
              <div className="dot" />
              <div className="content">
                <strong style={{ display: 'block', fontFamily: 'var(--headline)' }}>
                  Step {step}: {step === 1 ? 'Frame the story' : step === 2 ? 'Show proof' : 'Publish and share'}
                </strong>
                <p style={{ margin: '6px 0 0', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {step === 1 && 'Lead with intent, audience, and constraints. Set the context recruiters crave.'}
                  {step === 2 && 'Pull in artifacts, decisions, and collaborators. Keep everything skimmable.'}
                  {step === 3 && 'Pick a cover, add tags, and push to the new showcase feed instantly.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="card highlight" style={{ padding: 26, display: 'grid', gap: 14 }}>
          <div className="pill" style={{ width: 'fit-content' }}>
            <Sparkles size={14} />
            Ready when you are
          </div>
          <h2 style={{ margin: 0, fontFamily: 'var(--headline)' }}>
            Build the portfolio you wish you had freshman year.
          </h2>
          <p style={{ margin: 0, color: 'var(--muted)', maxWidth: 760 }}>
            This redesign keeps the best of Bearfolio and doubles down on clarity. No back-end wiring yet—just a
            crisp UI you can react to and refine with the team.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn primary">Open the dashboard</button>
            <button className="btn ghost">Browse the feed</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
