'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';

export function CreateGameForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    date: '',
    time: '',
    duration: '90',
    maxPlayers: '14',
    skillLevel: 'All Levels',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      if (dateTime < new Date()) {
        throw new Error('Game date must be in the future');
      }

      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: dateTime.toISOString(),
          duration: parseInt(formData.duration),
          maxPlayers: parseInt(formData.maxPlayers),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create game');
      }

      router.push(`/games/${data.game.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Game Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Sunday Morning 5v5"
          value={formData.title}
          onChange={handleChange}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell players what to expect..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location Name *</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Central Park"
            value={formData.location}
            onChange={handleChange}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Full Address *</Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main St, City"
            value={formData.address}
            onChange={handleChange}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min) *</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="30"
            max="180"
            value={formData.duration}
            onChange={handleChange}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPlayers">Max Players *</Label>
          <Input
            id="maxPlayers"
            name="maxPlayers"
            type="number"
            min="4"
            max="50"
            value={formData.maxPlayers}
            onChange={handleChange}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skillLevel">Skill Level *</Label>
          <Select
            value={formData.skillLevel}
            onValueChange={(value) => setFormData({ ...formData, skillLevel: value })}
          >
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Levels">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-13 football-gradient text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Game...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-5 w-5" />
            Create Game
          </>
        )}
      </Button>
    </form>
  );
}