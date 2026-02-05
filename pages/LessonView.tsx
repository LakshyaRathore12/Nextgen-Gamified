import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Play, RefreshCw, BookOpen, Code, GraduationCap, Unlock, AlertTriangle, Eye, SkipForward, X } from 'lucide-react';
import { getRobotFeedback, simulateCodeExecution } from '../services/geminiService';
import { fetchLessons } from '../services/dataService';

interface LessonViewProps {
  lessonId: string;
  onComplete: (xp: number, coins: number) => void;
  onBack: () => void;
  setRobotState: (state: any) => void;
  theme: 'light' | 'dark';
}

export const LessonView: React.FC<LessonViewProps> = ({ 
  lessonId, 
  onComplete, 
  onBack,
  setRobotState,
  theme
}) => {
  const isDark = theme === 'dark';
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'code'>('learn');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConfirmSkip, setShowConfirmSkip] = useState(false);

  useEffect(() => {
    // Fetch individual lesson logic
    const load = async () => {
      const lessons = await fetchLessons();
      const found = lessons.find(l => l.id === lessonId);
      if (found) {
        setLesson(found);
        setCode(found.initialCode);
        
        // Initial Greeting
        setRobotState({
          emotion: 'happy',
          message: `Welcome to ${found.title}! Let's learn the concepts first.`,
          isVisible: true
        });
      }
    };
    load();
  }, [lessonId]);

  useEffect(() => {
    if (!lesson) return;
    // Context switch when tab changes
    if (activeTab === 'learn') {
       // already handled on mount for learn
    } else {
      setRobotState({
        emotion: 'excited',
        message: "Time to code! Show me what you learned.",
        isVisible: true
      });
    }
  }, [activeTab]);

  const handleRun = async () => {
    if (!lesson) return;
    setIsRunning(true);
    setStatus('idle');
    setOutput('Compiling on NextGen Servers...');
    setRobotState({ emotion: 'thinking', message: "Analyzing your code matrix...", isVisible: true });

    try {
      const executionResult = await simulateCodeExecution(code, lesson.language);
      setOutput(executionResult);

      const feedback = await getRobotFeedback(code, lesson.language, lesson.solutionCriteria);
      
      setRobotState({
        emotion: feedback.emotion,
        message: feedback.text,
        isVisible: true
      });

      if (feedback.emotion === 'happy' || feedback.emotion === 'excited') {
        setStatus('success');
      } else {
        setStatus('error');
      }

    } catch (error) {
      setOutput('System Malfunction!');
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRevealAnswer = () => {
    if (!lesson) return;
    setCode(lesson.solutionCode);
    setRobotState({
      emotion: 'happy',
      message: "I've pasted the solution! Study it to understand how it works, then try running it!",
      isVisible: true
    });
  };

  const handleSkipMission = () => {
     onComplete(0, 0);
     setRobotState({
         emotion: 'confused',
         message: "Mission skipped! Moving to the next coordinate.",
         isVisible: true
     });
  };

  // Theme Styles
  const containerClass = isDark ? "bg-slate-900/50 border-slate-700" : "bg-white border-slate-200 shadow-xl";
  const panelBg = isDark ? "bg-slate-800/50" : "bg-slate-50";
  const editorBg = isDark ? "bg-[#1e293b] text-indigo-100" : "bg-slate-100 text-slate-900 border-l border-slate-200";
  const terminalBg = isDark ? "bg-black border-slate-700" : "bg-slate-900 border-slate-200";
  const textColor = isDark ? "text-white" : "text-slate-900";

  if (!lesson) return <div className="text-white text-center p-10">Loading mission data...</div>;

  return (
    <div className="h-full flex flex-col gap-4 max-h-[90vh]">
      <div className="flex items-center justify-between">
         <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors bg-slate-800 px-4 py-2 rounded-xl">
           <ArrowLeft size={20} /> <span className="font-bold">Exit</span>
         </button>
         
         {/* Tab Switcher */}
         <div className="bg-slate-800 p-1 rounded-2xl flex">
            <button 
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'learn' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <BookOpen size={18} /> Learn
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Code size={18} /> Practice
            </button>
         </div>
         <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col ${containerClass} backdrop-blur-sm rounded-3xl border overflow-hidden`}>
          
          {activeTab === 'learn' ? (
            <div className={`flex-1 p-12 overflow-y-auto flex flex-col items-center text-center max-w-3xl mx-auto ${textColor}`}>
               <div className="w-20 h-20 bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 border-4 border-indigo-500/30">
                 <GraduationCap size={40} className="text-indigo-400" />
               </div>
               <h2 className="text-4xl font-black mb-6">{lesson.title}</h2>
               <div 
                 className={`prose prose-lg ${isDark ? 'prose-invert text-slate-300' : 'text-slate-600'} leading-relaxed mb-10`}
                 dangerouslySetInnerHTML={{ __html: lesson.conceptHTML }}
               />
               <Button size="lg" onClick={() => setActiveTab('code')} className="mt-auto animate-pulse">
                 I'm Ready to Code!
               </Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row h-full">
               {/* Left: Task */}
               <div className={`lg:w-1/3 ${panelBg} p-6 border-r border-slate-700 overflow-y-auto flex flex-col`}>
                 <h3 className="font-bold text-indigo-400 mb-2 uppercase tracking-wider text-xs">Mission Brief</h3>
                 <p className={`text-lg mb-6 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{lesson.description}</p>
                 
                 <div className={`p-4 rounded-xl border mb-6 ${isDark ? 'bg-black/40 border-slate-600' : 'bg-white border-slate-300'}`}>
                    <h4 className="font-bold text-slate-500 text-xs uppercase mb-2">Success Criteria</h4>
                    <p className={`text-sm font-mono ${isDark ? 'text-green-300' : 'text-green-600'}`}>{lesson.solutionCriteria}</p>
                 </div>

                 {status === 'success' && (
                  <div className="animate-bounce-in bg-emerald-500/20 border border-emerald-500 p-6 rounded-2xl text-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <h3 className="text-2xl font-black text-emerald-500 mb-2">Mission Complete!</h3>
                    <div className="flex justify-center gap-4 mb-4 text-xl">
                        <span className="font-bold text-yellow-500">+{lesson.xpReward} XP</span>
                        <span className="font-bold text-yellow-500">+{lesson.coinReward} 🪙</span>
                    </div>
                    <Button variant="success" onClick={() => onComplete(lesson.xpReward, lesson.coinReward)} className="w-full">
                        Collect Rewards
                    </Button>
                  </div>
                 )}

                 {/* Help / Skip Section */}
                 <div className="mt-auto space-y-3 pt-6 border-t border-slate-700">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Stuck?</h4>
                    
                    {/* SEE ANSWER BUTTON */}
                    <div className="flex gap-2 mb-2">
                       <Button 
                         variant="secondary" 
                         size="sm" 
                         className="flex-1 text-xs hover:bg-yellow-900/20 hover:text-yellow-400" 
                         onClick={handleRevealAnswer}
                         disabled={status === 'success'}
                       >
                           <Eye size={14} className="mr-1" /> See Answer (Free)
                       </Button>
                    </div>
                    
                    {/* SKIP LEVEL BUTTON GROUP */}
                    <div className="flex gap-2">
                        {!showConfirmSkip ? (
                           <Button 
                              variant="secondary" 
                              size="sm" 
                              className="flex-1 text-xs hover:bg-red-900/50 hover:text-red-300 hover:border-red-900"
                              onClick={() => setShowConfirmSkip(true)}
                              disabled={status === 'success'}
                           >
                              <SkipForward size={14} className="mr-1" /> Skip Level
                           </Button>
                        ) : (
                          <div className="flex-1 flex gap-1 animate-bounce-in">
                             <Button variant="danger" size="sm" className="flex-1 text-xs" onClick={handleSkipMission}>Confirm Skip (0 XP)</Button>
                             <Button variant="secondary" size="sm" className="px-2" onClick={() => setShowConfirmSkip(false)}><X size={14}/></Button>
                          </div>
                        )}
                    </div>

                 </div>
               </div>

               {/* Right: Code Editor */}
               <div className="lg:w-2/3 flex flex-col">
                  <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                    <span className="font-mono text-sm text-slate-400 font-bold">editor.{lesson.language.toLowerCase().replace('++','cpp')}</span>
                    <Button size="sm" onClick={handleRun} disabled={isRunning || status === 'success'} className={isRunning ? 'opacity-50' : ''}>
                      {isRunning ? <RefreshCw className="animate-spin mr-2" /> : <Play className="mr-2 fill-current" />}
                      {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`flex-1 w-full ${editorBg} p-6 font-mono text-lg resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500/50`}
                    spellCheck={false}
                  />
                  <div className={`h-40 ${terminalBg} p-4 font-mono text-sm border-t overflow-y-auto`}>
                    <div className="text-slate-500 text-xs mb-1 font-bold">TERMINAL OUTPUT</div>
                    <pre className={`whitespace-pre-wrap ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {output || <span className="text-slate-500 italic">Ready for execution...</span>}
                    </pre>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};