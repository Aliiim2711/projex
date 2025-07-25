'use client';

import { ProfilePhotoUploader } from '@/components/ProfilePhotoUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { users, type IUser } from '@/utils/users';
import { ExternalLink, Link as LinkIcon, Loader2, LogOut, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { secondaryBtnStyles } from '../commonStyles';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface AccountDetailsProps {
  initialData: IUser;
}

export const AccountDetails = ({ initialData }: AccountDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<IUser>(initialData);
  const [formData, setFormData] = useState({
    name: initialData.name,
    description: initialData.description || '',
    links: initialData.links?.length
      ? initialData.links
      : [{ id: '', label: '', url: '' }],
  });
  const { toast } = useToast();
  const router = useRouter();

  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!userData) return;

    try {
      setIsSaving(true);
      await users.updateProfile(userData.id, {
        name: formData.name,
        description: formData.description,
        links: formData.links.filter((link) => link.label && link.url),
      });

      setUserData({ ...userData, ...formData });
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No active session found.',
      });
      return;
    }

    try {
      setIsLoggingOut(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { id: '', label: '', url: '' }],
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ProfilePhotoUploader
        currentPhotoUrl={userData.avatar}
        userProvider={userData.provider}
        onPhotoUploaded={async (url) => {
          if (!userData) return;
          await users.updateProfile(userData.id, { avatar: url });
          setUserData({ ...userData, avatar: url });
        }}
      />

      {isEditing ? (
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Tell us about yourself"
              className="resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Links</label>
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  placeholder="Platform"
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  className="w-[120px]"
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLink}
              className="mt-2"
            >
              Add Link
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className={cn(secondaryBtnStyles)}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="h-8"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl mt-4">{userData.name}</h1>
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {userData.email}
          </div>
          {userData.description && <p>{userData.description}</p>}

          {userData.links && userData.links.length > 0 && (
            <div>
              <h2 className="text-lg mt-4 mb-2">Links</h2>
              {userData.links.map((link) => (
                <div key={link.id} className="flex items-center mb-2">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    {link.label} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 my-6">
            <Button
              onClick={() => setIsEditing(true)}
              className={cn(secondaryBtnStyles, 'w-full')}
            >
              Edit Profile
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
              disabled={isLoggingOut || !user}
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};