import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { students, Student } from '../mock';

type AuthContextValue = {
  user: Student | null;
  onboarded: boolean;
  signIn: (id?: string) => { user: Student | null; onboarded: boolean };
  signOut: () => void;
  completeOnboarding: () => void;
  updateUser: (partial: Partial<Student>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const overrideKey = (id: string) => `bearfolio_user_override_${id}`;
const onboardKey = (id: string) => `bearfolio_onboarded_${id}`;

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

  useEffect(() => {
    const stored = localStorage.getItem('bearfolio_user');
    if (stored) {
      setUserId(stored);
      const ov = localStorage.getItem(overrideKey(stored));
      if (ov) setOverrides(JSON.parse(ov));
      setOnboarded(Boolean(localStorage.getItem(onboardKey(stored))));
    }
  }, []);

  const baseUser = useMemo(() => (userId ? students.find((s) => s.id === userId) || null : null), [userId]);
  const user = useMemo(() => (baseUser ? mergeUser(baseUser, overrides) : null), [baseUser, overrides]);

  const signIn = (id?: string) => {
    const target = id || students[0]?.id;
    if (target) {
      setUserId(target);
      localStorage.setItem('bearfolio_user', target);
      const ovRaw = localStorage.getItem(overrideKey(target));
      const ov = ovRaw ? JSON.parse(ovRaw) : undefined;
      setOverrides(ov);
      const ob = Boolean(localStorage.getItem(onboardKey(target)));
      setOnboarded(ob);
      const found = students.find((s) => s.id === target) || null;
      return { user: found ? mergeUser(found, ov) : null, onboarded: ob };
    }
    return { user: null, onboarded: false };
  };

  const signOut = () => {
    setUserId(null);
    setOverrides(undefined);
    setOnboarded(false);
    localStorage.removeItem('bearfolio_user');
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
    <AuthContext.Provider value={{ user, onboarded, signIn, signOut, completeOnboarding, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
