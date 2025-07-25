import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ inviteId: string }>;
  searchParams: Promise<{ role?: string }>;
}

export default async function InvitePage({ params, searchParams }: Props) {
  const supabase = await createClient();
  const { inviteId } = await params;
  const { role } = await searchParams;

  console.log('Processing invite:', { inviteId, role }); // Debug log

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('User not authenticated, redirecting to login');
    redirect(`/login?next=/invites/${inviteId}?role=${role}`);
  }

  console.log('User authenticated:', user.id);

  // First, let's check if the invite exists at all
  const { data: inviteCheck, error: inviteError } = await supabase
    .from('project_members')
    .select('*')
    .eq('id', inviteId)
    .single();

  console.log('Invite check:', { inviteCheck, inviteError });

  if (inviteError || !inviteCheck) {
    console.log('Invite ID does not exist in database');
    notFound();
  }

  // Check if this invite belongs to the current user
  if (inviteCheck.user_id !== user.id) {
    console.log('Invite belongs to different user:', {
      inviteUserId: inviteCheck.user_id,
      currentUserId: user.id
    });
    notFound();
  }

  // Check if already processed
  if (inviteCheck.invitationStatus !== 'invited') {
    console.log('Invitation already processed:', inviteCheck.invitationStatus);
    // If already accepted, redirect to project
    if (inviteCheck.invitationStatus === 'accepted') {
      redirect(`/projects/${inviteCheck.project_id}`);
    }
    notFound();
  }

  console.log('Valid invitation found, updating status');

  // Update invitation status using the invite ID
  const { error: updateError } = await supabase
    .from('project_members')
    .update({
      invitationStatus: 'accepted',
      joined_at: new Date().toISOString(),
    })
    .eq('id', inviteId) // Use invite ID to update the record
    .eq('user_id', user.id);

  if (updateError) {
    console.error('Update error:', updateError);
    throw updateError;
  }

  console.log('Invitation accepted, redirecting to project');

  // Redirect to the project using the project_id from the database
  redirect(`/projects/${inviteCheck.project_id}`);
}