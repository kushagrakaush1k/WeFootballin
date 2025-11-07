'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
  user: {
    name: string | null;
    phone: string | null;
    playerStats: {
      position: string | null;
      preferredFoot: string | null;
    } | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    position: user.playerStats?.position || '',
    preferredFoot: user.playerStats?.preferredFoot || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Update failed');

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="p-4 bg-green-100 dark:bg-green-900 border border-green-500 rounded-lg text-green-700 dark:text-green-300 animate-in fade-in">
          ✓ Profile updated successfully!
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Preferred Position</Label>
        <Select
          value={formData.position}
          onValueChange={(value) => setFormData({ ...formData, position: value })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Forward">Forward</SelectItem>
            <SelectItem value="Midfielder">Midfielder</SelectItem>
            <SelectItem value="Defender">Defender</SelectItem>
            <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredFoot">Preferred Foot</Label>
        <Select
          value={formData.preferredFoot}
          onValueChange={(value) => setFormData({ ...formData, preferredFoot: value })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select foot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Right">Right</SelectItem>
            <SelectItem value="Left">Left</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full h-12 football-gradient text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </form>
  );
}