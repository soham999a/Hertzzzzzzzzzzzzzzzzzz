import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile, getUserProfile } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Calendar, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [avatarData, setAvatarData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listens, setListens] = useState<Record<string, any>>({});
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardListens, setRewardListens] = useState(0);

  useEffect(() => {
    if (!user) return;

    getUserProfile(user.uid).then((data) => {
      if (data) {
        setDisplayName(data.displayName || '');
        setCustomerName(data.customerName || '');
        setPhoneNumber(data.phoneNumber || '');
        setLocation(data.location || '');
        setBio(data.bio || '');
        setAvatarData(data.avatar || null);
      }
    }).catch(() => {});

    getDoc(doc(db, 'listens', user.uid)).then((snap) => {
      if (snap.exists()) {
        setListens(snap.data()?.stations || {});
      }
    }).catch(() => {});

    getDoc(doc(db, 'rewards', user.uid)).then((snap) => {
      if (snap.exists()) {
        setRewardPoints(snap.data()?.points || 0);
        setRewardListens(snap.data()?.listens || 0);
      }
    });
  }, [user]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarData(String(reader.result));
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!user) {
      toast.error('Please sign in to update your profile');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user, {
        displayName,
        customerName,
        phoneNumber,
        location,
        bio,
        avatar: avatarData,
      });

      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.',
      });
    } catch (err: any) {
      toast.error('Failed to update profile', {
        description: err?.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const topListens = Object.values(listens)
    .sort((a: any, b: any) => (b.count || 0) - (a.count || 0))
    .slice(0, 8);

  if (!user) {
    return (
    <div className="min-h-screen bg-background pb-20 sm:pb-8">
        <Header />
        <div className="flex flex-col items-center justify-center text-center px-4 pt-20">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Sign in required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage your account information and preferences</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border p-6 bg-card sticky top-20">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary mb-4 ring-2 ring-border">
                  {avatarData ? (
                    <img src={avatarData} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <Label className="text-sm font-medium mb-2">Profile Picture</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFile}
                  className="text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-secondary file:text-foreground hover:file:bg-secondary/80 cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">JPG, PNG or GIF (max 2MB)</p>
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="font-medium truncate">{user.email || 'Not signed in'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Member since</div>
                    <div className="font-medium">
                      {user.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Rewards
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Points</span>
                  <span className="font-bold text-amber-500">{rewardPoints}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Stations listened</span>
                  <span className="font-medium">{rewardListens}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-border p-6 bg-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How you appear on the app"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your full legal name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 90000 00000"
                    type="tel"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself and your music taste..."
                  className="w-full min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={saveProfile} disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDisplayName('');
                    setCustomerName('');
                    setPhoneNumber('');
                    setLocation('');
                    setBio('');
                    setAvatarData(null);
                  }}
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border p-6 bg-card">
              <h2 className="text-lg font-semibold mb-4">Listening Trends</h2>
              {topListens.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No listens yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start playing stations to build your trends</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topListens.map((l: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{l.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {l.count} {l.count === 1 ? 'play' : 'plays'} · Last played {new Date(l.last || 0).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
