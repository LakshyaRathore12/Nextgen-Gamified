
import React, { useEffect, useState } from 'react';
import { RobotState } from '../types';
import { Volume2, VolumeX } from 'lucide-react';

interface RobotProps {
  state: RobotState;
  onClick?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  voicePitch: number;
  voiceRate: number;
}

export const Robot: React.FC<RobotProps> = ({ state, onClick, isMuted, onToggleMute, voicePitch, voiceRate }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  // Blinking Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect for speech
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < state.message.length) {
        setDisplayedText(prev => prev + state.message.charAt(i));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);
    return () => clearInterval(typeInterval);
  }, [state.message]);

  // Voice effect (Text-to-Speech)
  useEffect(() => {
    if (!state.message || !('speechSynthesis' in window)) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    if (isMuted) return; // Do not speak if muted

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(state.message);
      // Configurable settings
      utterance.rate = voiceRate; 
      utterance.pitch = voicePitch; 
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      // Look for Google US English or similar high-quality voices
      const preferredVoice = voices.find(v => 
        (v.name.includes('Google') && v.lang.includes('en-US')) || 
        v.name.includes('Natural') ||
        v.name.includes('Samantha')
      );
      
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    };

    // Chrome sometimes needs a moment to load voices
    if (window.speechSynthesis.getVoices().length === 0) {
       window.speechSynthesis.onvoiceschanged = speak;
    } else {
       speak();
    }
  }, [state.message, isMuted, voicePitch, voiceRate]);

  if (!state.isVisible) return null;

  const getEyeExpression = () => {
    if (isBlinking) return 'h-1 scale-x-110'; // Closed
    switch (state.emotion) {
      case 'happy': return 'h-4 rounded-full';
      case 'excited': return 'h-5 w-5 rounded-full bg-yellow-200 shadow-glow';
      case 'confused': return 'h-3 w-4 rounded-sm rotate-12';
      case 'thinking': return 'h-2 w-4 translate-y-1';
      default: return 'h-4 rounded-full';
    }
  };

  const getColor = () => {
     switch (state.emotion) {
      case 'happy': return 'from-blue-400 to-indigo-500';
      case 'excited': return 'from-pink-400 to-rose-500';
      case 'confused': return 'from-orange-400 to-red-500';
      case 'thinking': return 'from-emerald-400 to-teal-500';
      default: return 'from-blue-400 to-indigo-500';
    }
  }

  const getAnimationClass = () => {
    switch (state.emotion) {
      case 'excited': return 'animate-bounce';
      case 'confused': return 'animate-shake';
      case 'thinking': return 'animate-pulse';
      default: return 'animate-float';
    }
  }

  return (
    // UPDATED CLASS: bottom-24 for mobile (above nav), bottom-8 for desktop
    <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 flex flex-col items-end pointer-events-none">
      {/* Speech Bubble */}
      {state.message && (
        <div className="mb-4 mr-2 lg:mr-10 bg-white text-slate-800 p-3 lg:p-4 rounded-2xl rounded-tr-none shadow-xl max-w-[200px] lg:max-w-xs animate-bounce-in border-4 border-indigo-200 pointer-events-auto relative group">
           <p className="font-bold text-xs md:text-base">{displayedText}</p>
        </div>
      )}

      {/* Mute Button (Floating near Robot) */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
        className={`pointer-events-auto absolute -top-10 right-0 p-2 rounded-full shadow-lg transition-all border mb-2 z-50 ${isMuted ? 'bg-red-100 text-red-500 border-red-200' : 'bg-white/90 text-slate-600 border-slate-200 hover:text-indigo-600 hover:bg-white'}`}
        title={isMuted ? "Unmute Robot" : "Mute Robot"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Robot Body */}
      <div 
        onClick={onClick}
        className={`relative w-24 h-24 md:w-40 md:h-40 ${getAnimationClass()} cursor-pointer pointer-events-auto transition-all duration-500 hover:scale-110`}
      >
        {/* Antenna */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 md:-translate-y-6 flex flex-col items-center">
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${state.emotion === 'thinking' ? 'animate-ping bg-yellow-400' : 'bg-red-400'}`}></div>
            <div className="w-0.5 h-4 md:w-1 md:h-6 bg-slate-400"></div>
        </div>

        {/* Head */}
        <div className={`w-full h-full bg-gradient-to-br ${getColor()} rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-4 border-white/20 flex items-center justify-center relative overflow-hidden backdrop-blur-md`}>
           {/* Screen/Face */}
           <div className="w-3/4 h-3/5 bg-slate-900 rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 md:gap-4 shadow-inner border-b-2 border-white/10">
              {/* Left Eye */}
              <div className={`w-6 md:w-8 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all duration-300 ${getEyeExpression()}`}></div>
              {/* Right Eye */}
              <div className={`w-6 md:w-8 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all duration-300 ${getEyeExpression()}`}></div>
           </div>

           {/* Mouth */}
           <div className="absolute bottom-4 md:bottom-6 w-8 md:w-12 h-1.5 md:h-2 bg-slate-800/50 rounded-full flex justify-center items-center overflow-hidden">
               {state.emotion === 'happy' && <div className="w-6 md:w-8 h-3 md:h-4 border-b-2 border-white rounded-full"></div>}
               {state.emotion === 'excited' && <div className="w-4 md:w-6 h-2 md:h-3 bg-white rounded-full animate-pulse"></div>}
               {state.emotion === 'confused' && <div className="w-4 md:w-6 h-1 bg-white rotate-12"></div>}
               {state.emotion === 'thinking' && <div className="w-3 md:w-4 h-1.5 md:h-2 bg-white rounded-full animate-ping"></div>}
           </div>
        </div>

        {/* Arms (Decorative) */}
        <div className="absolute top-1/2 -left-2 md:-left-4 w-4 md:w-6 h-8 md:h-12 bg-indigo-400 rounded-full -rotate-12 border-2 border-white/20"></div>
        <div className="absolute top-1/2 -right-2 md:-right-4 w-4 md:w-6 h-8 md:h-12 bg-indigo-400 rounded-full rotate-12 border-2 border-white/20"></div>
      </div>
    </div>
  );
};
