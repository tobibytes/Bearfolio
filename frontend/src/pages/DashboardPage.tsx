import { CalendarClock, CheckCircle, Rocket } from 'lucide-react';
import { focusItems, heroStats, projects, timeline } from '../data';

const DashboardPage = () => {
  const dashboardProjects = projects.slice(0, 4);

  return (
    <div className="container">
      <section className="section-header" style={{ marginTop: 32 }}>
        <div>
          <h2>Dashboard preview</h2>
          <p>
            A calmer control center with clearer calls to action. Everything you need to keep moving: stats,
            prompts, and a pulse on your latest work.
          </p>
        </div>
        <span className="pill">
          <Rocket size={14} />
          morning view
        </span>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="card highlight" style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: 'var(--muted)' }}>Welcome back</p>
              <h3 style={{ margin: '6px 0', fontFamily: 'var(--headline)' }}>Jade, ready to present?</h3>
            </div>
            <span className="pill alt" aria-hidden>
              Next milestone · Friday
            </span>
          </div>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Keep polishing Transit Pulse, or jump into a new case study template. Built for Morgan State students—your
            work-in-progress items live side by side with recruiter updates.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 32 }}>
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
            <h2>Guided focus</h2>
            <p>Small nudges keep the dashboard actionable. No more wondering what to do next.</p>
          </div>
        </div>
        <div className="grid three">
          {focusItems.map((item) => (
            <div key={item.title} className="card">
              <div className="pill" style={{ marginBottom: 8 }}>
                <CheckCircle size={14} />
                priority
              </div>
              <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--headline)' }}>{item.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.5 }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2>In-progress projects</h2>
            <p>Track the stories you are shaping. These cards focus on outcomes and collaborators.</p>
          </div>
        </div>
        <div className="projects-grid">
          {dashboardProjects.map((project) => (
            <div key={project.title} className="project-card">
              <img src={project.cover} alt={project.title} className="cover" />
              <div className="project-meta">
                <span className="pill alt">{project.stage}</span>
                <span>{project.owner}</span>
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
            <h2>Activity timeline</h2>
            <p>See everything that matters without digging. Time-stamped and grouped by momentum.</p>
          </div>
          <span className="pill">
            <CalendarClock size={14} />
            weekly pulse
          </span>
        </div>
        <div className="timeline">
          {timeline.map((item) => (
            <div key={item.title} className="row">
              <div className="dot" />
              <div className="content">
                <div className="project-meta" style={{ marginBottom: 6 }}>
                  <strong style={{ fontFamily: 'var(--headline)' }}>{item.title}</strong>
                  <span>{item.when}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--muted)' }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
