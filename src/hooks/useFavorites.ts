import { useState, useEffect, useCallback } from 'react';
import { RadioStation } from '@/types/radio';
import { auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

const FREE_FAVORITES_LIMIT = 5;

export function useFavorites() {
  const [favorites, setFavorites] = useState<RadioStation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const uid = user?.uid ?? null;
      setUserId(uid);
      if (!uid) {
        setFavorites([]);
        setIsPremium(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(
      doc(db, 'favorites', userId),
      (snap) => {
        if (snap.exists()) {
          setFavorites(snap.data().stations || []);
        } else {
          setFavorites([]);
        }
      },
      (err) => {
        console.warn('Favorites sync unavailable:', err.message);
      }
    );

    getDoc(doc(db, 'users', userId))
      .then((snap) => {
        setIsPremium(snap.exists() && snap.data()?.isPremium === true);
      })
      .catch(() => {});

    return unsub;
  }, [userId]);

  const persistFavorites = useCallback(async (updated: RadioStation[]) => {
    if (!userId) return;
    try {
      await setDoc(doc(db, 'favorites', userId), { stations: updated }, { merge: true });
    } catch {
      // Firestore may be unavailable — data still works in-memory
    }
  }, [userId]);

  const addFavorite = useCallback(async (station: RadioStation) => {
    if (!userId) {
      toast.error('Please sign in to save favorites');
      return;
    }

    if (favorites.some((s) => s.id === station.id)) return;

    if (!isPremium && favorites.length >= FREE_FAVORITES_LIMIT) {
      toast.error(`Free users can save up to ${FREE_FAVORITES_LIMIT} favorites`, {
        description: 'Upgrade to Pro for unlimited favorites!',
        action: {
          label: 'Upgrade',
          onClick: () => (window.location.href = '/premium'),
        },
      });
      return;
    }

    const updated = [...favorites, station];
    setFavorites(updated);
    persistFavorites(updated);

    try {
      const rewardRef = doc(db, 'rewards', userId);
      const rewardSnap = await getDoc(rewardRef);
      const rewardData = rewardSnap.exists() ? rewardSnap.data() : { points: 0 };
      rewardData.points = (rewardData.points || 0) + 5;
      await setDoc(rewardRef, rewardData, { merge: true });
    } catch {
      // Reward sync is optional
    }

    toast.success(`Added ${station.name} to favorites`);
  }, [userId, isPremium, favorites, persistFavorites]);

  const removeFavorite = useCallback(
    async (stationId: string) => {
      if (!userId) return;
      const station = favorites.find((s) => s.id === stationId);
      if (!station) return;
      const updated = favorites.filter((s) => s.id !== stationId);
      setFavorites(updated);
      persistFavorites(updated);
      toast.success(`Removed ${station.name} from favorites`);
    },
    [userId, favorites, persistFavorites]
  );

  const isFavorite = useCallback(
    (stationId: string) => favorites.some((s) => s.id === stationId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (station: RadioStation) => {
      if (isFavorite(station.id)) {
        removeFavorite(station.id);
      } else {
        addFavorite(station);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    isPremium,
    favoritesLimit: isPremium ? Infinity : FREE_FAVORITES_LIMIT,
    favoritesRemaining: isPremium ? Infinity : Math.max(0, FREE_FAVORITES_LIMIT - favorites.length),
  };
}
