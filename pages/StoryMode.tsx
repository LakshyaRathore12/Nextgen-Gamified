
import React, { useState, useEffect } from 'react';
import { User, StoryChapter } from '../types';
import { STORY_CHAPTERS } from '../constants';
import { Button } from '../components/Button';
import { Play, Lock, CheckCircle, RefreshCw, ArrowRight, AlertTriangle, ShieldAlert } from 'lucide-react';
import { simulateCodeExecution, getRobotFeedback } from '../services/geminiService';

interface StoryModeProps {
  user: User;
  onUpdateStoryProgress: (newChapterIndex: number, xp: number) => void;
  setRobotState: (state: any) => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({ user, onUpdateStoryProgress, setRobotState }) => {
  const [activeChapter, setActiveChapter] = useState<StoryChapter | null>(null);
  const [viewState, setViewState] = useState<'map' | 'narrative' | 'challenge' | 'victory'>('map');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  // Typewriter effect state
  const [displayText, setDisplayText] = useState('');

  // When chapter starts, Robot narrates the Intro with Typewriter effect
  useEffect(() => {
    if (viewState === 'narrative' && activeChapter) {
      setRobotState({
        emotion: activeChapter.title.includes('BOSS') ? 'confused' : 'excited',
        message: activeChapter.plotIntro,
        isVisible: true
      });

      // Reset typewriter
      setDisplayText('');
      let i = 0;
      const text = activeChapter.plotIntro;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 40); // speed of typing
      return () => clearInterval(timer);
    }
  }, [viewState, activeChapter]);

  const startChapter = (chapter: StoryChapter) => {
    setActiveChapter(chapter);
    setCode(chapter.initialCode);
    setViewState('narrative');
  };

  const handleRunCode = async () => {
    if (!activeChapter) return;
    setIsRunning(true);
    setRobotState({ emotion: 'thinking', message: "Analyzing tactical solution...", isVisible: true });

    try {
      const execResult = await simulateCodeExecution(code, activeChapter.language);
      setOutput(execResult);

      const feedback = await getRobotFeedback(code, activeChapter.language, activeChapter.solutionCriteria);

      if (feedback.emotion === 'happy' || feedback.emotion === 'excited') {
         // Success
         setViewState('victory');
         setRobotState({ emotion: 'happy', message: activeChapter.plotOutro, isVisible: true });
         
         // Only award progress if this is the newest chapter
         if (activeChapter.id === user.storyProgress) {
             onUpdateStoryProgress(activeChapter.id + 1, activeChapter.xpReward);
         }
      } else {
         // Fail
         setRobotState({ emotion: 'confused', message: feedback.text, isVisible: true });
      }

    } catch (e) {
       setOutput("System Error");
    } finally {
      setIsRunning(false);
    }
  };

