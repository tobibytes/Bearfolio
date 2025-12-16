import { Filter, PanelsTopLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { filters, projects } from '../data';

const ProjectsPage = () => {
  const selectedFocus = filters.focus[0];
  const selectedTimeline = filters.timeline[0];

  return (
    <div className="container">
      <section className="section-header" style={{ marginTop: 32 }}>
        <div>
          <h2>Projects feed</h2>
          <p>
            The redesigned feed leans on generous spacing and tags so recruiters can scan quickly. Filters sit on
            a clean rail up top.
          </p>
        </div>
        <span className="pill">
          <PanelsTopLeft size={14} />
          preview state
        </span>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div className="project-meta">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Filter size={16} />
              <strong>Filters</strong>
            </div>
            <span style={{ color: 'var(--muted)' }}>Static UI — pick anything</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {filters.focus.map((item) => (
              <span
                key={item}
                className="pill"
                style={{
                  background: item === selectedFocus ? 'rgba(15, 118, 110, 0.18)' : 'rgba(15, 23, 42, 0.05)',
                  color: item === selectedFocus ? 'var(--ink)' : 'var(--muted)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {filters.timeline.map((item) => (
              <span
                key={item}
                className="pill alt"
                style={{
                  background: item === selectedTimeline ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.12)',
                  color: '#92400e',
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filters.format.map((item) => (
              <span key={item} className="pill" style={{ background: 'rgba(14, 165, 233, 0.12)', color: '#075985' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2>Recruiter-ready cards</h2>
            <p>Less clutter, more context. Covers, tags, and status are front and center.</p>
          </div>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <Link key={project.slug} to={`/projects/${project.slug}`} style={{ color: 'inherit' }}>
              <div className="project-card">
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
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="card highlight" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="pill" style={{ marginBottom: 8 }}>
              <Sparkles size={14} />
              Showcase CTA
            </div>
            <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--headline)' }}>Add your latest build</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              The feed will stack new projects with generous covers and tidy metadata.
            </p>
          </div>
          <button className="btn primary">Mock publish</button>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
