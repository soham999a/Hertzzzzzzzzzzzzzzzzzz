import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { signOutUser } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  rewardPoints: number;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPremium: false,
  rewardPoints: 0,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setRewardPoints(0);
      return;
    }
    const unsubUser = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          setIsPremium(snap.data()?.isPremium === true);
        }
      },
      () => { /* Firestore may be unavailable */ }
    );
    const unsubRewards = onSnapshot(
      doc(db, 'rewards', user.uid),
      (snap) => {
        if (snap.exists()) {
          setRewardPoints(snap.data()?.points || 0);
        }
      },
      () => { /* Firestore may be unavailable */ }
    );
    return () => {
      unsubUser();
      unsubRewards();
    };
  }, [user]);

  const signOut = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully', {
        description: 'See you next time!',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out', {
        description: 'Please try again',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isPremium, rewardPoints, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
