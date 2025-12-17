import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Student, PortfolioItem } from '../mock';
import { fetchRemoteStudents, RemoteStudent, fetchMyProfile, API_BASE } from '../lib/api';

type AuthContextValue = {
  user: Student | null;
  onboarded: boolean;
  token: string | null;
  signIn: (id?: string) => { user: Student | null; onboarded: boolean };
  signInWithGoogle: () => Promise<{ user: Student | null; onboarded: boolean }>;
  signOut: () => void;
  completeOnboarding: () => void;
  updateUser: (partial: Partial<Student>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const overrideKey = (id: string) => `bearfolio_user_override_${id}`;
const onboardKey = (id: string) => `bearfolio_onboarded_${id}`;

const mapRemoteStudent = (remote: RemoteStudent): Student => {
  const links = (() => {
    try {
      return remote.linksJson ? JSON.parse(remote.linksJson) : {};
    } catch {
      return {};
    }
  })() as Student['links'];
  const skills = (() => {
    try {
      return remote.skillsJson ? JSON.parse(remote.skillsJson) : [];
    } catch {
      return [];
    }
  })() as Student['skills'];
  const portfolioItems = (remote.portfolioItems || []).map<PortfolioItem>((p) => ({
    id: p.id,
    studentId: remote.id,
    type: (p.type as any) || 'Software',
    title: p.title,
    summary: p.summary || 'Portfolio item summary coming soon.',
    tags: p.tags || [],
    updatedAt: p.updatedAt || new Date().toISOString(),
    heroImageUrl: p.heroImageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    format: (p.format as any) || 'Report',
    detailTemplate: 'CaseStudy',
    links: [],
  }));
  return {
    id: remote.id,
    name: remote.name,
    headline: remote.headline || remote.bio.slice(0, 120) || 'Student at Morgan State University',
    bio: remote.bio || '',
    year: remote.year || 2025,
    location: remote.location || 'Baltimore, MD',
    avatarUrl: remote.avatarUrl || '',
    links: { github: '', linkedin: '', website: '', portfolio: '', email: '', ...links },
    strengths: remote.strengths || [],
    fields: remote.fields || [],
    interests: remote.interests || [],
    skills: skills || [],
    portfolioItems,
    featuredItemId: portfolioItems[0]?.id || '',
  };
};

const mergeUser = (base: Student, override?: Partial<Student>): Student => {
  return {
    ...base,
    ...override,
    strengths: override?.strengths ?? base.strengths,
    fields: override?.fields ?? base.fields,
    interests: override?.interests ?? base.interests,
    skills: override?.skills ?? base.skills,
    portfolioItems: override?.portfolioItems ?? base.portfolioItems,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Partial<Student> | undefined>(undefined);
  const [onboarded, setOnboarded] = useState(false);
  const [remoteStudents, setRemoteStudents] = useState<Student[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('bearfolio_user');
    if (stored) {
      setUserId(stored);
      const ov = localStorage.getItem(overrideKey(stored));
      if (ov) setOverrides(JSON.parse(ov));
    }
    fetchMyProfile()
      .then((me) => {
        if (me) {
          const mapped = mapRemoteStudent(me as any);
          setProfileId(me.id);
          setOverrides(mapped);
          setUserId(mapped.id);
          setOnboarded(me.onboarded || false);
          localStorage.setItem('bearfolio_user', mapped.id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchRemoteStudents()
      .then((list) => setRemoteStudents(list.map(mapRemoteStudent)))
      .catch(() => setRemoteStudents([]));
  }, []);

  const allStudents = useMemo(() => remoteStudents, [remoteStudents]);
  const baseUser = useMemo(() => {
    if (!userId) return null;
    return allStudents.find((s) => s.id === userId) || null;
  }, [allStudents, userId]);
  const user = useMemo(() => (baseUser ? mergeUser(baseUser, overrides) : null), [baseUser, overrides]);

  const signIn = (id?: string) => {
    const target = id || allStudents[0]?.id;
    if (target) {
      setUserId(target);
      localStorage.setItem('bearfolio_user', target);
      const ovRaw = localStorage.getItem(overrideKey(target));
      const ov = ovRaw ? JSON.parse(ovRaw) : undefined;
      setOverrides(ov);
      const found = allStudents.find((s) => s.id === target) || null;
      fetchMyProfile()
        .then((me) => setOnboarded(me?.onboarded || false))
        .catch(() => setOnboarded(Boolean(localStorage.getItem(onboardKey(target)))));
      return { user: found ? mergeUser(found, ov) : null, onboarded };
    }
    return { user: null, onboarded: false };
  };

  const decodeJwt = (token: string) => {
    const [, payload] = token.split('.');
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json as { email?: string; name?: string; picture?: string; sub?: string };
  };

  const signInWithGoogle = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('Missing VITE_GOOGLE_CLIENT_ID');
      return { user: null, onboarded: false };
    }
    if (!(window as any).google?.accounts?.id) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Identity'));
        document.head.appendChild(script);
      });
    }

    return await new Promise<{ user: Student | null; onboarded: boolean }>((resolve) => {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          const cred = response.credential;
          const decoded = decodeJwt(cred);
          const generatedId = decoded.sub || decoded.email || `google-${Date.now()}`;
          fetch(`${API_BASE}/auth/exchange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idToken: cred }),
          })
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error('exchange_failed'))))
            .then((resp) => {
              const mapped: Student = {
                id: generatedId,
                name: decoded.name || decoded.email || 'Student',
                headline: 'Student at Morgan State University',
                bio: '',
                year: 2025,
                location: 'Baltimore, MD',
                avatarUrl: decoded.picture || '',
                links: { email: decoded.email, github: '', linkedin: '', website: '', portfolio: '' },
                strengths: [],
                fields: [],
                interests: [],
                skills: [],
                portfolioItems: [],
                featuredItemId: '',
              };
              setUserId(generatedId);
              localStorage.setItem('bearfolio_user', generatedId);
              setOverrides(mapped);
              
              fetchMyProfile().then((me) => {
                if (me) {
                  const mappedMe = mapRemoteStudent(me as any);
                  setOverrides(mappedMe);
                  setUserId(mappedMe.id);
                  setProfileId(me.id);
                  setOnboarded(me.onboarded || false);
              resolve({ user: mappedMe, onboarded: me.onboarded || false });
            } else {
              setOnboarded(false);
              resolve({ user: mapped, onboarded: false });
            }
          }).catch(() => {
                setOnboarded(false);
                resolve({ user: mapped, onboarded: false });
              });
            })
            .catch(() => resolve({ user: null, onboarded: false }));
        },
      });
      (window as any).google.accounts.id.prompt();
    });
  };

  const signOut = () => {
    setUserId(null);
    setOverrides(undefined);
    setOnboarded(false);
    localStorage.removeItem('bearfolio_user');
    fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
  };

  const completeOnboarding = () => {
    if (!userId) return;
    localStorage.setItem(onboardKey(userId), 'true');
    setOnboarded(true);
  };

  const updateUser = (partial: Partial<Student>) => {
    if (!userId) return;
    const next = { ...(overrides || {}), ...partial };
    setOverrides(next);
    localStorage.setItem(overrideKey(userId), JSON.stringify(next));
  };

  return (
    <AuthContext.Provider value={{ user, onboarded, token: null, signIn, signInWithGoogle, signOut, completeOnboarding, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
