'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  User, 
  Phone, 
  Instagram, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Loader2,
  Trophy,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface PlayerData {
  player_name: string;
  phone: string;
  instagram: string;
  is_captain: boolean;
}

const STEPS = [
  { id: 1, title: 'Team Details', icon: Trophy },
  { id: 2, title: 'Players (1-6)', icon: Users },
  { id: 3, title: 'Players (7-12)', icon: Users },
  { id: 4, title: 'Extra Players', icon: Users },
  { id: 5, title: 'Payment', icon: FileText },
];

export default function TeamRegistrationForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [teamName, setTeamName] = useState('');
  const [googleFormId, setGoogleFormId] = useState('');
  const [players, setPlayers] = useState<PlayerData[]>(
    Array.from({ length: 15 }, (_, i) => ({
      player_name: '',
      phone: '',
      instagram: '',
      is_captain: i === 0, // First player is captain
    }))
  );

  const handlePlayerChange = (index: number, field: keyof PlayerData, value: string | boolean) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!teamName.trim()) {
        toast.error('Please enter a team name');
        return false;
      }
    } else if (currentStep === 5) {
      if (!googleFormId.trim()) {
        toast.error('Please enter your Google Form submission ID');
        return false;
      }
    } else {
      // Validate players for current step
      const startIdx = currentStep === 2 ? 0 : currentStep === 3 ? 6 : 12;
      const endIdx = currentStep === 2 ? 6 : currentStep === 3 ? 12 : 15;
      
      // For step 2 and 3, at least the first player of the group must be filled
      if (currentStep === 2 || currentStep === 3) {
        const firstPlayer = players[startIdx];
        if (!firstPlayer.player_name || !firstPlayer.phone) {
          toast.error('Please fill in at least the first player details');
          return false;
        }
      }
      
      // Validate filled players have complete info
      for (let i = startIdx; i < endIdx; i++) {
        const player = players[i];
        if (player.player_name || player.phone || player.instagram) {
          if (!player.player_name || !player.phone) {
            toast.error(`Player ${i + 1}: Name and phone are required`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      // Filter out empty players
      const validPlayers = players.filter(p => p.player_name && p.phone);

      if (validPlayers.length < 12) {
        toast.error('Minimum 12 players required');
        setIsLoading(false);
        return;
      }

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          team_name: teamName,
          captain_id: userId,
          google_form_submission_id: googleFormId,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Insert players
      const playersToInsert = validPlayers.map(p => ({
        ...p,
        team_id: team.id,
      }));

      const { error: playersError } = await supabase
        .from('team_players')
        .insert(playersToInsert);

      if (playersError) throw playersError;

      toast.success('Team registered successfully! Awaiting payment approval.');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === '23505') {
        toast.error('Team name already exists. Please choose another name.');
      } else {
        toast.error(error.message || 'Failed to register team');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlayers = (start: number, end: number) => {
    return (
      <div className="grid gap-6">
        {players.slice(start, end).map((player, idx) => {
          const actualIndex = start + idx;
          const isRequired = actualIndex < 12; // First 12 are required
          
          return (
            <motion.div
              key={actualIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-xl border-2 ${
                player.is_captain 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  player.is_captain ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {actualIndex + 1}
                </div>
                <h3 className="font-semibold">
                  Player {actualIndex + 1}
                  {player.is_captain && ' (Captain)'}
                  {isRequired && <span className="text-red-500 ml-1">*</span>}
                </h3>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor={`name-${actualIndex}`} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name {isRequired && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={`name-${actualIndex}`}
                    value={player.player_name}
                    onChange={(e) => handlePlayerChange(actualIndex, 'player_name', e.target.value)}
                    placeholder="Enter player name"
                    className="mt-1"
                    required={isRequired}
                  />
                </div>

                <div>
                  <Label htmlFor={`phone-${actualIndex}`} className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone {isRequired && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={`phone-${actualIndex}`}
                    value={player.phone}
                    onChange={(e) => handlePlayerChange(actualIndex, 'phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                    required={isRequired}
                  />
                </div>

                <div>
                  <Label htmlFor={`instagram-${actualIndex}`} className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram Handle
                  </Label>
                  <Input
                    id={`instagram-${actualIndex}`}
                    value={player.instagram}
                    onChange={(e) => handlePlayerChange(actualIndex, 'instagram', e.target.value)}
                    placeholder="@username"
                    className="mt-1"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isCurrent
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className="text-xs mt-2 text-center hidden sm:block">{step.title}</span>
                </motion.div>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-border relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-lg"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Team Details</h2>
                <p className="text-muted-foreground">
                  Let's start by creating your team for ROCK8 League
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamName" className="text-lg">
                    Team Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    className="mt-2 h-12 text-lg"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a unique and memorable name for your team
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-2">Players 1-6</h2>
              <p className="text-muted-foreground mb-6">
                Add your first 6 players (all required)
              </p>
              {renderPlayers(0, 6)}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold mb-2">Players 7-12</h2>
              <p className="text-muted-foreground mb-6">
                Add players 7-12 (all required)
              </p>
              {renderPlayers(6, 12)}
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-3xl font-bold mb-2">Extra Players (Optional)</h2>
              <p className="text-muted-foreground mb-6">
                Add up to 3 extra players (optional)
              </p>
              {renderPlayers(12, 15)}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Payment Information</h2>
                <p className="text-muted-foreground">
                  Complete the payment and provide your submission details
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Payment Instructions</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="font-semibold">1.</span>
                    <span>Fill out the Google Form with payment details</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">2.</span>
                    <span>Upload your payment screenshot in the form</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">3.</span>
                    <span>After submission, copy the confirmation/submission ID from Google Form</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">4.</span>
                    <span>Paste the submission ID below</span>
                  </li>
                </ol>
              </div>

              <div>
                <Label htmlFor="googleFormId" className="text-lg">
                  Google Form Submission ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="googleFormId"
                  value={googleFormId}
                  onChange={(e) => setGoogleFormId(e.target.value)}
                  placeholder="Paste your submission ID here"
                  className="mt-2 h-12"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This ID will be used to verify your payment
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">⚠️ Important Notes:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Your registration will be pending until payment is approved</li>
                  <li>• Admin will verify your payment within 24-48 hours</li>
                  <li>• You'll receive email notification once approved</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 1 || isLoading}
              className="px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                className="football-gradient px-8"
                disabled={isLoading}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="football-gradient px-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Registration
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}