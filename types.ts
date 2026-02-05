
export enum Language {
  BLOCKS = 'Blocks',
  PYTHON = 'Python',
  C = 'C',
  CPP = 'C++',
  JAVA = 'Java',
  HTML = 'HTML',
  CSS = 'CSS',
  JS = 'JavaScript',
  REACT = 'React'
}

export interface User {
  name: string;
  avatarColor: string;
  avatarAccessory: string;
  avatarEyes: string;
  avatarMouth: string;
  xp: number;
  level: number;
  streak: number;
  coins: number;
  completedLessons: string[];
  friends: FriendProfile[];
  friendCode: string;
  lastSpinDate: string | null;
  championshipWins: number;
  themePreference: 'light' | 'dark';
  isMuted: boolean;
  voicePitch: number;
  voiceRate: number;
  unlockedSecret?: boolean;
  isGuest?: boolean;
  storyProgress: number; 
}

export interface FriendProfile {
  id: string;
  name: string;
  avatarColor: string;
  avatarAccessory: string;
  avatarEyes: string;
  avatarMouth: string;
  xp: number;
  level: number;
  championshipWins: number;
}

export interface Lesson {
  id: string;
  title: string;
  language: Language;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  conceptHTML: string;
  initialCode: string;
  solutionCriteria: string;
  solutionCode: string;
  xpReward: number;
  coinReward: number;
}

export interface StoryChapter {
  id: number;
  title: string;
  plotIntro: string; 
  plotOutro: string; 
  backgroundTheme: string; 
  language: Language;
  taskDescription: string;
  initialCode: string;
  solutionCriteria: string;
  xpReward: number;
}

export interface RobotState {
  emotion: 'happy' | 'thinking' | 'confused' | 'excited' | 'idle';
  message: string;
  isVisible: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  avatarColor: string;
  avatarAccessory: string;
  isFriend: boolean;
  championshipWins: number;
}