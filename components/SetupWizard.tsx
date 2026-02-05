
import React, { useState } from 'react';
import { Button } from './Button';
import { Database, Check, Copy, Key, Globe, AlertTriangle } from 'lucide-react';
import { reconnectSupabase } from '../services/supabase';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = () => {
    if (!url.trim() || !key.trim()) {
      setError('Please enter both the URL and the Key.');
      return;
    }

    // AUTO-FIX: Ensure URL starts with https://
    let validUrl = url.trim();
    if (!validUrl.startsWith('http')) {
      validUrl = `https://${validUrl}`;
    }

    // Save to local storage
    localStorage.setItem('NEXTGEN_SUPABASE_URL', validUrl);
    localStorage.setItem('NEXTGEN_SUPABASE_KEY', key.trim());
    
    // Clear error and move to next step (DO NOT RELOAD YET)
    setError('');
    setStep(2);
  };

  const handleFinalize = () => {
    reconnectSupabase();
    // No reload needed, App.tsx handles the state change via IS_CONFIGURED check or re-render
  };

  const sqlCode = `
-- 1. Create Profiles Table (Safe to run multiple times)
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text unique not null,
  pin text not null default '0000', -- Simple password for kids
  friend_code text unique not null,
  xp bigint default 0,
  level bigint default 1,
  coins bigint default 50,
  streak bigint default 1,
  avatar_config jsonb default '{"color": "#6366f1", "eyes": "Normal", "mouth": "Smile", "accessory": "None"}'::jsonb,
  completed_lessons text[] default array[]::text[],
  friends text[] default array[]::text[],
  theme_preference text default 'dark',
  is_muted boolean default false,
  championship_wins bigint default 0,
  last_spin_date text,
  unlocked_secret boolean default false
);

-- 2. Create Lessons Table
create table if not exists lessons (
  id text primary key,
  title text not null,
  language text not null,
  difficulty text not null,
  description text not null,
  concept_html text not null,
  initial_code text not null,
  solution_code text not null,
  solution_criteria text not null,
  xp_reward int default 50,
  coin_reward int default 10
);

-- 3. Reset Policies (To avoid conflicts)
drop policy if exists "Public Profiles Access" on profiles;
drop policy if exists "Public Lessons Access" on lessons;

alter table profiles enable row level security;
alter table lessons enable row level security;

create policy "Public Profiles Access" on profiles for all using (true);
create policy "Public Lessons Access" on lessons for all using (true);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-nunito">
      <div className="max-w-2xl w-full bg-slate-800 rounded-3xl p-10 border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Database size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">Connect to Cloud</h1>
          <p className="text-slate-400">Link your Supabase database to save progress and lessons.</p>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
               <h3 className="font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-indigo-400"/> Step 1: Get Credentials</h3>
               <p className="text-sm text-slate-400 mb-2">1. Go to <a href="https://supabase.com" target="_blank" className="text-indigo-400 underline">Supabase.com</a> and create a project.</p>
               <p className="text-sm text-slate-400">2. Go to <strong>Settings &rarr; API</strong>.</p>
            </div>
            
            {error && (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-xl border border-red-500/30 flex items-center gap-2 text-sm font-bold">
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Project URL</label>
              <input 
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Anon / Public Key</label>
              <input 
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <Button onClick={handleConnect} size="lg" className="w-full mt-4">
              Connect Database
            </Button>
            
            <button onClick={onComplete} className="w-full text-center text-slate-500 text-sm mt-4 hover:text-white">
              Skip (Use Offline Mock Data)
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-green-500/20 text-green-400 p-4 rounded-xl border border-green-500/30 flex items-center gap-3">
               <Check /> Keys Saved! Now setup the tables.
             </div>

             <div>
               <h3 className="font-bold mb-2">Step 2: Create Tables</h3>
               <p className="text-sm text-slate-400 mb-4">Run this SQL in your Supabase <strong>SQL Editor</strong> to setup the database.</p>
               
               <div className="relative">
                 <pre className="bg-black p-4 rounded-xl text-xs text-green-400 font-mono h-48 overflow-y-auto border border-slate-700">
                   {sqlCode}
                 </pre>
                 <button 
                   onClick={handleCopy}
                   className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2"
                 >
                   {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy SQL'}
                 </button>
               </div>
             </div>

             <Button onClick={handleFinalize} size="lg" variant="success" className="w-full">
               I Have Run The SQL &rarr; Start App
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};
