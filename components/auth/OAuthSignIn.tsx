'use client';

import { Suspense, useState } from 'react';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';

interface Props {
  isLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  redirectUrl?: string;
}

// Separate component to handle search params
function OAuthButtons({ isLoading, onLoadingChange, redirectUrl }: Props) {
  const [internalLoading, setInternalLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Use either provided redirectUrl or next param from URL
  const nextUrl = redirectUrl || searchParams.get('next') || '/projects';

  // Use either parent loading state or internal state
  const loading = isLoading ?? internalLoading;
  const setLoading = onLoadingChange ?? setInternalLoading;

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      setLoading(true);
      // Use NextAuth signIn method
      const result = await signIn(provider, { 
        callbackUrl: nextUrl,
        redirect: false // Handle redirect manually to show errors
      });

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: `Failed to sign in with ${provider}. Please try again.`,
        });
      } else if (result?.url) {
        // Redirect to the callback URL
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('OAuth signin error:', error);
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: `Failed to sign in with ${provider}. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        type="button"
        disabled={loading}
        onClick={() => handleOAuthSignIn('github')}
      >
        <Icons.gitHub className="mr-2 h-4 w-4" />
        Github
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={loading}
        onClick={() => handleOAuthSignIn('google')}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}

export function OAuthSignIn(props: Props) {
  return (
    <div className="w-full">
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" disabled>
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" disabled>
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        }
      >
        <OAuthButtons {...props} />
      </Suspense>
    </div>
  );
}