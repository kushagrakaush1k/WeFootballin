import { getUserWithRole } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/dashboard/ProfileForm';

export default async function ProfilePage() {
  const user = await getUserWithRole();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Edit Profile</CardTitle>
            <p className="text-muted-foreground">Update your personal information</p>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}