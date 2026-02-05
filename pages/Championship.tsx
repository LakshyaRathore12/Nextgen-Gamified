
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { simulateCodeExecution, getRobotFeedback } from '../services/geminiService';
import { Language, User, LeaderboardEntry } from '../types';
import { MOCK_LEADERBOARD } from '../constants';
import { Trophy, Clock, Play, AlertTriangle, ArrowLeft } from 'lucide-react';

interface ChampionshipProps {
  user: User;
  onWin: () => void;
  onBack: () => void;
  setRobotState: (state: any) => void;
}

export const Championship: React.FC<ChampionshipProps> = ({ user, onWin, onBack, setRobotState }) => {
  const [viewState, setViewState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [code, setCode] = useState('# Write your solution here\n');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  // Challenge Data
  const challenge = {
    title: "The Fibonacci Sequence",
    description: "Write a function that prints the first 10 numbers of the Fibonacci sequence. You have 2 minutes!",
    criteria: "Print 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 on separate lines.",
    language: Language.PYTHON
  };

  // Timer Logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (viewState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && viewState === 'playing') {
       handleGameOver(false, "Time's Up! The system locked down.");
    }
    return () => clearInterval(timer);
  }, [viewState, timeLeft]);

  // Leaderboard Logic
  const champions: LeaderboardEntry[] = [
      ...MOCK_LEADERBOARD, 
      { 
          id: 'me', name: user.name, xp: user.xp, 
          avatarColor: user.avatarColor, avatarAccessory: user.avatarAccessory, 
          isFriend: false, championshipWins: user.championshipWins 
      }
  ].sort((a, b) => b.championshipWins - a.championshipWins).slice(0, 5);

  const startMatch = () => {
     setViewState('playing');
     setTimeLeft(120);
     setCode('# Print the first 10 Fibonacci numbers\n');
     setRobotState({ emotion: 'excited', message: "The clock is ticking! Focus!", isVisible: true });
  };

  const handleGameOver = (win: boolean, msg: string) => {
     setViewState('result');
     setResultMessage(msg);
     if (win) {
         setRobotState({ emotion: 'happy', message: "Unbelievable! You are a coding machine!", isVisible: true });
     } else {
         setRobotState({ emotion: 'confused', message: "Mission Failed. Don't give up!", isVisible: true });
     }
  };

  const handleRun = async () => {
    setIsRunning(true);
    
    try {
      const execResult = await simulateCodeExecution(code, challenge.language);
      setOutput(execResult);

      const feedback = await getRobotFeedback(code, challenge.language, challenge.criteria);
      
      if (feedback.emotion === 'happy' || feedback.emotion === 'excited') {
         handleGameOver(true, "Correct! Mainframe secured.");
      } else {
         setRobotState({ emotion: 'thinking', message: feedback.text, isVisible: true });
      }
    } catch (e) {
      setOutput('Error executing code.');
    } finally {
      setIsRunning(false);
    }
  };

  if (viewState === 'result') {
    const isWin = resultMessage.includes("Correct");
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-bounce-in">
        <h1 className="text-8xl mb-6">{isWin ? '🏆' : '⚠️'}</h1>
        <h2 className={`text-5xl font-black mb-4 ${isWin ? 'text-yellow-400' : 'text-red-400'}`}>
            {isWin ? 'VICTORY!' : 'GAME OVER'}
        </h2>
        <p className="text-2xl text-slate-300 mb-8 max-w-lg mx-auto">{resultMessage}</p>
        
        <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setViewState('lobby')}>Back to Lobby</Button>
            {isWin && <Button onClick={onWin} size="lg" variant="success">Claim Trophy</Button>}
        </div>
      </div>
    );
  }

  if (viewState === 'playing') {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      
      return (
        <div className="max-w-6xl mx-auto h-full flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <Button variant="secondary" onClick={() => setViewState('lobby')} size="sm"><ArrowLeft size={16} className="mr-2"/> Give Up</Button>
              <div className={`px-6 py-2 rounded-full border-2 font-black text-xl flex items-center gap-2 ${timeLeft < 30 ? 'bg-red-900/50 border-red-500 text-red-400 animate-pulse' : 'bg-slate-800 border-slate-600 text-white'}`}>
                  <Clock /> {mins}:{secs < 10 ? `0${secs}` : secs}
              </div>
           </div>

           <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800 rounded-3xl p-8 border-2 border-slate-700 shadow-xl">
                 <h2 className="text-3xl font-black text-white mb-4">{challenge.title}</h2>
                 <p className="text-lg text-slate-300 mb-6 leading-relaxed">{challenge.description}</p>
                 <div className="bg-black/30 p-4 rounded-xl border border-slate-600 font-mono text-sm text-yellow-400">
                    <strong className="text-slate-500 block mb-1 uppercase text-xs">Criteria:</strong>
                    {challenge.criteria}
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="flex-1 bg-slate-900 rounded-3xl border-4 border-indigo-500/30 overflow-hidden flex flex-col relative shadow-2xl">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 w-full bg-[#1e293b] text-indigo-100 p-6 font-mono text-lg resize-none focus:outline-none"
                        spellCheck={false}
                    />
                    <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end">
                        <Button onClick={handleRun} disabled={isRunning} variant="primary">
                        {isRunning ? 'Checking...' : 'Submit Solution'}
                        </Button>
                    </div>
                 </div>
                 <div className="h-32 bg-black rounded-2xl p-4 font-mono text-sm border border-slate-700 overflow-auto text-slate-300">
                    <div className="text-slate-500 mb-1 font-bold text-xs uppercase">Console Output</div>
                    {output}
                 </div>
              </div>
           </div>
        </div>
      );
  }

  // Lobby View
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="text-center mb-12">
         <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 mb-4 drop-shadow-sm">
           Championship Arena
         </h1>
         <p className="text-slate-400 text-xl">Compete against the world's best coders in timed challenges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         {/* Start Card */}
         <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-bounce">
                    <Trophy size={48} className="text-slate-900" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Weekly Challenge</h3>
                <p className="text-indigo-200 mb-8">Can you solve the Fibonacci Crisis in under 2 minutes?</p>
                <Button size="lg" onClick={startMatch} className="w-full">
                   Enter Arena <Play size={20} className="ml-2"/>
                </Button>
            </div>
         </div>

         {/* Leaderboard Card */}
         <div className="bg-slate-800 rounded-[2.5rem] p-8 border border-slate-700 shadow-xl overflow-hidden">
             <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" /> Hall of Champions
             </h3>
             <div className="space-y-4">
                {champions.map((champ, i) => (
                    <div key={champ.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                        <div className={`font-black text-lg w-8 ${i===0 ? 'text-yellow-400': i===1 ? 'text-slate-300' : i===2 ? 'text-orange-400' : 'text-slate-600'}`}>
                            #{i+1}
                        </div>
                        <div className="w-10 h-10 rounded-full border border-slate-600" style={{backgroundColor: champ.avatarColor}}></div>
                        <div className="flex-1">
                            <div className="font-bold text-white text-sm">{champ.name} {champ.id === 'me' && '(You)'}</div>
                        </div>
                        <div className="text-right">
                             <div className="font-black text-yellow-500">{champ.championshipWins}</div>
                             <div className="text-[10px] text-slate-500 uppercase font-bold">Wins</div>
                        </div>
                    </div>
                ))}
             </div>
         </div>
      </div>
      
      <div className="text-center">
         <Button variant="secondary" onClick={onBack}>Return to Base</Button>
      </div>
    </div>
  );
};
