
import { supabase, IS_CONFIGURED } from './supabase';
import { User, Lesson } from '../types';
import { INITIAL_USER_STATE, MOCK_LESSONS, generateFriendCode, AVATAR_COLORS } from '../constants';

// --- USER SERVICES ---

export const loginAsGuest = async (): Promise<User> => {
  return {
    ...INITIAL_USER_STATE,
    name: 'Guest Commander',
    friendCode: 'GUEST-000',
    isGuest: true,
    avatarColor: '#10b981', // Green for guest
    avatarAccessory: 'Cap',
    xp: 0,
    level: 1,
    coins: 0
  };
};

export const loginOrRegisterUser = async (name: string, pin: string, isSignUp: boolean): Promise<User> => {
  if (!IS_CONFIGURED) {
    console.warn("Supabase not configured. Using Mock Data.");
    const saved = localStorage.getItem('nextgen_user');
    if (saved) return JSON.parse(saved);
    return { ...INITIAL_USER_STATE, name, friendCode: generateFriendCode(name) };
  }

  // 1. Try to find user
  const { data: existingUser, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('name', name)
    .single();

  if (isSignUp) {
    // REGISTRATION MODE
    if (existingUser) {
       throw new Error("Hero Name already taken. Try another!");
    }

    const friendCode = generateFriendCode(name);
    const newUserProfile = {
      name,
      pin, // Save the PIN
      friend_code: friendCode,
      xp: 0,
      level: 1,
      coins: 50,
      streak: 1,
      avatar_config: {
        color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        eyes: 'Normal',
        mouth: 'Smile',
        accessory: 'None',
        voicePitch: 1.2,
        voiceRate: 1.0
      },
      completed_lessons: [],
      friends: [],
      theme_preference: 'dark',
      is_muted: false,
      championship_wins: 0,
      last_spin_date: null,
      unlocked_secret: false,
      story_progress: 0 // New Field
    };

    const { data: createdUser, error: createError } = await supabase
      .from('profiles')
      .insert([newUserProfile])
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      throw new Error("Could not create user.");
    }

    return mapDbProfileToUser(createdUser);

  } else {
    // LOGIN MODE
    if (!existingUser) {
      throw new Error("User not found. Check spelling or Sign Up.");
    }
    
    // Check PIN (Simple comparison)
    if (existingUser.pin !== pin) {
       throw new Error("Wrong Secret Code!");
    }

    return mapDbProfileToUser(existingUser);
  }
};

export const updateUserProfile = async (user: User) => {
  // DO NOT SAVE GUEST DATA TO DB
  if (user.isGuest) {
    return; 
  }

  if (!IS_CONFIGURED) {
    localStorage.setItem('nextgen_user', JSON.stringify(user));
    return;
  }

  const dbProfile = {
    xp: user.xp,
    level: user.level,
    coins: user.coins,
    streak: user.streak,
    avatar_config: {
      color: user.avatarColor,
      eyes: user.avatarEyes,
      mouth: user.avatarMouth,
      accessory: user.avatarAccessory,
      voicePitch: user.voicePitch,
      voiceRate: user.voiceRate
    },
    completed_lessons: user.completedLessons,
    friends: user.friends.map(f => f.id), 
    theme_preference: user.themePreference,
    is_muted: user.isMuted,
    championship_wins: user.championshipWins,
    last_spin_date: user.lastSpinDate,
    unlocked_secret: user.unlockedSecret,
    story_progress: user.storyProgress // Save progress
  };

  await supabase
    .from('profiles')
    .update(dbProfile)
    .eq('friend_code', user.friendCode);
};

// --- LESSON SERVICES ---

export const fetchLessons = async (): Promise<Lesson[]> => {
  if (!IS_CONFIGURED) return MOCK_LESSONS;

  // Fetch all lessons
  const { data, error } = await supabase.from('lessons').select('*');
  
  if (error) {
    console.error("Error fetching lessons:", error);
    return MOCK_LESSONS;
  }

  // AUTO-SEED: If DB is empty, upload mock lessons
  if (!data || data.length === 0) {
    console.log("Database empty. Uploading 700+ lessons to Supabase... This may take a moment.");
    await seedLessons();
    return MOCK_LESSONS;
  }

  return data.map((l: any) => ({
    id: l.id,
    title: l.title,
    language: l.language,
    difficulty: l.difficulty,
    description: l.description,
    conceptHTML: l.concept_html,
    initialCode: l.initial_code,
    solutionCode: l.solution_code,
    solutionCriteria: l.solution_criteria,
    xpReward: l.xp_reward,
    coinReward: l.coin_reward
  }));
};

const seedLessons = async () => {
  const lessonsCopy = [...MOCK_LESSONS];
  // Smaller chunks for better stability with large datasets
  const chunks = chunkArray(lessonsCopy, 25);
  
  let totalUploaded = 0;

  for (const chunk of chunks) {
    const dbLessons = chunk.map(l => ({
      id: l.id,
      title: l.title,
      language: l.language,
      difficulty: l.difficulty,
      description: l.description,
      concept_html: l.conceptHTML,
      initial_code: l.initialCode,
      solution_code: l.solutionCode,
      solution_criteria: l.solutionCriteria,
      xp_reward: l.xpReward,
      coin_reward: l.coinReward
    }));
    
    const { error } = await supabase.from('lessons').upsert(dbLessons);
    if (error) {
      console.error("Error seeding chunk:", error);
    } else {
      totalUploaded += chunk.length;
      console.log(`Uploaded ${totalUploaded} lessons...`);
    }
  }
  console.log("Seeding complete!");
};

// --- HELPER MAPPERS ---

const mapDbProfileToUser = (dbUser: any): User => ({
  name: dbUser.name,
  friendCode: dbUser.friend_code,
  xp: dbUser.xp,
  level: dbUser.level,
  coins: dbUser.coins,
  streak: dbUser.streak,
  avatarColor: dbUser.avatar_config?.color || '#6366f1',
  avatarEyes: dbUser.avatar_config?.eyes || 'Normal',
  avatarMouth: dbUser.avatar_config?.mouth || 'Smile',
  avatarAccessory: dbUser.avatar_config?.accessory || 'None',
  voicePitch: dbUser.avatar_config?.voicePitch || 1.2,
  voiceRate: dbUser.avatar_config?.voiceRate || 1.0,
  completedLessons: dbUser.completed_lessons || [],
  friends: [], // In a full app, we would fetch these friend profiles here
  lastSpinDate: dbUser.last_spin_date,
  championshipWins: dbUser.championship_wins,
  themePreference: dbUser.theme_preference || 'dark',
  isMuted: dbUser.is_muted || false,
  unlockedSecret: dbUser.unlocked_secret || false,
  storyProgress: dbUser.story_progress || 0
});

function chunkArray(myArray: any[], chunk_size: number){
    const results = [];
    const arrayCopy = [...myArray];
    while (arrayCopy.length) {
        results.push(arrayCopy.splice(0, chunk_size));
    }
    return results;
}
