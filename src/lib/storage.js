import initialFriends from '@/data/friends.json';

// Keys used for local storage
const TIMELINE_KEY = 'keenkeeper_timeline';
const FRIENDS_KEY = 'keenkeeper_friends';

/**
 * --- Timeline Storage Logic ---
 * We use this to keep track of every call, text, or video chat.
 */

// Get all timeline entries from local storage
export const getTimeline = () => {
  const stored = localStorage.getItem(TIMELINE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse timeline from localStorage', e);
    return [];
  }
};

// Add a new interaction to the timeline
export const addTimelineEntry = (entry) => {
  const timeline = getTimeline();
  const newEntry = {
    ...entry,
    id: crypto.randomUUID(), // Generate a unique ID for each entry
  };
  
  // Put the newest entry at the top
  const updated = [newEntry, ...timeline];
  localStorage.setItem(TIMELINE_KEY, JSON.stringify(updated));
  
  // Every time we log a check-in, we should update the friend's "days since contact"
  updateFriendLastContact(entry.friendId);
  
  return newEntry;
};

// Clear everything (useful for testing or resetting)
export const clearTimeline = () => {
  localStorage.removeItem(TIMELINE_KEY);
};

/**
 * --- Friends Storage Logic ---
 * We use this to manage our "shelf" of friends.
 */

// Get the list of friends. If it's the first time, we load from the JSON file.
export const getFriends = () => {
  const stored = localStorage.getItem(FRIENDS_KEY);
  if (!stored) {
    // First time setup: use the mock data from friends.json
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(initialFriends));
    return initialFriends;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse friends from localStorage', e);
    return initialFriends;
  }
};

// Save or update a friend's info
export const saveFriend = (friend) => {
  const friends = getFriends();
  const index = friends.findIndex(f => f.id === friend.id);
  
  let updated;
  if (index >= 0) {
    // Update existing friend
    updated = [...friends];
    updated[index] = friend;
  } else {
    // Add new friend to the end
    updated = [...friends, friend];
  }
  
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(updated));
  return friend;
};

// Remove a friend and their history
export const deleteFriend = (id) => {
  const friends = getFriends();
  const updated = friends.filter(f => f.id !== id);
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(updated));
  
  // Also clean up timeline entries so we don't have "ghost" data
  const timeline = getTimeline();
  const updatedTimeline = timeline.filter(entry => entry.friendId !== id);
  localStorage.setItem(TIMELINE_KEY, JSON.stringify(updatedTimeline));
};

/**
 * Helper function to recalculate how many days it's been since we last talked.
 * This runs every time a new interaction is logged.
 */
const updateFriendLastContact = (friendId) => {
  const friends = getFriends();
  const friend = friends.find(f => f.id === friendId);
  if (!friend) return;

  const timeline = getTimeline().filter(e => e.friendId === friendId);
  if (timeline.length === 0) return;

  // The newest interaction is at the top of the list
  const newest = timeline[0]; 
  
  const lastDate = new Date(newest.date);
  const today = new Date();
  
  // Calculate difference in days
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Update the friend's status based on their goal
  const updatedFriend = {
    ...friend,
    days_since_contact: diffDays,
    // If they passed their goal, they are "overdue"
    status: diffDays > friend.goal ? 'overdue' : diffDays > friend.goal * 0.8 ? 'almost due' : 'on-track'
  };
  
  saveFriend(updatedFriend);
};
