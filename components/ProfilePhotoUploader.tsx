'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { primaryBtnStyles } from '@/app/commonStyles';
import { createClient } from '@/utils/supabase/client';
import { toast } from './ui/use-toast';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  userProvider?: 'email' | 'google' | 'github';
  onPhotoUploaded?: (url: string) => Promise<void>;
  className?: string;
}

const BUCKET_NAME = 'profilephotos';

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  currentPhotoUrl,
  userProvider = 'email',
  onPhotoUploaded,
  className,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image file.',
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
      });
      return;
    }

    try {
      setIsUploading(true);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Check if bucket exists, create if it doesn't
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
      }

      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
      
      if (!bucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
          fileSizeLimit: maxSize
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          // Continue anyway, bucket might exist but not be visible due to permissions
        }
      }

      // Create unique filename WITHOUT user folder (for testing)
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `profile_${user.id}_${timestamp}.${fileExt}`;

      console.log('Uploading file:', {
        userId: user.id,
        fileName: fileName,
        bucket: BUCKET_NAME
      });

      // Skip old photo deletion for now to isolate the issue
      console.log('Skipping old photo deletion for debugging');

      // Upload new file
      console.log('Starting upload...');
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      console.log('Upload response:', { data, error: uploadError });

      if (uploadError) {
        console.error('Upload error details:', {
          uploadError,
          message: uploadError.message
        });
        throw new Error(uploadError.message || 'Failed to upload file');
      }

      if (!data?.path) {
        throw new Error('Upload successful but no file path returned');
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Could not generate public URL for uploaded file');
      }

      const fullUrl = publicUrlData.publicUrl;

      // Call the callback with the new URL
      if (onPhotoUploaded) {
        await onPhotoUploaded(fullUrl);
      }

      toast({
        title: 'Success',
        description: 'Profile photo updated successfully.',
      });

      // Clear the input
      if (inputRef.current) {
        inputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Error uploading file:', {
        error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      
      let errorMessage = 'An unexpected error occurred';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast({
        variant: 'destructive',
        title: 'Error uploading file',
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('w-fit relative', className)}>
      <Avatar className="w-48 h-48">
        <AvatarImage src={currentPhotoUrl} alt="Profile photo" />
        <AvatarFallback className="text-4xl">
          {currentPhotoUrl ? '' : 'CN'}
        </AvatarFallback>
      </Avatar>

      {/* Only show upload button for email users */}
      {userProvider === 'email' && (
        <>
          <Button
            className={cn(
              primaryBtnStyles,
              'w-8 h-8 p-2 rounded-full absolute right-[-15px] top-[60%]'
            )}
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            title="Upload profile photo"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </>
      )}
      
      {/* Show provider badge for OAuth users */}
      {userProvider !== 'email' && (
        <div className="absolute bottom-2 right-2 bg-muted/80 px-2 py-1 rounded-md text-xs capitalize">
          Via {userProvider}
        </div>
      )}
    </div>
  );
};