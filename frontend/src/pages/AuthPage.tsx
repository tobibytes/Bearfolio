import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';

const AuthPage = () => {
  return (
    <div className="container">
      <section className="section-header" style={{ marginTop: 32 }}>
        <div>
          <h2>Auth flow mock</h2>
          <p>Single-sign on with Google for Morgan State students. Static for now—just the look and feel.</p>
        </div>
        <span className="pill">
          <LockKeyhole size={14} />
          secure by design
        </span>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="form-card">
          <div className="card highlight" style={{ display: 'grid', gap: 12 }}>
            <div className="pill" style={{ width: 'fit-content' }}>
              <Sparkles size={14} />
              Morgan SSO coming soon
            </div>
            <h3 style={{ margin: 0, fontFamily: 'var(--headline)' }}>Faster onboarding</h3>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
              Connect with your @morgan.edu account and skip passwords. We will wire this to Google sign-in;
              until then, this is a UI preview you can react to.
            </p>
            <div className="tile">
              <h4 style={{ margin: '0 0 6px' }}>Magic link</h4>
              <p style={{ margin: 0, color: '#cbd5e1' }}>
                Optional fallback for guests—kept here as a visual note.
              </p>
            </div>
          </div>

          <div className="card" style={{ display: 'grid', gap: 20, alignContent: 'center' }}>
            <div className="project-meta" style={{ marginBottom: 4 }}>
              <span className="pill alt">Sign in</span>
              <span style={{ color: 'var(--muted)' }}>Google only</span>
            </div>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
              Use your Morgan State Google account to sign in. This button is decorative for now—hook it up to
              Google OAuth when ready.
            </p>
            <button
              type="button"
              className="btn primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <span
                style={{
                  background: '#fff',
                  color: '#ea4335',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 12,
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
                }}
              >
                G
              </span>
              <span style={{ flex: 1, textAlign: 'center' }}>Sign in with Google</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;