  // --- MAP VIEW ---
  if (viewState === 'map') {
    return (
      <div className="max-w-4xl mx-auto pb-20">
        <div className="text-center mb-12">
           <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4 drop-shadow-sm">
             Code Cosmos Saga
           </h2>
           <p className="text-slate-400 text-xl max-w-2xl mx-auto">
             Embark on a narrative adventure to save the digital universe from the Glitch King!
           </p>
        </div>

        <div className="grid gap-8 relative">
          {/* Connecting Line */}
          <div className="absolute left-10 top-10 bottom-10 w-1 bg-slate-800 hidden md:block z-0"></div>

          {STORY_CHAPTERS.map((chapter, index) => {
            const isUnlocked = index <= user.storyProgress;
            const isCompleted = index < user.storyProgress;
            const isBoss = chapter.title.includes("BOSS");

            return (
              <div 
                key={chapter.id}
                onClick={() => isUnlocked && startChapter(chapter)}
                className={`p-8 rounded-[2rem] border-4 transition-all duration-300 relative overflow-hidden group ml-0 md:ml-20 ${
                  isUnlocked 
                    ? isBoss 
                        ? 'border-red-600 bg-red-950/30 hover:bg-red-900/50 cursor-pointer shadow-[0_0_40px_rgba(220,38,38,0.2)]'
                        : 'border-indigo-500/30 bg-slate-800 hover:bg-slate-700 hover:scale-[1.02] cursor-pointer hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
                    : 'border-slate-800 bg-slate-900/50 opacity-50 grayscale cursor-not-allowed'
                }`}
              >
                 {/* Background Theme Indicator */}
                 <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none ${chapter.backgroundTheme.replace('bg-', 'bg-')}`}></div>

                 <div className="flex items-center gap-6 relative z-10">
                    {/* Node/Icon */}
                    <div className={`absolute -left-28 hidden md:flex w-16 h-16 rounded-full border-4 items-center justify-center z-20 ${
                       isCompleted ? 'bg-emerald-500 border-emerald-700 text-white' :
                       isUnlocked ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse' :
                       'bg-slate-800 border-slate-700 text-slate-500'
                    }`}>
                       {isCompleted ? <CheckCircle size={28} /> : <div className="font-black text-xl">{index + 1}</div>}
                    </div>

                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg ${
                      isBoss ? 'bg-red-600 text-white animate-bounce' :
                      isCompleted ? 'bg-emerald-500 text-white' : 
                      isUnlocked ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-700 text-slate-500'
                    }`}>
                       {isBoss ? <ShieldAlert size={40} /> : (isCompleted ? <CheckCircle size={40} /> : index + 1)}
                    </div>

                    <div className="flex-1">
                       <h3 className={`text-2xl md:text-3xl font-black mb-2 flex items-center gap-3 ${isBoss ? 'text-red-400 uppercase tracking-widest' : 'text-white'}`}>
                          {chapter.title} 
                          {!isUnlocked && <Lock size={20} className="text-slate-500" />}
                       </h3>
                       <p className="text-slate-400 font-medium">{chapter.plotIntro.substring(0, 60)}...</p>
                    </div>

                    <div className="hidden lg:block text-right bg-black/20 p-4 rounded-xl border border-white/5">
                       <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rewards</div>
                       <div className="text-yellow-400 font-black text-xl">{chapter.xpReward} XP</div>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- NARRATIVE / CINEMATIC VIEW ---
  if (viewState === 'narrative' && activeChapter) {
      const isBoss = activeChapter.title.includes("BOSS");
      
      return (
        <div className={`h-full flex flex-col items-center justify-center text-center p-8 rounded-[3rem] border-8 border-double relative overflow-hidden transition-colors duration-1000 ${
            isBoss ? 'border-red-600 bg-red-950 animate-pulse' : 'border-white/20 ' + activeChapter.backgroundTheme
        }`}>
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
           
           {isBoss && (
             <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)] pointer-events-none"></div>
           )}
           
           <div className="relative z-10 max-w-3xl animate-bounce-in">
              {isBoss && <div className="text-red-500 font-black text-2xl uppercase tracking-[1em] mb-4 animate-ping">Warning</div>}
              
              <h2 className={`text-5xl md:text-6xl font-black mb-12 drop-shadow-2xl ${isBoss ? 'text-red-500' : 'text-white'}`}>
                  {activeChapter.title}
              </h2>
              
              <div className={`bg-black/80 p-10 rounded-[2rem] border-2 mb-12 backdrop-blur-md shadow-2xl ${isBoss ? 'border-red-500' : 'border-indigo-400/50'}`}>
                 <div className="flex items-start gap-4 text-left">
                    <div className={`w-3 h-3 rounded-full mt-3 ${isBoss ? 'bg-red-500 animate-ping' : 'bg-green-400 animate-pulse'}`}></div>
                    <p className={`text-2xl md:text-3xl font-medium leading-relaxed font-mono ${isBoss ? 'text-red-200' : 'text-indigo-100'}`}>
                      "{displayText}"<span className="animate-pulse">_</span>
                    </p>
                 </div>
              </div>

              <Button size="lg" onClick={() => setViewState('challenge')} className={`text-xl px-12 py-6 ${isBoss ? 'bg-red-600 hover:bg-red-500 border-red-800' : ''}`}>
                 {isBoss ? 'ENGAGE ENEMY' : 'Start Mission'} <ArrowRight className="ml-3" />
              </Button>
           </div>
        </div>
      );
  }

  // --- VICTORY VIEW ---
  if (viewState === 'victory' && activeChapter) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="mb-6 relative">
                 <div className="absolute inset-0 bg-yellow-500 blur-[60px] opacity-40 animate-pulse"></div>
                 <h2 className="text-8xl relative z-10">🎉</h2>
            </div>
            <h3 className="text-5xl font-black text-emerald-400 mb-6 drop-shadow-lg">Mission Accomplished!</h3>
            <p className="text-2xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                "{activeChapter.plotOutro}"
            </p>
            <div className="flex gap-6">
               <Button variant="secondary" size="lg" onClick={() => setViewState('map')}>Back to Map</Button>
               {activeChapter.id < STORY_CHAPTERS.length - 1 && (
                   <Button size="lg" onClick={() => startChapter(STORY_CHAPTERS[activeChapter.id + 1])}>Next Chapter <ArrowRight size={20} className="ml-2" /></Button>
               )}
            </div>
        </div>
      );
  }

  // --- CHALLENGE / CODE VIEW ---
  return (
    <div className="h-full flex flex-col gap-4">
       <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => setViewState('map')}>Abort Mission</Button>
          <div className="flex items-center gap-3">
             {activeChapter?.title.includes("BOSS") && <ShieldAlert className="text-red-500 animate-pulse" />}
             <div className="text-lg font-bold text-indigo-400 uppercase tracking-widest">{activeChapter?.title}</div>
          </div>
       </div>

       <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Mission Intel */}
          <div className="lg:w-1/3 bg-slate-800 p-8 rounded-[2rem] border border-slate-700 flex flex-col shadow-xl">
             <h4 className="font-bold text-slate-400 uppercase text-xs mb-4 tracking-wider">Mission Objective</h4>
             <p className="text-white text-xl mb-8 leading-relaxed">{activeChapter?.taskDescription}</p>
             
