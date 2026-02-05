
import React from 'react';
import { User, RobotState } from '../types';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { AVATAR_COLORS, AVATAR_EYES, AVATAR_MOUTHS, AVATAR_ACCESSORIES, SECRET_ACCESSORY } from '../constants';
import { Sliders, Volume2, Lock } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdate: (key: keyof User, value: any) => void;
  theme: 'light' | 'dark';
  setRobotState: (state: RobotState) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdate, theme, setRobotState }) => {
  const isDark = theme === 'dark';
  const cardClass = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-xl";
  const textClass = isDark ? "text-white" : "text-slate-900";
  const labelClass = "text-sm font-bold text-slate-400 uppercase mb-2 block";
  
  const handleUpdate = (key: keyof User, value: any, category: string) => {
    onUpdate(key, value);
    
    // Robot Reactions based on category
    let messages = [];
    let emotion: RobotState['emotion'] = 'happy';

    if (category === 'color') {
        messages = ["That color really pops!", "Shiny new paint job!", "My favorite hue!", "Looking sharp, cadet!"];
        emotion = 'excited';
    } else if (category === 'eyes') {
        messages = ["I see you!", "Intense stare!", "Nice optics!", "Looking good!"];
        emotion = 'happy';
    } else if (category === 'mouth') {
        messages = ["Say cheese!", "What a smile!", "Expressive!", "Beep boop!"];
        emotion = 'happy';
    } else if (category === 'accessory') {
        if (value === SECRET_ACCESSORY) {
             messages = ["OMEGA GEAR EQUIPPED! Infinite power!", "You found the secret!", "Legendary status confirmed!"];
             emotion = 'excited';
        } else {
             messages = ["So stylish!", "Very fashionable!", "That's cool gear!", "Upgrade complete!"];
             emotion = 'excited';
        }
    } else if (category === 'voice') {
        messages = ["Testing 1, 2, 3! How do I sound?", "Is this better?", "Voice module calibrated!"];
        emotion = 'happy';
    }

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    // Don't interrupt immediately for slider changes unless it's a "test"
    if (category !== 'voice_silent') {
        setRobotState({
            emotion,
            message: randomMsg,
            isVisible: true
        });
    }
  };

  const handleTestVoice = () => {
    setRobotState({
      emotion: 'excited',
      message: `Hello Cadet ${user.name}! This is my new voice setting. Do you like it?`,
      isVisible: true
    });
  };

  const buttonClass = (isSelected: boolean) => 
    `px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 transform hover:scale-105 ${
      isSelected 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-800' 
        : `${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
    }`;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
      {/* Avatar Preview Section */}
      <div className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border-4 transition-colors duration-300 ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-white bg-indigo-50'}`}>
        <div className="relative group">
           <div className={`absolute inset-0 bg-indigo-500 rounded-full blur-[80px] opacity-20 animate-pulse group-hover:opacity-40 transition-opacity`}></div>
           <Avatar 
             color={user.avatarColor}
             eyes={user.avatarEyes}
             mouth={user.avatarMouth}
             accessory={user.avatarAccessory}
             className="w-72 h-72 border-8 border-white/20 shadow-2xl relative z-10"
           />
        </div>
        <h2 className={`mt-10 text-4xl font-black tracking-tight ${textClass}`}>{user.name}</h2>
        <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-bold uppercase text-xs tracking-widest border border-indigo-500/30">
                Level {user.level} Cadet
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-bold uppercase text-xs tracking-widest border border-yellow-500/30">
                {user.xp} XP
            </span>
        </div>
      </div>

      {/* Customization Controls */}
      <div className={`space-y-8 ${textClass}`}>
        
        {/* Voice Settings Card */}
        <div>
           <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
             <Volume2 className="text-indigo-400" /> Voice Module
           </h3>
           <div className={`${cardClass} rounded-3xl p-8 border transition-colors duration-300`}>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between mb-2">
                       <span className={labelClass}>Voice Pitch ({user.voicePitch.toFixed(1)})</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.1"
                      value={user.voicePitch}
                      onChange={(e) => handleUpdate('voicePitch', parseFloat(e.target.value), 'voice_silent')}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                       <span>Deep</span>
                       <span>High</span>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between mb-2">
                       <span className={labelClass}>Voice Speed ({user.voiceRate.toFixed(1)}x)</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.1"
                      value={user.voiceRate}
                      onChange={(e) => handleUpdate('voiceRate', parseFloat(e.target.value), 'voice_silent')}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                       <span>Slow</span>
                       <span>Fast</span>
                    </div>
                 </div>

                 <Button onClick={handleTestVoice} size="sm" variant="secondary" className="w-full">
                    <Volume2 size={16} className="mr-2" /> Test Voice Output
                 </Button>
              </div>
           </div>
        </div>

        {/* Visual Customization */}
        <div>
          <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
            <Sliders className="text-pink-400" /> Visual Upgrades
          </h3>
          
          <div className={`${cardClass} rounded-3xl p-8 border transition-colors duration-300`}>
             {/* Color Picker */}
             <div className="mb-8">
                <span className={labelClass}>Chassis Color</span>
                <div className="flex flex-wrap gap-4">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => handleUpdate('avatarColor', color, 'color')}
                      className={`w-12 h-12 rounded-full border-4 transition-transform hover:scale-110 shadow-lg ${user.avatarColor === color ? 'border-white ring-2 ring-indigo-500 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
             </div>

             {/* Eyes Selection */}
             <div className="mb-8">
               <span className={labelClass}>Optical Sensors</span>
               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                 {AVATAR_EYES.map(eye => (
                   <button
                     key={eye}
                     onClick={() => handleUpdate('avatarEyes', eye, 'eyes')}
                     className={buttonClass(user.avatarEyes === eye)}
                   >
                     {eye}
                   </button>
                 ))}
               </div>
             </div>

             {/* Mouth Selection */}
             <div className="mb-8">
               <span className={labelClass}>Voice Module Visuals</span>
               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                 {AVATAR_MOUTHS.map(mouth => (
                   <button
                     key={mouth}
                     onClick={() => handleUpdate('avatarMouth', mouth, 'mouth')}
                     className={buttonClass(user.avatarMouth === mouth)}
                   >
                     {mouth}
                   </button>
                 ))}
               </div>
             </div>

              {/* Accessory Selection */}
             <div>
               <span className={labelClass}>Add-ons & Gear</span>
               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                 {AVATAR_ACCESSORIES.map(acc => (
                   <button
                     key={acc}
                     onClick={() => handleUpdate('avatarAccessory', acc, 'accessory')}
                     className={buttonClass(user.avatarAccessory === acc)}
                   >
                     {acc}
                   </button>
                 ))}
                 
                 {/* SECRET UNLOCK */}
                 {user.unlockedSecret ? (
                    <button
                     onClick={() => handleUpdate('avatarAccessory', SECRET_ACCESSORY, 'accessory')}
                     className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 transform hover:scale-105 border border-yellow-500/50 bg-yellow-900/20 text-yellow-500 animate-pulse ${
                        user.avatarAccessory === SECRET_ACCESSORY 
                            ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/50' 
                            : 'hover:bg-yellow-500 hover:text-slate-900'
                     }`}
                   >
                     {SECRET_ACCESSORY}
                   </button>
                 ) : (
                    <div className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-600 flex items-center justify-center gap-1 cursor-not-allowed opacity-50">
                        <Lock size={12} /> Secret
                    </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
