
import React from 'react';
import { LeaderboardEntry, User } from '../types';
import { MOCK_LEADERBOARD } from '../constants';

interface LeaderboardProps {
  user: User;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ user }) => {
  // Merge current user AND their friends into the global leaderboard
  const allUsers: LeaderboardEntry[] = [...MOCK_LEADERBOARD];

  // Add the current user
  if (!allUsers.find(u => u.name === user.name)) {
    allUsers.push({
      id: 'current-user',
      name: user.name,
      xp: user.xp,
      avatarColor: user.avatarColor,
      avatarAccessory: user.avatarAccessory,
      isFriend: false,
      championshipWins: user.championshipWins
    });
  }

  // Add the user's friends
  user.friends.forEach(friend => {
    // Check if they are already in the mock list to update them, or add new
    const existingIndex = allUsers.findIndex(u => u.name === friend.name);
    if (existingIndex !== -1) {
       allUsers[existingIndex].isFriend = true; // Mark as friend
       allUsers[existingIndex].championshipWins = friend.championshipWins;
    } else {
       allUsers.push({
         id: friend.id,
         name: friend.name,
         xp: friend.xp,
         avatarColor: friend.avatarColor,
         avatarAccessory: friend.avatarAccessory,
         isFriend: true,
         championshipWins: friend.championshipWins
       });
    }
  });

  const sortedUsers = allUsers.sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">Global Rankings</h2>
        <p className="text-slate-400">Who is the ultimate coding champion?</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
        <div className="p-6 grid grid-cols-12 gap-4 text-slate-400 font-bold text-sm uppercase tracking-wider border-b border-slate-700/50">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-5">Cadet</div>
          <div className="col-span-3 text-right">Wins</div>
          <div className="col-span-2 text-right">XP Score</div>
        </div>

        <div className="divide-y divide-slate-700/50">
          {sortedUsers.map((entry, index) => {
            const isCurrentUser = entry.name === user.name;
            const rank = index + 1;
            
            return (
              <div 
                key={entry.id} 
                className={`grid grid-cols-12 gap-4 p-6 items-center transition-colors ${isCurrentUser ? 'bg-indigo-900/30' : 'hover:bg-slate-800'}`}
              >
                <div className="col-span-2 flex justify-center">
                  {rank === 1 ? <span className="text-3xl">🥇</span> :
                   rank === 2 ? <span className="text-3xl">🥈</span> :
                   rank === 3 ? <span className="text-3xl">🥉</span> :
                   <span className="text-xl font-black text-slate-500">#{rank}</span>}
                </div>
                
                <div className="col-span-5 flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-slate-600 shadow-lg"
                    style={{ backgroundColor: entry.avatarColor }}
                  ></div>
                  <div>
                    <div className={`font-bold text-lg ${isCurrentUser ? 'text-indigo-400' : 'text-white'}`}>
                      {entry.name} {isCurrentUser && '(You)'}
                    </div>
                    {entry.isFriend && <div className="text-xs text-emerald-400 font-bold">FRIEND</div>}
                  </div>
                </div>

                <div className="col-span-3 text-right">
                   <div className="font-bold text-slate-300">{entry.championshipWins} 🏆</div>
                </div>

                <div className="col-span-2 text-right">
                  <span className="font-mono font-bold text-xl text-yellow-400">{entry.xp.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
