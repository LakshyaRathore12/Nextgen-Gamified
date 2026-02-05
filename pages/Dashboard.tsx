
import React, { useState, useEffect } from 'react';
import { User, Lesson, Language } from '../types';
import { Button } from '../components/Button';
import { CheckCircle, Lock, Gift, Trophy, ArrowRight, Code2, Globe, FileJson, LayoutTemplate, Coffee, Database, Layers, Cloud, Loader2 } from 'lucide-react';
import { fetchLessons } from '../services/dataService';
import { IS_CONFIGURED } from '../services/supabase';

interface DashboardProps {
  user: User;
  onStartLesson: (lessonId: string) => void;
  onNavigate: (page: string) => void;
  onSpin: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartLesson, onNavigate, onSpin }) => {
  const isDark = user.themePreference === 'dark';
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Fetch lessons on mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      // If we are configured but have 0 lessons in DB, fetchLessons triggers auto-seed
      // We can infer seeding is happening if it takes a bit longer, but for now we just show loading.
      const data = await fetchLessons();
      setLessons(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // Determine available languages from the lessons provided
  const availableLanguages = Array.from(new Set(lessons.map(l => l.language))) as Language[];
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.PYTHON);

  // Default to first available if Python not present
  useEffect(() => {
    if (availableLanguages.length > 0 && !availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0]);
    }
  }, [lessons]);

  const filteredLessons = lessons.filter(l => l.language === selectedLanguage);

  const isLocked = (lesson: Lesson) => {
    // Find index in the *filtered* list to enforce linear progression per language
    const index = filteredLessons.findIndex(l => l.id === lesson.id);
    if (index === 0) return false;
    const prevLessonId = filteredLessons[index - 1].id;
    return !user.completedLessons.includes(prevLessonId);
  };

  const canSpin = () => {
    if (!user.lastSpinDate) return true;
    const last = new Date(user.lastSpinDate).toDateString();
    const today = new Date().toDateString();
    return last !== today;
  };

  const getLanguageIcon = (lang: Language) => {
    switch (lang) {
      case Language.PYTHON: return <Database size={18} />;
      case Language.JS: return <FileJson size={18} />;
      case Language.CPP: return <Code2 size={18} />;
      case Language.C: return <Code2 size={18} />;
      case Language.JAVA: return <Coffee size={18} />;
      case Language.REACT: return <Layers size={18} />;
      case Language.HTML: return <Globe size={18} />;
      case Language.CSS: return <LayoutTemplate size={18} />;
      default: return <Code2 size={18} />;
    }
  };

  const getLanguageColor = (lang: Language) => {
    switch (lang) {
      case Language.PYTHON: return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/50';
      case Language.JS: return 'bg-yellow-400/20 text-yellow-600 border-yellow-400/50';
      case Language.CPP: return 'bg-blue-600/20 text-blue-600 border-blue-600/50';
      case Language.JAVA: return 'bg-orange-600/20 text-orange-600 border-orange-600/50';
      case Language.REACT: return 'bg-cyan-500/20 text-cyan-600 border-cyan-500/50';
      case Language.HTML: return 'bg-orange-500/20 text-orange-600 border-orange-500/50';
      case Language.CSS: return 'bg-blue-400/20 text-blue-600 border-blue-400/50';
      default: return 'bg-indigo-500/20 text-indigo-600 border-indigo-500/50';
    }
  };

  const cardBaseClass = isDark 
    ? "bg-slate-800 border-slate-900" 
    : "bg-white border-slate-200 shadow-xl shadow-slate-200/50";

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Welcome Banner & Daily Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] p-8 md:p-12 text-left shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-2 text-white">Welcome, {user.name}! 🚀</h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-md">Your coding streak is on fire! The galaxy needs your logic skills to fix the mainframe.</p>
            
            <div className="flex flex-wrap gap-4 text-white">
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 min-w-[140px] border border-white/10">
                  <div className="p-2 bg-indigo-500/50 rounded-lg">⭐</div>
                  <div>
                    <div className="text-2xl font-black">{user.xp}</div>
                    <div className="text-xs uppercase tracking-wider text-indigo-200">Total XP</div>
                  </div>
               </div>
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 min-w-[140px] border border-white/10">
                  <div className="p-2 bg-purple-500/50 rounded-lg">📜</div>
                  <div>
                    <div className="text-2xl font-black">{user.completedLessons.length}</div>
                    <div className="text-xs uppercase tracking-wider text-indigo-200">Missions</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-4 flex flex-col">
           {/* Lucky Spin */}
           <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center items-center text-center shadow-lg border-b-4 border-pink-800 text-white">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              <Gift size={48} className="mb-2 animate-bounce" />
              <h3 className="text-xl font-bold mb-1">Daily Lucky Spin</h3>
              {canSpin() ? (
                <Button variant="secondary" size="sm" onClick={onSpin} className="mt-2 w-full animate-pulse border-white/20">
                  Spin Now!
                </Button>
              ) : (
                <span className="text-pink-200 text-sm mt-2 font-bold bg-black/20 px-3 py-1 rounded-full">Come back tomorrow!</span>
              )}
           </div>

           {/* Championship Entry */}
           <div className="flex-1 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center items-center text-center shadow-lg border-b-4 border-orange-800 cursor-pointer hover:scale-105 transition-transform text-white" onClick={() => onNavigate('championship')}>
              <Trophy size={48} className="mb-2 text-yellow-100" />
              <h3 className="text-xl font-bold mb-1">Championship</h3>
              <p className="text-xs text-yellow-100 mb-3">Compete for the cup!</p>
              <div className="flex items-center gap-2 text-sm font-bold bg-white/20 px-4 py-1 rounded-full">
                Enter Arena <ArrowRight size={14} />
              </div>
           </div>
        </div>
      </div>

      {/* Course Selector & Mission Map */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-2xl font-black flex items-center gap-3 text-indigo-400 uppercase tracking-widest">
            <span className="text-3xl">🗺️</span> Mission Map
          </h3>
          
          {/* Track Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {availableLanguages.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap border-2 ${
                  selectedLanguage === lang 
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30' 
                    : `${isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-200'} hover:bg-slate-700 hover:text-white`
                }`}
              >
                {getLanguageIcon(lang)} {lang}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-slate-700">
            <div className="inline-block relative">
               <Loader2 size={48} className="text-indigo-500 animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Cloud size={16} className="text-white" />
               </div>
            </div>
            <h3 className="mt-4 text-xl font-black text-white">Connecting to Cloud Base...</h3>
            <p className="text-slate-400 font-bold mt-2">Syncing 350+ missions to your database.</p>
            {IS_CONFIGURED && <p className="text-xs text-emerald-400 mt-4 uppercase tracking-wider animate-pulse font-bold">First time setup in progress...</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLessons.length === 0 ? (
               <div className={`col-span-3 text-center py-20 rounded-3xl border border-dashed ${isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-100 border-slate-300'}`}>
                  <p className="text-slate-400 font-bold text-xl">New missions coming soon for {selectedLanguage}!</p>
               </div>
            ) : (
               filteredLessons.map((lesson) => {
                  const locked = isLocked(lesson);
                  const completed = user.completedLessons.includes(lesson.id);

                  return (
                    <div 
                      key={lesson.id}
                      className={`relative p-8 rounded-[2rem] border-b-8 transition-all duration-300 group ${
                        locked 
                          ? `${isDark ? 'bg-slate-800 border-slate-900' : 'bg-slate-100 border-slate-200'} opacity-60 grayscale` 
                          : completed 
                              ? 'bg-emerald-900/40 border-emerald-700'
                              : `${cardBaseClass} hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20`
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                          <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${getLanguageColor(lesson.language)}`}>
                            {lesson.language}
                          </span>
                          {completed && <div className="bg-emerald-500 rounded-full p-1"><CheckCircle size={20} className="text-white" /></div>}
                          {locked && <Lock className="text-slate-500" />}
                      </div>

                      <h4 className={`text-2xl font-black mb-3 leading-tight min-h-[4rem] flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</h4>
                      <div className="flex items-center gap-2 mb-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded bg-black/30 ${
                            lesson.difficulty === 'Beginner' ? 'text-green-400' :
                            lesson.difficulty === 'Intermediate' ? 'text-yellow-400' :
                            lesson.difficulty === 'Advanced' ? 'text-orange-400' :
                            'text-red-400'
                          }`}>{lesson.difficulty}</span>
                      </div>

                      <p className={`text-sm mb-8 leading-relaxed line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{lesson.description}</p>
                      
                      <div className="flex justify-between items-end mt-auto">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-bold uppercase">Reward</span>
                            <div className="text-sm font-bold text-yellow-500">+{lesson.xpReward} XP</div>
                          </div>
                          <Button 
                            size="sm" 
                            variant={locked ? 'secondary' : completed ? 'success' : 'primary'}
                            disabled={locked}
                            onClick={() => !locked && onStartLesson(lesson.id)}
                            className="rounded-xl"
                          >
                            {locked ? 'Locked' : completed ? 'Replay' : 'Start'}
                          </Button>
                      </div>
                    </div>
                  );
               })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
