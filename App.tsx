import React, { useState, useEffect } from 'react';
import { User, RobotState } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LessonView } from './pages/LessonView';
import { Leaderboard } from './pages/Leaderboard';
import { Championship } from './pages/Championship';
import { Profile } from './pages/Profile';
import { Friends } from './pages/Friends';
import { StoryMode } from './pages/StoryMode';
import { Certificates } from './pages/Certificates';
import { Button } from './components/Button';
import { LevelUpModal } from './components/LevelUpModal';
import { X, Gift, UserCircle } from 'lucide-react';
import { getLevelFromXP, generateMockFriend } from './constants';
import { loginOrRegisterUser, updateUserProfile, loginAsGuest } from './services/dataService';
import { IS_CONFIGURED, reconnectSupabase } from './services/supabase';

export default function App() {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Robot State
  const [robotState, setRobotState] = useState<RobotState>({
    emotion: 'idle',
    message: '',
    isVisible: true
  });
  
  // Login Form State
  const [loginName, setLoginName] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Sync state to DB whenever user changes (skip for guest inside service)
  useEffect(() => {
    if (user) {
      updateUserProfile(user).catch(err => console.error("Sync failed", err));
    }
  }, [user]);

  // Theme Logic
  const toggleTheme = () => {
    setUser(prev => prev ? { ...prev, themePreference: prev.themePreference === 'dark' ? 'light' : 'dark' } : null);
  };

  // Mute Logic
  const toggleMute = () => {
    setUser(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
  };

  // Navigation Logic
  const navigate = (page: string) => {
    setCurrentPage(page);
    
    // Robot Context Switching based on page
    if (page === 'dashboard') {
      setRobotState({ 
        emotion: 'happy', 
        message: `Base command active! What's our next move?`, 
        isVisible: true 
      });
    } else if (page === 'profile') {
      setRobotState({
        emotion: 'excited',
        message: "Upgrade station! Let's make you look awesome!",
        isVisible: true
      });
    } else if (page === 'leaderboard') {
      setRobotState({
        emotion: 'happy',
        message: "Look at all these coding legends!",
        isVisible: true
      });
    } else if (page === 'friends') {
      setRobotState({
        emotion: 'happy',
        message: "Friends make coding way more fun! Add them to your squad!",
        isVisible: true
      });
    } else if (page === 'championship') {
      setRobotState({
        emotion: 'excited',
        message: "Welcome to the Arena! Prepare for glory!",
        isVisible: true
      });
    } else if (page === 'story') {
      setRobotState({
        emotion: 'thinking',
        message: "The universe is in danger! We need your help, Cadet!",
        isVisible: true
      });
    } else if (page === 'certificates') {
      setRobotState({
        emotion: 'happy',
        message: "Your Hall of Fame! Keep completing missions to earn these trophies!",
        isVisible: true
      });
    }
  };

  // Auth Handlers
  const handleAuth = async () => {
    if (!loginName.trim() || loginPin.length < 4) {
      alert("Please enter a name and a 4-digit PIN.");
      return;
    }
    setIsLoading(true);
    
    try {
      const loggedUser = await loginOrRegisterUser(loginName, loginPin, isSignUp);
      setUser(loggedUser);
      navigate('dashboard');
    } catch (e: any) {
      alert(e.message || "Auth Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    const guestUser = await loginAsGuest();
    setUser(guestUser);
    navigate('dashboard');
    setIsLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    setLoginName('');
    setLoginPin('');
    setRobotState({ emotion: 'idle', message: '', isVisible: true });
  };

  // Add Friend Handler
  const addFriend = (code: string) => {
    if (!user) return;
    if (user.isGuest) {
        setRobotState({ emotion: 'confused', message: "Sign up to add friends!", isVisible: true });
        return;
    }

    if (code === user.friendCode) {
       setRobotState({ emotion: 'confused', message: "That's your own code silly!", isVisible: true });
       return;
    }
    
    if (user.friends.some(f => f.id === code)) {
       setRobotState({ emotion: 'thinking', message: "You are already friends with this cadet!", isVisible: true });
       return;
    }

    const newFriend = generateMockFriend(code);
    setUser(prev => prev ? { ...prev, friends: [...prev.friends, newFriend] } : null);
    
    setRobotState({ 
      emotion: 'excited', 
      message: `Friend Found! Added ${newFriend.name} to your squad!`, 
      isVisible: true 
    });
  };

  // XP & Gamification Handlers
  const handleXPGain = (amount: number, coins: number) => {
    setUser(prev => {
      if (!prev) return null;
      const newXp = prev.xp + amount;
      const oldLevel = prev.level;
      const newLevel = getLevelFromXP(newXp);
      
      if (newLevel > oldLevel) {
        setShowLevelUpModal(true);
        setRobotState({
          emotion: 'excited',
          message: `AMAZING! You reached Level ${newLevel}! My sensors are overloading with joy!`,
          isVisible: true
        });
      }

      return {
        ...prev,
        xp: newXp,
        coins: prev.coins + coins,
        level: newLevel
      };
    });
  };

  const startLesson = (id: string) => {
    setCurrentLessonId(id);
    setCurrentPage('lesson');
  };

  const completeLesson = (xp: number, coins: number) => {
    if (!user || !currentLessonId) return;
    
    // Avoid duplicate rewards for same lesson
    if (user.completedLessons.includes(currentLessonId)) {
        navigate('dashboard');
        return;
    }

    // Update streak and lesson list
    setUser(prev => {
       if(!prev) return null;
       return {
         ...prev,
         completedLessons: [...prev.completedLessons, currentLessonId],
         streak: prev.streak + 1
       }
    });

    handleXPGain(xp, coins);
    
    // Slight delay to allow modal to trigger if needed, otherwise nav
    setTimeout(() => {
        navigate('dashboard');
        if (!showLevelUpModal) {
             setRobotState({ emotion: 'excited', message: "Great job! You leveled up your brain!", isVisible: true });
        }
    }, 1500);
  };

  const winChampionship = () => {
     setUser(prev => prev ? { 
       ...prev, 
       championshipWins: prev.championshipWins + 1,
     } : null);
     
     handleXPGain(500, 200);

     setTimeout(() => {
       navigate('dashboard');
       if(!showLevelUpModal) {
          setRobotState({ emotion: 'excited', message: "A true champion! 500 XP added!", isVisible: true });
       }
     }, 2000);
  };

  const updateStoryProgress = (newChapterIndex: number, xp: number) => {
      handleXPGain(xp, 50); // XP and 50 coins per chapter
      setUser(prev => prev ? { ...prev, storyProgress: newChapterIndex } : null);
  };

  const handleSpin = () => {
    setShowSpinModal(true);
  };

  const executeSpin = () => {
    const reward = Math.floor(Math.random() * 50) + 10; // Random 10-60 coins
    handleXPGain(0, reward);
    setUser(prev => prev ? { ...prev, lastSpinDate: new Date().toISOString() } : null);
    
    setRobotState({ emotion: 'excited', message: `Wow! You won ${reward} coins!`, isVisible: true });
    setTimeout(() => setShowSpinModal(false), 2000);
  };

  const updateProfile = (key: keyof User, value: any) => {
     setUser(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleUnlockSecret = () => {
    if (user?.unlockedSecret) return;
    
    setUser(prev => prev ? { ...prev, unlockedSecret: true } : null);
    
    setRobotState({
      emotion: 'excited',
      message: "SECRET UNLOCKED! You found the Omega Gear! Check your profile to equip it!",
      isVisible: true
    });
  };

  // Rendering
  if (!user) {
    // Landing Page
    const creators = ["Naitik", "Lakshya Sharma", "Lakshya Rathore", "Aryan", "Ashish", "Khushi"];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative bg-[#0f172a] text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.5)_2px,transparent_2px),linear-gradient(90deg,rgba(30,41,59,0.5)_2px,transparent_2px)] bg-[length:50px_50px] -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>

        <div className="mb-10 animate-float relative z-10">
           <div className="text-6xl md:text-9xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic drop-shadow-2xl">
              NextGen
           </div>
           <p className="text-xl md:text-2xl mt-4 text-indigo-200 font-bold tracking-widest uppercase">Coding Academy</p>
        </div>

        {/* Connection Status Badge */}
        <div className="mb-6 relative z-10">
           {IS_CONFIGURED ? (
             <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/50 font-bold flex items-center gap-2 mx-auto w-fit animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]">
               <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
               Cloud Database Online
             </div>
           ) : (
             <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full border border-red-500/50 font-bold text-sm inline-flex items-center gap-2 animate-pulse">
               <div className="w-2 h-2 bg-red-500 rounded-full"></div>
               Config Missing (Check config.ts)
             </div>
           )}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-[2rem] border border-slate-700 shadow-2xl w-full max-w-md hover:border-indigo-500 transition-colors duration-500 relative z-10">
          <div className="flex justify-center mb-6 bg-slate-900/50 p-1 rounded-xl">
             <button 
               className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${!isSignUp ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               onClick={() => setIsSignUp(false)}
             >
               Login
             </button>
             <button 
               className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${isSignUp ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               onClick={() => setIsSignUp(true)}
             >
               Sign Up
             </button>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-white">{isSignUp ? 'Join the Academy' : 'Welcome Back'}</h2>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Hero Name" 
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-4 text-lg focus:border-indigo-500 focus:outline-none transition-colors text-center font-bold text-white placeholder-slate-500"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              disabled={isLoading}
            />
            
            <input 
              type="number" 
              placeholder="Secret 4-Digit PIN" 
              maxLength={4}
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-4 text-lg focus:border-indigo-500 focus:outline-none transition-colors text-center font-bold text-white placeholder-slate-500 tracking-widest"
              value={loginPin}
              onChange={(e) => {
                 if (e.target.value.length <= 4) setLoginPin(e.target.value);
              }}
              disabled={isLoading}
            />
          </div>

          <Button onClick={handleAuth} size="lg" className="w-full shadow-indigo-500/50 hover:shadow-indigo-500/80 mt-6" disabled={isLoading}>
            {isLoading ? 'Connecting...' : (isSignUp ? 'Create Hero' : 'Start Adventure')}
          </Button>

          {/* Guest Mode Button */}
          <div className="mt-4 border-t border-slate-700 pt-4">
            <button 
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors py-2 font-bold text-sm uppercase tracking-wide"
            >
              <UserCircle size={18} /> Continue as Guest
            </button>
          </div>
          
          <p className="text-xs text-slate-500 mt-2 text-center">
             {isSignUp ? "Pick a cool name and a secret code you'll remember!" : "Enter your Hero Name and Secret Code."}
          </p>
        </div>

        {/* --- CIRCULAR CREATORS SECTION --- */}
        <div className="mt-24 relative w-80 h-80 flex items-center justify-center z-0">
           {/* Center Text */}
           <div className="absolute z-10 text-center">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Created By</div>
              <div className="text-2xl font-black text-indigo-400">TEAM</div>
              <div className="text-2xl font-black text-purple-400">NEXTGEN</div>
           </div>
           
           {/* Rotating Ring */}
           <div className="absolute w-full h-full border border-slate-700 rounded-full animate-spin-slow">
              {creators.map((name, index) => {
                 // Calculate position around circle
                 const angle = (360 / creators.length) * index;
                 const radius = 140; // px distance from center
                 const rad = (angle * Math.PI) / 180;
                 // Use basic trig to position if we weren't using rotation transform trick
                 // But here we use transform: rotate(angle) translate(radius)
                 
                 return (
                    <div 
                      key={name}
                      className="absolute top-1/2 left-1/2 w-32 -ml-16 -mt-3 text-center"
                      style={{
                        transform: `rotate(${angle}deg) translate(${radius}px) rotate(90deg)` // Move out to radius
                      }}
                    >
                      {/* Counter-rotate text so it stays upright relative to screen */}
                       <div className="text-xs font-bold text-slate-400 animate-spin-reverse-slow" style={{ width: '100%', textAlign: 'center' }}>
                         {name}
                       </div>
                    </div>
                 );
              })}
           </div>
           
           {/* Decorative Outer Ring */}
           <div className="absolute w-[120%] h-[120%] border border-slate-800 rounded-full opacity-50"></div>
        </div>

      </div>
    );
  }

  return (
    <Layout 
        user={user} 
        robotState={robotState} 
        onNavigate={navigate} 
        currentPage={currentPage}
        onLogout={handleLogout}
        onRobotClick={() => setRobotState(prev => ({...prev, isVisible: !prev.isVisible}))}
        onToggleTheme={toggleTheme}
        theme={user.themePreference}
        onToggleMute={toggleMute}
    >
        {/* Guest Mode Badge */}
        {user.isGuest && (
           <div className="fixed top-24 right-8 z-40 bg-orange-500/20 border border-orange-500 text-orange-400 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider animate-pulse pointer-events-none">
             Guest Mode • Progress Not Saved
           </div>
        )}

        {/* Level Up Modal */}
        {showLevelUpModal && (
          <LevelUpModal 
             newLevel={user.level}
             avatarColor={user.avatarColor}
             avatarEyes={user.avatarEyes}
             avatarMouth={user.avatarMouth}
             avatarAccessory={user.avatarAccessory}
             onClose={() => setShowLevelUpModal(false)}
          />
        )}

        {/* Lucky Spin Modal */}
        {showSpinModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden animate-bounce-in">
                <button onClick={() => setShowSpinModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                  <X />
                </button>
                <div className="mb-6 flex justify-center">
                   <Gift size={64} className="text-pink-500 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Lucky Spin!</h3>
                <p className="text-slate-500 mb-6">Win random coins for your upgrades!</p>
                <Button onClick={executeSpin} size="lg" variant="primary" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 border-pink-700">
                   SPIN NOW!
                </Button>
             </div>
          </div>
        )}

        {/* Route: Dashboard */}
        {currentPage === 'dashboard' && (
            <Dashboard 
                user={user} 
                onStartLesson={startLesson} 
                onNavigate={navigate}
                onSpin={handleSpin}
            />
        )}

        {/* Route: Story Mode */}
        {currentPage === 'story' && (
            <StoryMode
               user={user}
               onUpdateStoryProgress={updateStoryProgress}
               setRobotState={setRobotState}
            />
        )}

        {/* Route: Lesson View */}
        {currentPage === 'lesson' && currentLessonId && (
            <LessonView 
                lessonId={currentLessonId}
                onComplete={completeLesson}
                onBack={() => navigate('dashboard')}
                setRobotState={setRobotState}
                theme={user.themePreference}
            />
        )}

        {/* Route: Profile */}
        {currentPage === 'profile' && (
          <Profile 
            user={user} 
            onUpdate={updateProfile}
            theme={user.themePreference}
            setRobotState={setRobotState}
          />
        )}

        {/* Route: Friends */}
        {currentPage === 'friends' && (
           <Friends 
              user={user} 
              onAddFriend={addFriend}
              theme={user.themePreference}
              onUnlockSecret={handleUnlockSecret}
           />
        )}

        {/* Route: Leaderboard */}
        {currentPage === 'leaderboard' && (
           <Leaderboard user={user} />
        )}

        {/* Route: Championship */}
        {currentPage === 'championship' && (
           <Championship 
              user={user}
              onWin={winChampionship} 
              onBack={() => navigate('dashboard')}
              setRobotState={setRobotState}
           />
        )}

        {/* Route: Certificates */}
        {currentPage === 'certificates' && (
           <Certificates user={user} />
        )}
    </Layout>
  );
}