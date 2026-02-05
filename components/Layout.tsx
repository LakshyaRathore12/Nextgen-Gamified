
import React from 'react';
import { User, RobotState } from '../types';
import { Robot } from './Robot';
import { Avatar } from './Avatar';
import { Home, Play, User as UserIcon, LogOut, Award, Trophy, Globe, Sun, Moon, Users, Book, Volume2, VolumeX } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  robotState: RobotState;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
  onRobotClick?: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  onToggleMute: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  robotState, 
  onNavigate, 
  currentPage,
  onLogout,
  onRobotClick,
  onToggleTheme,
  theme,
  onToggleMute
}) => {
  const isDark = theme === 'dark';

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.5)_2px,transparent_2px),linear-gradient(90deg,rgba(30,41,59,0.5)_2px,transparent_2px)] bg-[length:50px_50px] -z-10"></div>
        {children}
        <Robot 
           state={robotState} 
           onClick={onRobotClick} 
           isMuted={false} 
           onToggleMute={() => {}} 
           voicePitch={1.2}
           voiceRate={1.0}
        />
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Base' },
    { id: 'story', icon: Book, label: 'Story' },
    { id: 'lessons', icon: Play, label: 'Learn' },
    { id: 'championship', icon: Trophy, label: 'Arena' },
    { id: 'certificates', icon: Award, label: 'Awards' },
    { id: 'leaderboard', icon: Globe, label: 'Rank' },
    { id: 'friends', icon: Users, label: 'Team' },
    { id: 'profile', icon: UserIcon, label: 'You' },
  ];

  const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const sidebarColor = isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  const headerColor = isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-slate-200';
  const bottomNavColor = isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200';

  return (
    <div className={`flex h-screen ${bgColor} ${textColor} overflow-hidden font-nunito transition-colors duration-300`}>
      
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className={`hidden lg:flex w-64 ${sidebarColor} border-r flex-col py-6 z-20 shadow-2xl transition-colors duration-300`}>
        <div className="mb-10 px-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic tracking-tighter cursor-pointer" onClick={() => onNavigate('dashboard')}>
            NextGen
          </h1>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                currentPage === item.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 translate-x-1' 
                  : `text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1 ${!isDark ? 'hover:bg-slate-100 hover:text-indigo-600' : ''}`
              }`}
            >
              <div className={`${currentPage === item.id ? 'text-white' : `text-slate-500 group-hover:text-indigo-400`}`}>
                <item.icon size={24} />
              </div>
              <span className="font-bold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto px-4 space-y-2">
           <button 
             onClick={onToggleMute}
             className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-indigo-400' : 'hover:bg-slate-100 text-indigo-600'}`}
          >
             {user.isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
             <span className="font-bold">{user.isMuted ? 'Unmute Robot' : 'Mute Robot'}</span>
          </button>

          <button 
             onClick={onToggleTheme}
             className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-100 text-orange-500'}`}
          >
             {isDark ? <Sun size={24} /> : <Moon size={24} />}
             <span className="font-bold">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut size={24} />
            <span className="font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Bar */}
        <header className={`h-16 lg:h-20 border-b ${headerColor} backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-10 transition-colors duration-300`}>
           <div className="flex items-center gap-3 lg:gap-6">
              {/* Mobile Logo */}
              <div className="lg:hidden font-black text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic mr-2">NG</div>

              <div className={`flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full border shadow-sm lg:shadow-lg ${isDark ? 'bg-slate-800/80 border-slate-600' : 'bg-white border-slate-200'}`}>
                <span className="text-yellow-400 text-sm lg:text-xl">🔥</span>
                <span className="font-bold text-xs lg:text-base">{user.streak}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full border shadow-sm lg:shadow-lg ${isDark ? 'bg-slate-800/80 border-slate-600' : 'bg-white border-slate-200'}`}>
                 <span className="text-yellow-400 text-sm lg:text-xl">🪙</span>
                 <span className="font-bold text-xs lg:text-base">{user.coins}</span>
              </div>
           </div>

           <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('profile')}>
              <div className="text-right hidden md:block">
                 <div className="font-black text-lg leading-none tracking-wide">{user.name}</div>
                 <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Lvl {user.level}</div>
              </div>
              
              <Avatar 
                color={user.avatarColor}
                eyes={user.avatarEyes}
                mouth={user.avatarMouth}
                accessory={user.avatarAccessory}
                className={`w-10 h-10 lg:w-12 lg:h-12 !border-2 ${!isDark ? '!border-slate-300' : ''}`}
              />
           </div>
        </header>

        {/* Scrollable Page Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 pb-32 lg:pb-10 relative scroll-smooth">
           {children}
        </div>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${bottomNavColor} backdrop-blur-xl border-t z-40 pb-safe`}>
          <div className="flex items-center justify-between px-2 py-2 overflow-x-auto no-scrollbar gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center min-w-[4rem] py-2 rounded-xl transition-all ${
                  currentPage === item.id 
                    ? 'text-indigo-400 scale-110' 
                    : 'text-slate-500'
                }`}
              >
                <item.icon size={24} className={currentPage === item.id ? 'fill-current/20' : ''} />
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </button>
            ))}
            {/* Mobile Logout (Small) */}
             <button onClick={onLogout} className="flex flex-col items-center justify-center min-w-[3rem] py-2 text-red-400">
                <LogOut size={20} />
             </button>
          </div>
        </div>

        {/* Robot Overlay */}
        <Robot 
          state={robotState} 
          onClick={onRobotClick} 
          isMuted={user.isMuted} 
          onToggleMute={onToggleMute}
          voicePitch={user.voicePitch}
          voiceRate={user.voiceRate}
        />
      </main>
    </div>
  );
};
