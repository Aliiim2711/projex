import { createClient } from '@/utils/supabase/server';
import { users, type IUser } from '@/utils/users';
import { AccountDetails } from './AccountDetails';
import { Projects } from './Projects';
import { redirect } from 'next/navigation';
import { projects } from '@/utils/projects';

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  // Get or create user data
  let userData: IUser | null = null;
  try {
    userData = await users.getUser(user.id);
    
    // If user doesn't exist in database, create them
    if (!userData) {
      console.log('Creating user profile for:', user.email);
      userData = await users.captureUserDetails(user);
    }
  } catch (error) {
    console.error('Error handling user data:', error);
    // If still no user data, redirect to login
    if (!userData) redirect('/login');
  }

  // Get user projects
  let userProjects: any[] = [];  // ✅ Fixed: Added type annotation
  try {
    userProjects = await projects.getUserProjects(user.id);
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Continue with empty projects array
  }

  return (
    <div className="w-[90%] flex flex-col md:flex-row mx-auto p-8 gap-4">
      <div className="w-full md:w-72">
        <AccountDetails initialData={userData} />
      </div>
      <div className="flex-1">
        <Projects initialProjects={userProjects} />
      </div>
    </div>
  );
}