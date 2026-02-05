import React from 'react';
import { Button } from './Button';
import { Avatar } from './Avatar';

interface LevelUpModalProps {
  newLevel: number;
  avatarColor: string;
  avatarEyes: string;
  avatarMouth: string;
  avatarAccessory: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ 
  newLevel, 
  avatarColor, 
  avatarEyes, 
  avatarMouth, 
  avatarAccessory, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative max-w-md w-full mx-4">
        {/* Confetti / Burst Effect Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        
        <div className="bg-slate-900 border-4 border-yellow-400 rounded-[3rem] p-10 text-center relative overflow-hidden shadow-[0_0_50px_rgba(250,204,21,0.5)] animate-bounce-in">
          
          {/* Animated Rays */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_20deg,transparent_40deg)] animate-spin-slow pointer-events-none"></div>

          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-2 drop-shadow-lg relative z-10">
            LEVEL UP!
          </h2>
          
          <div className="relative z-10 my-8 flex flex-col items-center">
             <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-ping"></div>
                <Avatar 
                    color={avatarColor}
                    eyes="Happy" // Force happy face
                    mouth="Grin" // Force happy face
                    accessory={avatarAccessory}
                    className="w-40 h-40 border-4 border-yellow-200 relative z-10"
                />
                <div className="absolute -bottom-4 -right-4 bg-red-500 text-white font-black text-2xl w-12 h-12 flex items-center justify-center rounded-full border-4 border-white shadow-lg rotate-12 z-20">
                  {newLevel}
                </div>
             </div>
          </div>

          <p className="text-xl text-yellow-100 font-bold mb-8 relative z-10">
            You are now a Level {newLevel} Coder!
          </p>

          <Button onClick={onClose} size="lg" variant="success" className="w-full relative z-10 shadow-xl shadow-green-500/20 animate-pulse">
            Awesome!
          </Button>
        </div>
      </div>
    </div>
  );
};