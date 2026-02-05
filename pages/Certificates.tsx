import React, { useState } from 'react';
import { User, Language } from '../types';
import { Button } from '../components/Button';
import { CertificatePreview } from '../components/CertificatePreview';
import { Lock, CheckCircle, Award, Trophy } from 'lucide-react';

interface CertificatesProps {
  user: User;
}

export const Certificates: React.FC<CertificatesProps> = ({ user }) => {
  const [selectedCert, setSelectedCert] = useState<{course: string, date: string} | null>(null);

  // Define total lessons per language (Set to 100 based on constants.ts logic)
  const TOTAL_LESSONS = 100;

  const languages = [
    { id: Language.PYTHON, label: 'Python Master', color: 'from-yellow-400 to-yellow-600' },
    { id: Language.JS, label: 'JavaScript Wizard', color: 'from-yellow-300 to-orange-400' },
    { id: Language.HTML, label: 'HTML Architect', color: 'from-orange-400 to-red-500' },
    { id: Language.CSS, label: 'CSS Artist', color: 'from-blue-400 to-cyan-400' },
    { id: Language.JAVA, label: 'Java Engineer', color: 'from-red-500 to-red-700' },
    { id: Language.CPP, label: 'C++ Pioneer', color: 'from-blue-600 to-indigo-600' },
    { id: Language.REACT, label: 'React Specialist', color: 'from-cyan-400 to-blue-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {selectedCert && (
        <CertificatePreview 
          userName={user.name}
          courseName={selectedCert.course}
          date={selectedCert.date}
          onClose={() => setSelectedCert(null)}
        />
      )}

      <div className="text-center mb-12">
         <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 mb-4">
           Hall of Fame
         </h2>
         <p className="text-slate-400 text-lg">
           Complete 100% of a course to unlock your official certification.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {languages.map((lang) => {
          // Calculate Progress
          // Filter completed lessons that start with the language ID (e.g., "python-")
          const completedCount = user.completedLessons.filter(l => l.startsWith(lang.id.toLowerCase())).length;
          const progressPercent = Math.min(100, Math.round((completedCount / TOTAL_LESSONS) * 100));
          const isUnlocked = progressPercent >= 100;

          return (
            <div key={lang.id} className="bg-slate-800 rounded-3xl p-8 border border-slate-700 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
               {/* Background Glow */}
               <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${lang.color} blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity`}></div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                     <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${lang.color} flex items-center justify-center shadow-lg`}>
                        <Award size={32} className="text-white" />
                     </div>
                     {isUnlocked ? (
                       <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 border border-emerald-500/50">
                          <CheckCircle size={14} /> Certified
                       </div>
                     ) : (
                       <div className="bg-slate-700/50 text-slate-400 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 border border-slate-600">
                          <Lock size={14} /> Locked
                       </div>
                     )}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">{lang.label}</h3>
                  <p className="text-slate-400 text-sm mb-6">Master all {TOTAL_LESSONS} levels to claim reward.</p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                     <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                        <span>Progress</span>
                        <span className={isUnlocked ? 'text-emerald-400' : 'text-white'}>{progressPercent}%</span>
                     </div>
                     <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                        <div 
                          className={`h-full bg-gradient-to-r ${lang.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                     </div>
                     <div className="mt-2 text-right text-xs text-slate-500 font-mono">
                        {completedCount} / {TOTAL_LESSONS} Missions
                     </div>
                  </div>

                  <Button 
                    className="w-full"
                    variant={isUnlocked ? 'primary' : 'secondary'}
                    disabled={!isUnlocked}
                    onClick={() => setSelectedCert({ 
                        course: lang.label, 
                        date: new Date().toLocaleDateString() 
                    })}
                  >
                    {isUnlocked ? 'View Certificate' : 'Keep Coding to Unlock'}
                  </Button>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};