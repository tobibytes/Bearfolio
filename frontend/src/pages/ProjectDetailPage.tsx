import { Calendar, ExternalLink, Users } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects, timeline } from '../data';

const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = useMemo(
    () => projects.find((p) => p.slug === slug) ?? projects[0],
    [slug]
  );

  return (
    <div className="container">
      <section className="section-header" style={{ marginTop: 32 }}>
        <div>
          <h2>{project.title}</h2>
          <p>
            A detail view with more breathing room and a stronger hero. Perfect for walking a recruiter through
            the decisions that matter.
          </p>
        </div>
        <span className="pill alt">Case study shell</span>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="card highlight" style={{ padding: 0, overflow: 'hidden' }}>
          <img src={project.cover} alt={project.title} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
          <div style={{ padding: 22, display: 'grid', gap: 8 }}>
            <div className="project-meta">
              <span className="pill">{project.stage}</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--muted)' }}>
                <Users size={16} /> {project.owner}
              </div>
            </div>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{project.summary}</p>
            <div className="badge-line">
              {project.tags.map((tag) => (
                <span key={tag} className="pill" style={{ background: 'rgba(15, 23, 42, 0.05)', color: 'var(--ink)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 32 }}>
        <div className="grid two">
          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <div className="project-meta">
              <span className="pill alt">Story</span>
              <span>
                <Calendar size={14} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: 6 }}>Sprint window</span>
              </span>
            </div>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
              We focused on tightening the entry experience: faster filters, clearer CTAs, and a confident hero
              that lets the story lead. Imagery sits on generous padding with softer gradients and distinct
              metadata chips.
            </p>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
              This detail layout keeps the essentials visible without scrolling: headline, summary, tags, and
              collaborator callouts. Everything else flows under a breathable rhythm with cards you can remix.
            </p>
          </div>

          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <div className="project-meta">
              <span className="pill">Key signals</span>
              <span style={{ color: 'var(--muted)' }}>Static for now</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: 'var(--muted)' }}>
              <li>Outcome metrics displayed beside the hero</li>
              <li>Artifacts pulled into one concise rail</li>
              <li>Clear collaborator strip with roles</li>
              <li>Inline milestones for a skim-friendly read</li>
            </ul>
            <Link to="/projects">
              <button className="btn ghost" style={{ width: 'fit-content' }}>
                Back to projects
                <ExternalLink size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2>Milestones</h2>
            <p>Attach decisions and artifacts to moments. Keep readers oriented.</p>
          </div>
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

export default ProjectDetailPage;
