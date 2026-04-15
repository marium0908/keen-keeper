import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Clock, Calendar, CheckCircle2, Loader2 } from 'lucide-react';

// UI Components from our shared library
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { toast } from 'sonner';

// Data and Helpers
import { cn } from '@/lib/utils';
import { getFriends, saveFriend } from '@/lib/storage';

/**
 * Banner section at the top of the Home page.
 * Includes the "Add Friend" dialog logic.
 */
const Banner = ({ onFriendAdded }) => {
  // Local state for the new friend form
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('30');
  const [bio, setBio] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveFriend = () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    // Create a new friend object
    const newFriend = {
      id: Date.now(), // Simple unique ID for now
      name,
      picture: `https://picsum.photos/seed/${name}/400/400`, // Random avatar based on name
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      days_since_contact: 0,
      status: 'on-track',
      tags: ["New Friend"],
      bio,
      goal: parseInt(goal) || 30,
      next_due_date: new Date(Date.now() + (parseInt(goal) || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    // Save to local storage
    saveFriend(newFriend);
    
    // Reset form and notify parent
    setName('');
    setGoal('30');
    setBio('');
    setIsDialogOpen(false);
    onFriendAdded();
    
    toast.success(`${name} added to your shelf!`);
  };

  return (
    <div className="text-center py-16 md:py-24 space-y-6 bg-background">
      <h1 
        className="text-4xl md:text-5xl font-bold tracking-tight text-primary animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        Friends to keep close in your life
      </h1>
      <p 
        className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150"
      >
        Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
      </p>
      
      <div
        className="pt-4 animate-in fade-in zoom-in-95 duration-700 delay-300"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button size="lg" className="rounded-md gap-2 px-8" />}>
            <Plus size={18} />
            Add a Friend
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a New Friend</DialogTitle>
              <DialogDescription>
                Enter the details of the friend you want to keep in touch with.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Friend's name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goal">Contact Goal (Days)</Label>
                <Input 
                  id="goal" 
                  type="number" 
                  placeholder="e.g. 30" 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio / Notes</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Something about them..." 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" onClick={handleSaveFriend}>Save Friend</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

/**
 * Small summary cards showing quick stats.
 */
const SummaryCards = ({ friends }) => {
  // Calculate some basic stats for the user
  const onTrackCount = friends.filter(f => f.status === 'on-track').length;
  const needAttentionCount = friends.filter(f => f.status !== 'on-track').length;

  const stats = [
    { label: 'Total Friends', value: friends.length },
    { label: 'On Track', value: onTrackCount },
    { label: 'Need Attention', value: needAttentionCount },
    { label: 'Interactions This Month', value: 12 }, // This could be dynamic later
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 container mx-auto px-4 lg:px-8">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${300 + i * 100}ms` }}
        >
          <Card className="border border-muted/30 shadow-sm rounded-xl">
            <CardContent className="p-8 flex flex-col items-center text-center gap-1">
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

/**
 * Individual friend card component.
 */
const FriendCard = ({ friend }) => {
  const statusColors = {
    'overdue': 'bg-destructive text-destructive-foreground',
    'almost due': 'bg-amber-500 text-white',
    'on-track': 'bg-primary text-primary-foreground',
  };

  return (
    <Link to={`/friend/${friend.id}`}>
      <div className="hover:-translate-y-1 transition-transform duration-300 h-full">
        <Card className="overflow-hidden h-full border border-muted/30 shadow-sm hover:shadow-md transition-all rounded-xl">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-20 w-20 border-2 border-muted/10">
              <AvatarImage src={friend.picture} alt={friend.name} className="object-cover" referrerPolicy="no-referrer" />
              <AvatarFallback className="text-xl font-bold">{friend.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-primary">{friend.name}</h3>
              <p className="text-xs font-bold text-muted-foreground">
                {friend.days_since_contact}d ago
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
              {friend.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-md">
                  {tag}
                </Badge>
              ))}
            </div>

            <Badge className={cn("text-[9px] px-3 py-1 font-bold uppercase tracking-widest rounded-full border-none", statusColors[friend.status])}>
              {friend.status}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};

/**
 * Main Home Page component.
 */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load friends on mount
  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = () => {
    setLoading(true);
    // Simulate a small delay for that "real app" feel
    setTimeout(() => {
      const data = getFriends();
      setFriends(data);
      setLoading(false);
    }, 600);
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Friends...</p>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-4">
      {/* Banner with Add Friend Dialog */}
      <Banner onFriendAdded={loadFriendsData} />
      
      {/* Quick Stats */}
      <SummaryCards friends={friends} />
      
      {/* The Friend Shelf */}
      <section className="container mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-primary">Your Friends</h2>
          <div className="relative w-full md:w-72">
            <Input 
              placeholder="Search friends..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 h-10 rounded-lg border-muted/30 focus:border-primary/50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Users size={16} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFriends.map((friend) => (
            <div key={friend.id}>
              <FriendCard friend={friend} />
            </div>
          ))}
        </div>

        {filteredFriends.length === 0 && friends.length > 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted/30">
            <p className="text-muted-foreground">No friends found matching "{searchQuery}"</p>
          </div>
        )}

        {friends.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted/30">
            <p className="text-muted-foreground">Your shelf is empty. Add some friends to get started!</p>
          </div>
        )}
      </section>
    </div>
  );
}
