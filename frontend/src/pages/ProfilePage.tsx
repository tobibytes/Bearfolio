import { Briefcase, MapPin, Share2 } from 'lucide-react';
import { profile, projects } from '../data';

const ProfilePage = () => {
  const featured = projects.slice(0, 2);

  return (
    <div className="container">
      <section className="section-header" style={{ marginTop: 32 }}>
        <div>
          <h2>Profile preview</h2>
          <p>A more intentional student profile. Big banner energy, crisp skill stacks, and a tight highlight reel.</p>
        </div>
        <span className="pill">
          <Share2 size={14} />
          shareable
        </span>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="profile-banner">
          <div className="avatar">JC</div>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--headline)' }}>{profile.name}</h3>
            <p style={{ margin: '6px 0', color: '#e0f2fe' }}>{profile.title}</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#d1fae5' }}>
              <MapPin size={16} /> {profile.location}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="grid two">
          <div className="card" style={{ display: 'grid', gap: 10 }}>
            <div className="project-meta" style={{ marginBottom: 6 }}>
              <span className="pill alt">About</span>
              <span style={{ color: 'var(--muted)' }}>Cohort 2025</span>
            </div>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{profile.bio}</p>
            <div className="badge-line">
              {profile.skills.map((skill) => (
                <span key={skill} className="pill" style={{ background: 'rgba(15, 23, 42, 0.05)', color: 'var(--ink)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <div className="project-meta" style={{ marginBottom: 6 }}>
              <span className="pill">Highlights</span>
              <span style={{ color: 'var(--muted)' }}>Pinned</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: 'var(--muted)' }}>
              {profile.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button className="btn ghost" style={{ width: 'fit-content' }}>
              Copy profile link
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2>Projects on deck</h2>
            <p>Feature just the right work. Two strong case studies beat ten busy ones.</p>
          </div>
          <span className="pill alt">
            <Briefcase size={14} />
            2 live
          </span>
        </div>
        <div className="projects-grid">
          {featured.map((project) => (
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
    </div>
  );
};

export default ProfilePage;