             <div className="bg-black/30 p-6 rounded-2xl text-sm font-mono text-green-400 border border-slate-600 mb-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-20"><CheckCircle /></div>
               <span className="font-bold text-slate-500 block mb-2 text-xs uppercase">Success Criteria</span>
               {activeChapter?.solutionCriteria}
             </div>
             
             <div className="mt-auto pt-6 border-t border-slate-700">
                <div className="flex items-center gap-3 text-slate-400 text-sm italic">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                   Robot guide is active...
                </div>
             </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-slate-900 rounded-[2rem] border-4 border-indigo-500/20 overflow-hidden shadow-2xl relative">
             <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                <span className="font-mono text-slate-400 text-sm font-bold flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div> terminal.py
                </span>
                <Button size="sm" onClick={handleRunCode} disabled={isRunning} className={isRunning ? 'opacity-80' : ''}>
                   {isRunning ? <RefreshCw className="animate-spin mr-2" /> : <Play className="mr-2 fill-current" />}
                   {isRunning ? 'Compiling...' : 'Execute Code'}
                </Button>
             </div>
             <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full bg-[#1e293b] text-indigo-100 p-8 font-mono text-lg resize-none focus:outline-none"
                spellCheck={false}
             />
             <div className="h-40 bg-black p-6 font-mono text-sm border-t border-slate-700 shadow-inner">
                <div className="text-slate-500 text-xs mb-2 font-bold uppercase tracking-wider">System Output</div>
                <pre className={`whitespace-pre-wrap ${output.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                   {output || <span className="text-slate-600 italic">Waiting for input...</span>}
                </pre>
             </div>
          </div>
       </div>
    </div>
  );
};
