import React from 'react';
import { Button } from "@/components/ui/button";
import { signinGithub, signinGoogle, signinMicrosoft, signinTwitter } from '@/lib/social/client';
import { GitHubIcon, GoogleIcon, MicrosoftIcon, TwitterXIcon } from '../../../public/icons/icons';

export default function SocialButtons() {
  // Add loading states if needed
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleSocialLogin = async (
    provider: 'google' | 'github' | 'microsoft' | 'twitter',
    handler: () => Promise<void>
  ) => {
    setIsLoading(provider);
    try {
      await handler();
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={() => handleSocialLogin('google', signinGoogle)}
        className="flex-1" 
        variant="outline" 
        aria-label="Login with Google" 
        size="icon"
        disabled={!!isLoading}
      >
        <GoogleIcon />
      </Button>
      <Button 
        onClick={() => handleSocialLogin('microsoft', signinMicrosoft)}
        className="flex-1" 
        variant="outline" 
        aria-label="Login with Microsoft" 
        size="icon"
        disabled={!!isLoading}
      >
        <MicrosoftIcon />
      </Button>
      <Button 
        onClick={() => handleSocialLogin('twitter', signinTwitter)}
        className="flex-1" 
        variant="outline" 
        aria-label="Login with X" 
        size="icon"
        disabled={!!isLoading}
      >
        <TwitterXIcon />
      </Button>
      <Button 
        onClick={() => handleSocialLogin('github', signinGithub)}
        className="flex-1" 
        variant="outline" 
        aria-label="Login with GitHub" 
        size="icon"
        disabled={!!isLoading}
      >
        <GitHubIcon />
      </Button>
    </div>
  );
}