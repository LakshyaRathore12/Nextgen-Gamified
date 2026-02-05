
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Copy, UserPlus, Users, Trash2, Lock } from 'lucide-react';

interface FriendsProps {
  user: User;
  onAddFriend: (code: string) => void;
  theme: 'light' | 'dark';
  onUnlockSecret: () => void;
}

export const Friends: React.FC<FriendsProps> = ({ user, onAddFriend, theme, onUnlockSecret }) => {
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark = theme === 'dark';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.friendCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;
    onAddFriend(friendCodeInput.trim());
    setFriendCodeInput('');
  };

  const handleSecretClick = () => {
    if (user.unlockedSecret) return;

    setSecretClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        onUnlockSecret();
        return 0;
      }
      return newCount;
    });

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Reset count if no click within 1 second
    clickTimeoutRef.current = setTimeout(() => {
      setSecretClickCount(0);
    }, 800);
  };

  const cardClass = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-xl';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextClass = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
           Community Hub
        </h2>
        <p className={`${mutedTextClass} text-lg max-w-2xl mx-auto`}>
           Connect with fellow cadets! Share your code to build your squad. There is no limit to how many friends you can have.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Your Code Section */}
        <div className={`p-8 rounded-[2.5rem] border-4 border-indigo-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20"></div>
           
           <h3 className="text-xl font-bold uppercase tracking-widest text-indigo-400 mb-4">Your Unique ID</h3>
           
           <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-dashed ${isDark ? 'bg-black/30 border-slate-600' : 'bg-white border-indigo-200'} mb-6`}>
              <span className={`font-mono text-3xl font-black tracking-widest ${textClass}`}>{user.friendCode || '----'}</span>
              <button 
                onClick={handleCopyCode} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-indigo-400"
                title="Copy Code"
              >
                <Copy size={24} />
              </button>
           </div>
           
           {copySuccess && <span className="text-green-400 font-bold text-sm animate-bounce">Copied to clipboard!</span>}
           <p className={`text-sm mt-4 ${mutedTextClass}`}>Share this code with your friends so they can add you.</p>
        </div>

        {/* Add Friend Section */}
        <div className={`p-8 rounded-[2.5rem] border ${cardClass}`}>
           <h3 className={`text-2xl font-black mb-6 flex items-center gap-2 ${textClass}`}>
             <UserPlus className="text-indigo-500" /> Add a Friend
           </h3>
           <form onSubmit={handleAddSubmit} className="space-y-4">
             <div>
               <label className={`block text-xs font-bold uppercase mb-2 ${mutedTextClass}`}>Enter Friend Code</label>
               <input 
                 type="text" 
                 placeholder="e.g. KAI-8392"
                 className={`w-full p-4 rounded-xl text-lg font-bold font-mono border-2 focus:border-indigo-500 focus:outline-none uppercase ${isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                 value={friendCodeInput}
                 onChange={(e) => setFriendCodeInput(e.target.value)}
               />
             </div>
             <Button size="lg" className="w-full" disabled={!friendCodeInput}>
               Connect
             </Button>
           </form>
        </div>
      </div>

      {/* Friends List */}
      <div>
        <h3 className={`text-2xl font-black mb-6 flex items-center gap-2 ${textClass}`}>
           <button 
             onClick={handleSecretClick} 
             className={`transition-transform active:scale-95 ${secretClickCount > 0 ? 'animate-pulse text-yellow-400' : 'text-pink-500'}`}
             title="Your Squad"
           >
             <Users />
           </button>
           Your Squad ({user.friends.length})
        </h3>

        {user.friends.length === 0 ? (
          <div className={`p-12 rounded-3xl border-2 border-dashed text-center ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50'}`}>
             <Users size={48} className="mx-auto text-slate-400 mb-4" />
             <p className={`text-xl font-bold ${mutedTextClass}`}>No friends yet.</p>
             <p className="text-slate-500">Share your code to start building your team!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {user.friends.map((friend) => (
                <div key={friend.id} className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:scale-105 ${cardClass}`}>
                   <Avatar 
                      color={friend.avatarColor}
                      eyes={friend.avatarEyes}
                      mouth={friend.avatarMouth}
                      accessory={friend.avatarAccessory}
                      className="w-16 h-16 border-2 border-slate-400"
                   />
                   <div className="flex-1">
                      <h4 className={`font-bold text-lg ${textClass}`}>{friend.name}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold">
                         <span className="text-indigo-400">Lvl {friend.level}</span>
                         <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                         <span className="text-yellow-500">{friend.xp.toLocaleString()} XP</span>
                      </div>
                   </div>
                   {/* In a real app, this would delete. Here visually represented. */}
                   <button className="text-slate-600 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                   </button>
                </div>
             ))}
          </div>
        )}
      </div>

    </div>
  );
};
