import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Target, Phone, MessageSquare, Video, 
  Moon, Archive, Trash2, Edit2, Mail, Info, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Data and Helpers
import { addTimelineEntry, getFriends, saveFriend, deleteFriend } from '@/lib/storage';
import { cn } from '@/lib/utils';

// Friend Details Page
// This page shows everything about a single friend
export default function FriendDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for the friend data
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for editing the goal
  const [newGoal, setNewGoal] = useState('');

  // Load friend data on mount or when ID changes
  useEffect(() => {
    const friends = getFriends();
    const found = friends.find(f => f.id === Number(id));
    
    if (found) {
      setFriend(found);
      setNewGoal(found.goal.toString());
    }
    
    setLoading(false);
  }, [id]);

  // Logs a new interaction (Call, Text, Video)
  const handleCheckIn = (type) => {
    if (!friend) return;

    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Add to timeline storage
    addTimelineEntry({
      friendId: friend.id,
      friendName: friend.name,
      type,
      date,
      title: `${type} with ${friend.name}`,
    });

    // Refresh friend data to see updated "days since contact"
    const updatedFriends = getFriends();
    const updatedFriend = updatedFriends.find(f => f.id === friend.id);
    if (updatedFriend) setFriend(updatedFriend);

    toast.success(`${type} logged!`, {
      description: `Your interaction with ${friend.name} has been added to the timeline.`,
    });
  };

  // Updates the contact frequency goal
  const handleUpdateGoal = () => {
    if (!friend) return;
    
    const goalNum = parseInt(newGoal);
    if (isNaN(goalNum) || goalNum <= 0) {
      toast.error("Please enter a valid number of days");
      return;
    }

    const updatedFriend = { ...friend, goal: goalNum };
    saveFriend(updatedFriend);
    setFriend(updatedFriend);
    
    toast.success("Relationship goal updated!");
  };

  // Deletes the friend from the shelf
  const handleDelete = () => {
    if (!friend) return;
    
    // Using a simple confirm for now, but making it more robust
    const confirmed = window.confirm(`Are you sure you want to remove ${friend.name} from your shelf?`);
    if (confirmed) {
      deleteFriend(friend.id);
      toast.success(`${friend.name} removed from your shelf`);
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Friend not found</h2>
        <Button onClick={() => navigate('/')} variant="outline">
          Back to Home
        </Button>
      </div>
    );
  }

  const statusColors = {
    'overdue': 'bg-destructive text-destructive-foreground',
    'almost due': 'bg-amber-500 text-white',
    'on-track': 'bg-primary text-primary-foreground',
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
        <ArrowLeft size={16} />
        Back to Shelf
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Friend Info Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="overflow-hidden border border-muted/30 shadow-sm rounded-xl">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
              <Avatar className="h-24 w-24 border-2 border-muted/10">
                <AvatarImage src={friend.picture} alt={friend.name} className="object-cover" referrerPolicy="no-referrer" />
                <AvatarFallback className="text-2xl font-bold">{friend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-primary">{friend.name}</h1>
                <Badge className={cn("text-[9px] px-3 py-1 font-bold uppercase tracking-widest rounded-full border-none", statusColors[friend.status])}>
                  {friend.status}
                </Badge>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5">
                {friend.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-md">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-4 w-full">
                <p className="text-sm italic text-muted-foreground font-medium">"{friend.bio}"</p>
                <div className="pt-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email: {friend.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="justify-center gap-2 h-12 rounded-lg border-muted/30 font-bold text-xs uppercase tracking-widest" onClick={() => toast.info("Snoozed for 2 weeks")}>
              <Clock size={16} />
              Snooze 2 Weeks
            </Button>
            <Button variant="outline" className="justify-center gap-2 h-12 rounded-lg border-muted/30 font-bold text-xs uppercase tracking-widest" onClick={() => toast.info("Friend archived")}>
              <Archive size={16} />
              Archive
            </Button>
            <Button 
              variant="outline" 
              className="justify-center gap-2 h-12 rounded-lg border-muted/30 font-bold text-xs uppercase tracking-widest text-destructive hover:text-destructive hover:bg-destructive/5"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>

        {/* Right Column - Stats and Actions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-muted/30 shadow-sm rounded-xl">
              <CardContent className="p-8 flex flex-col items-center text-center gap-1">
                <div className="text-4xl font-bold text-primary">{friend.days_since_contact}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Days Since Contact</div>
              </CardContent>
            </Card>
            <Card className="border border-muted/30 shadow-sm rounded-xl">
              <CardContent className="p-8 flex flex-col items-center text-center gap-1">
                <div className="text-4xl font-bold text-primary">{friend.goal}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Goal (Days)</div>
              </CardContent>
            </Card>
            <Card className="border border-muted/30 shadow-sm rounded-xl">
              <CardContent className="p-8 flex flex-col items-center text-center gap-1">
                <div className="text-2xl font-bold text-primary">
                  {new Date(friend.next_due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Due</div>
              </CardContent>
            </Card>
          </div>

          {/* Relationship Goal Card */}
          <Card className="border border-muted/30 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-bold text-primary">Relationship Goal</CardTitle>
              <Dialog>
                <DialogTrigger render={<Button variant="outline" size="sm" className="h-8 px-4 rounded-md border-muted/30 font-bold text-[10px] uppercase tracking-widest" />}>
                  Edit
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                    <DialogDescription>Change how often you want to connect with {friend.name}.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-goal">Contact Goal (Days)</Label>
                      <Input 
                        id="edit-goal" 
                        type="number" 
                        value={newGoal} 
                        onChange={(e) => setNewGoal(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button onClick={handleUpdateGoal} />}>Save Changes</DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-muted-foreground">
                Connect every <span className="font-bold text-primary">{friend.goal} days</span>
              </p>
            </CardContent>
          </Card>

          {/* Quick Check-In Card */}
          <Card className="border border-muted/30 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Quick Check-In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleCheckIn('Call')}
                  variant="outline"
                  className="flex-col h-32 gap-3 rounded-xl border-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-center h-10 w-10">
                    <img 
                      src="/assets/call.png" 
                      alt="Call" 
                      className="h-8 w-8 object-contain" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <Phone className="hidden text-primary" size={24} />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest">Call</span>
                </Button>
                <Button 
                  onClick={() => handleCheckIn('Text')}
                  variant="outline"
                  className="flex-col h-32 gap-3 rounded-xl border-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-center h-10 w-10">
                    <img 
                      src="/assets/text.png" 
                      alt="Text" 
                      className="h-8 w-8 object-contain" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <MessageSquare className="hidden text-primary" size={24} />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest">Text</span>
                </Button>
                <Button 
                  onClick={() => handleCheckIn('Video')}
                  variant="outline"
                  className="flex-col h-32 gap-3 rounded-xl border-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-center h-10 w-10">
                    <img 
                      src="/assets/video.png" 
                      alt="Video" 
                      className="h-8 w-8 object-contain" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <Video className="hidden text-primary" size={24} />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest">Video</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
