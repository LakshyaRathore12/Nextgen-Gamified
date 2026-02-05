
import { Language, Lesson, LeaderboardEntry, User, FriendProfile, StoryChapter } from './types';

export const AVATAR_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];
export const AVATAR_ACCESSORIES = ['None', 'Headphones', 'Glasses', 'Cap', 'Antenna', 'Crown', 'Scarf'];
export const AVATAR_EYES = ['Normal', 'Happy', 'Wink', 'Cyclops', 'Sunglasses', 'Lashes', 'Robo-Visor'];
export const AVATAR_MOUTHS = ['Smile', 'Grin', 'O-Face', 'Tongue', 'Neutral', 'Teeth', 'Moustache'];

export const SECRET_ACCESSORY = 'Omega Gear';
export const XP_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3500, 4500, 5600, 6800, 8100, 9500, 11000];

export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1; else break;
  }
  return level;
};

export const generateFriendCode = (name: string): string => {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const namePart = name.substring(0, 2).toUpperCase();
  return `${namePart}-${randomPart}`;
};

export const generateMockFriend = (code: string): FriendProfile => {
  const names = ['Cyber', 'Techno', 'Pixel', 'Bit', 'Nano', 'Mega', 'Giga', 'Terra'];
  const suffixes = ['Bot', 'Coder', 'Ninja', 'Wizard', 'Walker', 'Surfer'];
  const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1);
  return {
    id: code,
    name: `${names[seed % names.length]}${suffixes[seed % suffixes.length]}`,
    avatarColor: AVATAR_COLORS[seed % AVATAR_COLORS.length],
    avatarAccessory: AVATAR_ACCESSORIES[seed % AVATAR_ACCESSORIES.length],
    avatarEyes: AVATAR_EYES[seed % AVATAR_EYES.length],
    avatarMouth: AVATAR_MOUTHS[seed % AVATAR_MOUTHS.length],
    xp: (seed * 123) % 10000,
    level: Math.floor(((seed * 123) % 10000) / 500) + 1,
    championshipWins: Math.floor((seed * 7) % 20)
  };
};

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'CodeNinja', xp: 12500, avatarColor: '#ec4899', avatarAccessory: 'Headphones', isFriend: false, championshipWins: 15 },
  { id: '2', name: 'PixelWizard', xp: 11200, avatarColor: '#3b82f6', avatarAccessory: 'Crown', isFriend: true, championshipWins: 12 },
  { id: '3', name: 'CyberKai', xp: 9800, avatarColor: '#10b981', avatarAccessory: 'Glasses', isFriend: true, championshipWins: 8 },
  { id: '4', name: 'GlitchMaster', xp: 8500, avatarColor: '#f59e0b', avatarAccessory: 'Antenna', isFriend: false, championshipWins: 25 },
  { id: '5', name: 'ByteSized', xp: 7200, avatarColor: '#8b5cf6', avatarAccessory: 'Cap', isFriend: false, championshipWins: 5 },
  { id: '6', name: 'LogicLord', xp: 6500, avatarColor: '#6366f1', avatarAccessory: 'None', isFriend: false, championshipWins: 18 },
  { id: '7', name: 'AlgoRhythm', xp: 5900, avatarColor: '#ef4444', avatarAccessory: 'Scarf', isFriend: true, championshipWins: 3 },
];

export const INITIAL_USER_STATE: User = {
  name: 'Cadet',
  avatarColor: '#6366f1',
  avatarAccessory: 'None',
  avatarEyes: 'Normal',
  avatarMouth: 'Smile',
  xp: 0,
  level: 1,
  streak: 1,
  coins: 50,
  completedLessons: [],
  friends: [],
  friendCode: '', 
  lastSpinDate: null,
  championshipWins: 0,
  themePreference: 'dark',
  isMuted: false,
  voicePitch: 1.2,
  voiceRate: 1.0,
  unlockedSecret: false,
  storyProgress: 0
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 0,
    title: "The Awakening",
    backgroundTheme: "bg-slate-900",
    language: Language.PYTHON,
    plotIntro: "System rebooting... Error! The ship's main AI is offline. Cadet, I need you to wake up the system manually. Print 'System Online' to the console immediately!",
    plotOutro: "Systems stabilizing! That was close. The lights are back on, but we are drifting in deep space.",
    taskDescription: "Use the print command to output the exact phrase 'System Online'.",
    initialCode: "# Wake up the ship\n",
    solutionCriteria: "Print 'System Online'",
    xpReward: 100
  },
  {
    id: 1,
    title: "Shield Failure",
    backgroundTheme: "bg-red-900",
    language: Language.PYTHON,
    plotIntro: "Alert! Asteroid field detected! The shield generator variable is set to 0. We need full power! Create a variable named 'shields' and set it to 100.",
    plotOutro: "Shields at maximum capacity! The asteroids are bouncing off us like pebbles. Good thinking, Cadet.",
    taskDescription: "Create a variable named 'shields' and assign it the value 100.",
    initialCode: "# Power up shields\n",
    solutionCriteria: "Variable 'shields' = 100",
    xpReward: 150
  },
  {
    id: 2,
    title: "The Glitch Swarm",
    backgroundTheme: "bg-purple-900",
    language: Language.PYTHON,
    plotIntro: "Oh no! Space Bugs are attaching to the hull! There are too many to shoot one by one. Write a loop to fire the lasers 5 times!",
    plotOutro: "Pew! Pew! Pew! The swarm is dispersing. Our hull is clear. You're a natural at this!",
    taskDescription: "Write a for loop that iterates 5 times and prints 'Fire Laser'.",
    initialCode: "# Fire lasers 5 times\n",
    solutionCriteria: "Loop 5 times printing 'Fire Laser'",
    xpReward: 200
  },
  {
    id: 3,
    title: "Course Correction",
    backgroundTheme: "bg-blue-900",
    language: Language.PYTHON,
    plotIntro: "Navigation is offline. We need to calculate the coordinates to the nearest starbase. If fuel is greater than 50, go to 'Starbase Alpha', else go to 'Emergency Station'.",
    plotOutro: "Course locked in! We have enough fuel to reach Starbase Alpha. Engaging warp drive!",
    taskDescription: "Write an if/else statement. Check if a variable 'fuel' (set it to 80) is > 50.",
    initialCode: "fuel = 80\n# Check fuel levels\n",
    solutionCriteria: "If/Else logic checking fuel > 50",
    xpReward: 250
  },
  {
    id: 4,
    title: "First Contact",
    backgroundTheme: "bg-emerald-900",
    language: Language.PYTHON,
    plotIntro: "We are being hailed by an alien vessel! They communicate in data structures. Create a list called 'message' containing 'Greetings', 'We', 'Come', 'In', 'Peace'.",
    plotOutro: "They understand! They are lowering their weapons. It seems we made a new friend in the galaxy.",
    taskDescription: "Create a list named 'message' with the 5 specific words.",
    initialCode: "# Alien communication\n",
    solutionCriteria: "List 'message' with greeting words",
    xpReward: 300
  },
  {
    id: 5,
    title: "The Broken Radar",
    backgroundTheme: "bg-cyan-900",
    language: Language.CSS,
    plotIntro: "We've entered a nebula! The ship's radar display is messy and overlapping. Use Flexbox to align the 'radar-screen' to the center so we can see!",
    plotOutro: "Visuals are clear! I can see the path through the fog. Nice styling, Cadet!",
    taskDescription: "Write CSS to set '.radar-screen' to 'display: flex' and 'justify-content: center'.",
    initialCode: ".radar-screen {\n  /* Align the radar */\n}",
    solutionCriteria: "CSS Flexbox centering",
    xpReward: 350
  },
  {
    id: 6,
    title: "The Password Gate",
    backgroundTheme: "bg-orange-900",
    language: Language.JS,
    plotIntro: "A massive firewall gate blocks our path! It requires a password algorithm. Create a function 'unlock' that returns 'Access Granted'.",
    plotOutro: "Access Granted! The giant gates are opening. We are entering the Core Sector.",
    taskDescription: "Create a JS function named 'unlock' that returns the string 'Access Granted'.",
    initialCode: "// Hack the gate\n",
    solutionCriteria: "Function returning 'Access Granted'",
    xpReward: 400
  },
  {
    id: 7,
    title: "The Hyperdrive Loop",
    backgroundTheme: "bg-indigo-950",
    language: Language.PYTHON,
    plotIntro: "We need lightspeed to escape the gravity well! But the engine timing is off. Write a While loop that prints 'Accelerating' as long as 'speed' is less than 10.",
    plotOutro: "WARP SPEED ACTIVATED! Hold on to your helmet, Cadet! We're jumping to the final sector.",
    taskDescription: "Write a while loop. While speed < 10, print 'Accelerating' and increment speed.",
    initialCode: "speed = 0\n# Reach warp speed\n",
    solutionCriteria: "While loop incrementing speed",
    xpReward: 500
  },
  {
    id: 8,
    title: "BOSS: The Glitch King",
    backgroundTheme: "bg-red-950",
    language: Language.PYTHON,
    plotIntro: "WARNING! BOSS DETECTED! The Glitch King has corrupted the mainframe! He is hiding in the variables. Create a class 'Hero' with a method 'attack' to defeat him!",
    plotOutro: "CRITICAL HIT! The Glitch King is shattering into pixels! You saved the ship... no, you saved the UNIVERSE!",
    taskDescription: "Define a class 'Hero'. Add a method 'attack' that prints 'Glitch King Defeated'.",
    initialCode: "# Defeat the Boss\n",
    solutionCriteria: "Class Hero with attack method",
    xpReward: 1000
  }
];

const createL = (
  lang: Language, 
  index: number, 
  title: string, 
  diff: 'Beginner'|'Intermediate'|'Advanced'|'Master', 
  desc: string, 
  initCode: string, 
  solCode: string
): Lesson => ({
  id: `${lang.toLowerCase()}-${index}`,
  title,
  language: lang,
  difficulty: diff,
  description: desc,
  conceptHTML: `<div class="space-y-4">
    <h3 class="text-2xl font-bold text-indigo-400">Concept: ${title}</h3>
    <p class="text-lg">${desc}</p>
    <div class="bg-black/20 p-4 rounded-xl border border-white/10 font-mono text-sm">
      <strong>Example:</strong><br/>
      ${solCode.split('\n')[0]}...
    </div>
  </div>`,
  initialCode: initCode,
  solutionCriteria: `Complete the task using ${lang}.`,
  solutionCode: solCode,
  xpReward: diff === 'Beginner' ? 50 : diff === 'Intermediate' ? 100 : 150,
  coinReward: diff === 'Beginner' ? 10 : diff === 'Intermediate' ? 25 : 50
});

const getMockSolution = (lang: Language, i: number, topic: string): string => {
  switch (lang) {
    case Language.PYTHON: return `print("Mastering ${topic} in level ${i}")\n# Keep Coding!`;
    case Language.JS: return `console.log("Mastering ${topic} in level ${i}");\n// Keep Coding!`;
    case Language.JAVA: return `System.out.println("Mastering ${topic} ${i}");`;
    case Language.CPP: return `cout << "Mastering ${topic} ${i}";`;
    case Language.C: return `printf("Mastering ${topic} %d", ${i});`;
    case Language.HTML: return `<h1>Mastering ${topic} ${i}</h1>`;
    case Language.CSS: return `.level-${i} { /* ${topic} */ color: red; }`;
    case Language.REACT: return `export default function Lvl${i}() { return <div>${topic}</div>; }`;
    case Language.BLOCKS: return `<block type="text_print" message="Mastering ${topic} ${i}"></block>`;
    default: return "// Solved";
  }
};

const topicsMap: Record<Language, string[]> = {
  [Language.HTML]: ['Semantic Tags', 'Canvas Drawing', 'Web Accessibility', 'Forms & Inputs', 'SEO Optimization', 'Multimedia', 'SVG Graphics', 'Metadata'],
  [Language.CSS]: ['Flexbox Layouts', 'Grid Systems', 'Animations', 'Transitions', 'Responsive Design', 'Variables', 'Pseudo-elements', 'SASS Basics'],
  [Language.JS]: ['Closures', 'Async Await', 'Promises', 'Event Loop', 'DOM Manipulation', 'ES6 Features', 'Prototypes', 'Web APIs'],
  [Language.PYTHON]: ['Data Analysis', 'File Handling', 'Decorators', 'Generators', 'OOP Design', 'Lambdas', 'List Comprehension', 'Modules', 'NumPy', 'Pandas', 'Flask', 'Django', 'AsyncIO'],
  [Language.JAVA]: ['Multithreading', 'Streams API', 'Collections', 'Generics', 'File I/O', 'JDBC Basics', 'Spring Intro', 'Polymorphism'],
  [Language.CPP]: ['Memory Management', 'Pointers', 'STL Containers', 'Templates', 'Smart Pointers', 'File Streams', 'Lambda Functions', 'Structs'],
  [Language.REACT]: ['Custom Hooks', 'Context API', 'Redux State', 'Performance', 'React Router', 'Next.js Basics', 'Styled Components', 'Testing'],
  [Language.C]: ['Pointers', 'Memory Allocation', 'Structs', 'File Handling', 'Macros', 'Header Files', 'Bitwise Operators', 'Recursion'],
  [Language.BLOCKS]: ['Loops', 'Conditionals', 'Variables', 'Functions', 'Events', 'Operators', 'Lists', 'Sensing']
};

const generatePracticeLevels = (lang: Language, startId: number, count: number) => {
  const topics = topicsMap[lang] || ['Advanced Coding'];
  
  return Array.from({ length: count }).map((_, i) => {
    const topic = topics[i % topics.length];
    const levelNum = startId + i + 1;
    return createL(
      lang, 
      startId + i, 
      `${topic} Challenge ${Math.ceil((i+1)/topics.length)}`, 
      'Master', 
      `Prove your mastery of ${topic} in this advanced challenge. Write code that demonstrates efficient logic.`, 
      `// Write your ${topic} solution here...`, 
      getMockSolution(lang, levelNum, topic)
    );
  });
};

const htmlLessons = [
  createL(Language.HTML, 0, 'HTML Structure', 'Beginner', 'Every webpage needs a skeleton. Use html, head, and body tags.', '<!-- Setup HTML structure -->', '<html>\n  <head></head>\n  <body></body>\n</html>'),
  createL(Language.HTML, 1, 'Headings', 'Beginner', 'Use h1 for main titles and h2 for subtitles.', '<!-- Add an h1 and h2 -->', '<h1>My Website</h1>\n<h2>Welcome</h2>'),
  createL(Language.HTML, 2, 'Paragraphs', 'Beginner', 'Use <p> tags to write text content.', '<!-- Write a paragraph -->', '<p>This is my first paragraph.</p>'),
  createL(Language.HTML, 3, 'Links', 'Beginner', 'Connect to other pages using the <a> tag.', '<!-- Link to google.com -->', '<a href="https://google.com">Search</a>'),
  createL(Language.HTML, 4, 'Images', 'Beginner', 'Display pictures with the <img> tag.', '<!-- Add an image -->', '<img src="cat.jpg" alt="A cute cat">'),
  createL(Language.HTML, 5, 'Unordered Lists', 'Beginner', 'Create a bullet point list using <ul> and <li>.', '<!-- Create a list -->', '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>'),
  createL(Language.HTML, 6, 'Ordered Lists', 'Beginner', 'Create a numbered list using <ol> and <li>.', '<!-- Create a numbered list -->', '<ol>\n  <li>First</li>\n  <li>Second</li>\n</ol>'),
  createL(Language.HTML, 7, 'Buttons', 'Beginner', 'Make a clickable button.', '<button>Click Me</button>', '<button>Click Me</button>'),
  createL(Language.HTML, 8, 'Div Containers', 'Intermediate', 'Group elements together using <div>.', '<div>\n  <h1>Grouped</h1>\n</div>', '<div>...</div>'),
  createL(Language.HTML, 9, 'Span Text', 'Intermediate', 'Style a specific part of text using <span>.', '<p>Hello <span style="color:red">World</span></p>', '<span></span>'),
  createL(Language.HTML, 10, 'Input Fields', 'Intermediate', 'Let users type text with <input>.', '<input type="text" placeholder="Name">', '<input type="text">'),
  createL(Language.HTML, 11, 'Forms', 'Intermediate', 'Wrap inputs in a <form> tag.', '<form>\n  <input type="text">\n  <button>Submit</button>\n</form>', '<form></form>'),
  createL(Language.HTML, 12, 'Tables', 'Intermediate', 'Display data in rows and columns.', '<table>\n  <tr><td>Data</td></tr>\n</table>', '<table>...</table>'),
  createL(Language.HTML, 13, 'Semantic Header', 'Intermediate', 'Use <header> for page tops.', '<header>\n  <h1>Logo</h1>\n</header>', '<header>...</header>'),
  createL(Language.HTML, 14, 'Semantic Footer', 'Intermediate', 'Use <footer> for page bottoms.', '<footer>\n  <p>Copyright 2024</p>\n</footer>', '<footer>...</footer>'),
  createL(Language.HTML, 15, 'Nav Bar', 'Intermediate', 'Use <nav> for navigation links.', '<nav>\n  <a href="#">Home</a>\n</nav>', '<nav>...</nav>'),
  createL(Language.HTML, 16, 'Audio', 'Advanced', 'Embed sound with <audio>.', '<audio controls src="song.mp3"></audio>', '<audio controls></audio>'),
  createL(Language.HTML, 17, 'Video', 'Advanced', 'Embed movies with <video>.', '<video controls width="250"></video>', '<video controls></video>'),
  createL(Language.HTML, 18, 'Iframe', 'Advanced', 'Embed another website inside yours.', '<iframe src="https://example.com"></iframe>', '<iframe></iframe>'),
  createL(Language.HTML, 19, 'Meta Tags', 'Advanced', 'Add SEO info in the <head>.', '<meta name="description" content="Site info">', '<meta>'),
  createL(Language.HTML, 20, 'Canvas', 'Master', 'Draw graphics with <canvas>.', '<canvas id="game" width="200" height="100"></canvas>', '<canvas></canvas>'),
  createL(Language.HTML, 21, 'SVG Icons', 'Master', 'Draw scalable vector graphics.', '<svg width="100" height="100">\n  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />\n</svg>', '<svg>...</svg>'),
  createL(Language.HTML, 22, 'Data Attributes', 'Master', 'Store extra info in tags.', '<div data-user-id="123">User</div>', 'data-*'),
  createL(Language.HTML, 23, 'Details & Summary', 'Master', 'Create expandable sections.', '<details>\n  <summary>More Info</summary>\n  <p>Hidden content</p>\n</details>', '<details>...</details>'),
  createL(Language.HTML, 24, 'Favicon', 'Master', 'Add a browser tab icon.', '<link rel="icon" href="favicon.ico">', '<link rel="icon">'),
];

const cssLessons = [
  createL(Language.CSS, 0, 'Color', 'Beginner', 'Change text color.', 'h1 { color: red; }', 'color: red;'),
  createL(Language.CSS, 1, 'Backgrounds', 'Beginner', 'Set a background color.', 'body { background-color: #f0f0f0; }', 'background-color: blue;'),
  createL(Language.CSS, 2, 'Font Size', 'Beginner', 'Make text bigger.', 'p { font-size: 20px; }', 'font-size: 16px;'),
  createL(Language.CSS, 3, 'Text Align', 'Beginner', 'Center your text.', 'h1 { text-align: center; }', 'text-align: center;'),
  createL(Language.CSS, 4, 'Borders', 'Beginner', 'Add a box outline.', 'div { border: 2px solid black; }', 'border: 1px solid black;'),
  createL(Language.CSS, 5, 'Margins', 'Beginner', 'Add space outside an element.', 'div { margin: 20px; }', 'margin: 10px;'),
  createL(Language.CSS, 6, 'Padding', 'Beginner', 'Add space inside an element.', 'div { padding: 20px; }', 'padding: 10px;'),
  createL(Language.CSS, 7, 'Width & Height', 'Beginner', 'Control element size.', 'img { width: 100%; height: auto; }', 'width: 50%;'),
  createL(Language.CSS, 8, 'Classes', 'Intermediate', 'Style multiple items with .classname', '.btn { background: blue; color: white; }', '.class {}'),
  createL(Language.CSS, 9, 'IDs', 'Intermediate', 'Style one item with #id', '#header { background: black; }', '#id {}'),
  createL(Language.CSS, 10, 'Hover Effect', 'Intermediate', 'Change style on mouse over.', 'button:hover { opacity: 0.8; }', ':hover {}'),
  createL(Language.CSS, 11, 'Display Block', 'Intermediate', 'Make elements stack.', 'span { display: block; }', 'display: block;'),
  createL(Language.CSS, 12, 'Display Inline', 'Intermediate', 'Make elements sit side-by-side.', 'li { display: inline; }', 'display: inline;'),
  createL(Language.CSS, 13, 'Flexbox Basics', 'Intermediate', 'Layout items easily.', 'div { display: flex; }', 'display: flex;'),
  createL(Language.CSS, 14, 'Flex Center', 'Intermediate', 'Center content perfectly.', 'div { display: flex; justify-content: center; align-items: center; }', 'justify-content: center;'),
  createL(Language.CSS, 15, 'Grid Basics', 'Advanced', 'Create a grid layout.', 'div { display: grid; grid-template-columns: 1fr 1fr; }', 'display: grid;'),
  createL(Language.CSS, 16, 'Position Absolute', 'Advanced', 'Place items anywhere.', 'div { position: absolute; top: 0; left: 0; }', 'position: absolute;'),
  createL(Language.CSS, 17, 'Position Fixed', 'Advanced', 'Stick items to the screen.', 'nav { position: fixed; top: 0; }', 'position: fixed;'),
  createL(Language.CSS, 18, 'Z-Index', 'Advanced', 'Layer items on top of others.', 'div { z-index: 10; }', 'z-index: 1;'),
  createL(Language.CSS, 19, 'Opacity', 'Advanced', 'Make items transparent.', 'div { opacity: 0.5; }', 'opacity: 0.5;'),
  createL(Language.CSS, 20, 'Transitions', 'Master', 'Animate changes smoothly.', 'button { transition: all 0.3s ease; }', 'transition: 0.3s;'),
  createL(Language.CSS, 21, 'Animations', 'Master', 'Create keyframe animations.', '@keyframes slide { from { left: 0; } to { left: 100px; } }', '@keyframes'),
  createL(Language.CSS, 22, 'Media Queries', 'Master', 'Make it responsive for mobile.', '@media (max-width: 600px) { body { font-size: 14px; } }', '@media'),
  createL(Language.CSS, 23, 'Variables', 'Master', 'Store colors in variables.', ':root { --main-color: blue; } h1 { color: var(--main-color); }', 'var(--name)'),
  createL(Language.CSS, 24, 'Shadows', 'Master', 'Add depth with shadows.', 'div { box-shadow: 10px 10px 5px grey; }', 'box-shadow: ...'),
];

const jsLessons = [
  createL(Language.JS, 0, 'Variables', 'Beginner', 'Store data using let and const.', 'let name = "Hero";\nconst pi = 3.14;', 'let x = 5;'),
  createL(Language.JS, 1, 'Strings', 'Beginner', 'Work with text.', 'let msg = "Hello World";', 'let s = "";'),
  createL(Language.JS, 2, 'Numbers', 'Beginner', 'Do math.', 'let sum = 10 + 5;', 'let n = 10;'),
  createL(Language.JS, 3, 'Console Log', 'Beginner', 'Print to the debug area.', 'console.log("I am alive!");', 'console.log()'),
  createL(Language.JS, 4, 'Functions', 'Beginner', 'Group code into blocks.', 'function sayHi() {\n  return "Hi";\n}', 'function f() {}'),
  createL(Language.JS, 5, 'Parameters', 'Beginner', 'Pass data to functions.', 'function greet(name) {\n  return "Hi " + name;\n}', 'function f(a) {}'),
  createL(Language.JS, 6, 'If Statements', 'Intermediate', 'Make decisions.', 'if (score > 10) {\n  win();\n}', 'if (true) {}'),
  createL(Language.JS, 7, 'Else', 'Intermediate', 'Handle the other case.', 'if (x > 0) {} else {}', 'else {}'),
  createL(Language.JS, 8, 'Arrays', 'Intermediate', 'Store lists of data.', 'let fruits = ["Apple", "Banana"];', '[]'),
  createL(Language.JS, 9, 'Accessing Arrays', 'Intermediate', 'Get items from a list.', 'let first = fruits[0];', 'arr[0]'),
  createL(Language.JS, 10, 'Loops (For)', 'Intermediate', 'Repeat code.', 'for(let i=0; i<5; i++) {\n  console.log(i);\n}', 'for loop'),
  createL(Language.JS, 11, 'Loops (While)', 'Intermediate', 'Repeat while true.', 'while(energy > 0) {\n  run();\n}', 'while loop'),
  createL(Language.JS, 12, 'Objects', 'Advanced', 'Store key-value pairs.', 'let player = { name: "Kai", level: 5 };', '{}'),
  createL(Language.JS, 13, 'Object Properties', 'Advanced', 'Get data from objects.', 'console.log(player.name);', 'obj.prop'),
  createL(Language.JS, 14, 'Array Methods (Push)', 'Advanced', 'Add to a list.', 'fruits.push("Orange");', '.push()'),
  createL(Language.JS, 15, 'Array Methods (Map)', 'Advanced', 'Transform a list.', 'let doubles = nums.map(n => n * 2);', '.map()'),
  createL(Language.JS, 16, 'DOM Selection', 'Advanced', 'Find HTML elements.', 'let btn = document.getElementById("btn");', 'getElementById'),
  createL(Language.JS, 17, 'Event Listeners', 'Advanced', 'React to clicks.', 'btn.addEventListener("click", jump);', 'addEventListener'),
  createL(Language.JS, 18, 'Arrow Functions', 'Master', 'Shorter function syntax.', 'const add = (a,b) => a + b;', '() => {}'),
  createL(Language.JS, 19, 'Template Literals', 'Master', 'Combine strings easily.', 'let msg = `Hello ${name}`;', '``'),
  createL(Language.JS, 20, 'Destructuring', 'Master', 'Unpack objects.', 'const { name, age } = user;', 'const {} = obj'),
  createL(Language.JS, 21, 'Promises', 'Master', 'Handle async code.', 'fetchData().then(data => console.log(data));', '.then()'),
  createL(Language.JS, 22, 'Async/Await', 'Master', 'Cleaner async code.', 'async function load() {\n  await getData();\n}', 'async/await'),
  createL(Language.JS, 23, 'Local Storage', 'Master', 'Save data in browser.', 'localStorage.setItem("score", 100);', 'localStorage'),
  createL(Language.JS, 24, 'Classes', 'Master', 'Object Oriented JS.', 'class Robot {\n  constructor(name) { this.name = name; }\n}', 'class {}'),
];

const pythonLessons = [
  createL(Language.PYTHON, 0, 'Print', 'Beginner', 'Show text on screen.', 'print("Hello Python")', 'print()'),
  createL(Language.PYTHON, 1, 'Variables', 'Beginner', 'Store values.', 'score = 100', 'x = 1'),
  createL(Language.PYTHON, 2, 'Math', 'Beginner', 'Calculate numbers.', 'total = 50 + 25', '+ - * /'),
  createL(Language.PYTHON, 3, 'Strings', 'Beginner', 'Text handling.', 'name = "NextGen"', '""'),
  createL(Language.PYTHON, 4, 'Input', 'Beginner', 'Get user text.', 'name = input("Who are you?")', 'input()'),
  createL(Language.PYTHON, 5, 'If Else', 'Intermediate', 'Logic flow.', 'if x > 5:\n  print("Big")\nelse:\n  print("Small")', 'if: else:'),
  createL(Language.PYTHON, 6, 'Lists', 'Intermediate', 'Arrays in Python.', 'items = ["Sword", "Shield"]', '[]'),
  createL(Language.PYTHON, 7, 'Loops (For)', 'Intermediate', 'Iterate items.', 'for item in items:\n  print(item)', 'for x in y:'),
  createL(Language.PYTHON, 8, 'Range', 'Intermediate', 'Count numbers.', 'for i in range(5):\n  print(i)', 'range()'),
  createL(Language.PYTHON, 9, 'Functions', 'Intermediate', 'Define actions.', 'def jump():\n  print("Jump!")', 'def f():'),
  createL(Language.PYTHON, 10, 'Return', 'Intermediate', 'Send data back.', 'def add(a,b):\n  return a+b', 'return'),
  createL(Language.PYTHON, 11, 'Dictionaries', 'Advanced', 'Key-value data.', 'stats = {"hp": 100, "mana": 50}', '{}'),
  createL(Language.PYTHON, 12, 'While Loops', 'Advanced', 'Run until false.', 'while hp > 0:\n  fight()', 'while:'),
  createL(Language.PYTHON, 13, 'Modules', 'Advanced', 'Import code.', 'import math\nprint(math.sqrt(16))', 'import'),
  createL(Language.PYTHON, 14, 'Random', 'Advanced', 'Random numbers.', 'import random\nroll = random.randint(1,6)', 'random'),
  createL(Language.PYTHON, 15, 'Tuples', 'Master', 'Immutable lists.', 'coords = (10, 20)', '()'),
  createL(Language.PYTHON, 16, 'Sets', 'Master', 'Unique items.', 'unique = {1, 2, 3}', '{}'),
  createL(Language.PYTHON, 17, 'Classes', 'Master', 'OOP in Python.', 'class Robot:\n  def __init__(self, name):\n    self.name = name', 'class'),
  createL(Language.PYTHON, 18, 'Inheritance', 'Master', 'Extend classes.', 'class SuperRobot(Robot):\n  pass', 'class Child(Parent)'),
  createL(Language.PYTHON, 19, 'Try Except', 'Master', 'Handle errors.', 'try:\n  x = 1/0\nexcept:\n  print("Error")', 'try: except:'),
  createL(Language.PYTHON, 20, 'File Write', 'Master', 'Save to file.', 'with open("log.txt", "w") as f:\n  f.write("Hi")', 'open()'),
  createL(Language.PYTHON, 21, 'List Comprehension', 'Master', 'Short loops.', 'squares = [x*x for x in range(10)]', '[x for x in y]'),
  createL(Language.PYTHON, 22, 'Lambda', 'Master', 'Anonymous functions.', 'add = lambda x,y: x+y', 'lambda'),
  createL(Language.PYTHON, 23, 'Decorators', 'Master', 'Modify functions.', '@my_decorator\ndef func(): pass', '@'),
  createL(Language.PYTHON, 24, 'F-Strings', 'Master', 'Format text.', 'print(f"Hello {name}")', 'f""'),
  createL(Language.PYTHON, 25, 'Generators', 'Master', 'Lazy iterators using yield.', 'def my_gen():\n  yield 1\n  yield 2', 'yield'),
  createL(Language.PYTHON, 26, 'Context Managers', 'Master', 'Safe resource management.', 'with open("file.txt", "r") as f:\n  data = f.read()', 'with'),
  createL(Language.PYTHON, 27, 'NumPy Basics', 'Master', 'High-performance arrays.', 'import numpy as np\narr = np.array([1, 2, 3])', 'numpy'),
  createL(Language.PYTHON, 28, 'Pandas Series', 'Master', '1D labeled array.', 'import pandas as pd\ns = pd.Series([10, 20, 30])', 'pandas'),
  createL(Language.PYTHON, 29, 'Matplotlib Plot', 'Master', 'Basic line charts.', 'import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [4, 5, 6])', 'plt.plot'),
  createL(Language.PYTHON, 30, 'Flask Routes', 'Master', 'Minimal web framework.', 'from flask import Flask\napp = Flask(__name__)\n@app.route("/")', '@app.route'),
  createL(Language.PYTHON, 31, 'Django Models', 'Master', 'Database schemas.', 'from django.db import models\nclass Person(models.Model):\n  name = models.CharField(max_length=50)', 'models.Model'),
  createL(Language.PYTHON, 32, 'Type Hinting', 'Master', 'Static type checking.', 'def greet(name: str) -> str:\n  return "Hi " + name', ': str'),
  createL(Language.PYTHON, 33, 'Regular Expressions', 'Master', 'Pattern matching.', 'import re\nmatch = re.search(r"[a-z]+", "hello 123")', 're'),
  createL(Language.PYTHON, 34, 'AsyncIO', 'Master', 'Asynchronous programming.', 'import asyncio\nasync def main():\n  await asyncio.sleep(1)', 'async def'),
  createL(Language.PYTHON, 35, 'Unit Testing', 'Master', 'Code verification.', 'import unittest\nclass MyTest(unittest.TestCase):\n  def test_add(self): self.assertEqual(1+1, 2)', 'unittest'),
  createL(Language.PYTHON, 36, 'Metaclasses', 'Master', 'Class creation interceptors.', 'class Meta(type):\n  def __new__(cls, name, bases, dct): return super().__new__(cls, name, bases, dct)', 'type'),
];

const javaLessons = [
  createL(Language.JAVA, 0, 'Main Method', 'Beginner', 'Entry point.', 'public static void main(String[] args) {}', 'main'),
  createL(Language.JAVA, 1, 'Print', 'Beginner', 'Output text.', 'System.out.println("Hello");', 'println'),
  createL(Language.JAVA, 2, 'Variables', 'Beginner', 'Types matter.', 'int x = 10;\nString s = "Hi";', 'int, String'),
  createL(Language.JAVA, 3, 'If Else', 'Beginner', 'Logic.', 'if(x > 5) {}', 'if'),
  createL(Language.JAVA, 4, 'Loops', 'Intermediate', 'For loops.', 'for(int i=0; i<5; i++) {}', 'for'),
  createL(Language.JAVA, 5, 'Arrays', 'Intermediate', 'Fixed lists.', 'int[] nums = {1, 2, 3};', '[]'),
  createL(Language.JAVA, 6, 'Methods', 'Intermediate', 'Functions.', 'public void jump() {}', 'void'),
  createL(Language.JAVA, 7, 'Classes', 'Intermediate', 'Objects.', 'public class Robot {}', 'class'),
  createL(Language.JAVA, 8, 'Objects', 'Intermediate', 'Instances.', 'Robot bot = new Robot();', 'new'),
  createL(Language.JAVA, 9, 'Constructors', 'Advanced', 'Setup.', 'public Robot() {}', 'constructor'),
  createL(Language.JAVA, 10, 'Private', 'Advanced', 'Encapsulation.', 'private int secret;', 'private'),
  createL(Language.JAVA, 11, 'Getters/Setters', 'Advanced', 'Accessors.', 'public int getX() { return x; }', 'get/set'),
  createL(Language.JAVA, 12, 'Inheritance', 'Advanced', 'Extends.', 'class SuperBot extends Robot {}', 'extends'),
  createL(Language.JAVA, 13, 'Interfaces', 'Advanced', 'Contracts.', 'interface Flyable { void fly(); }', 'interface'),
  createL(Language.JAVA, 14, 'ArrayList', 'Master', 'Dynamic lists.', 'ArrayList<String> list = new ArrayList<>();', 'ArrayList'),
  createL(Language.JAVA, 15, 'HashMap', 'Master', 'Key-Values.', 'HashMap<String, Int> map = new HashMap<>();', 'HashMap'),
  createL(Language.JAVA, 16, 'Try Catch', 'Master', 'Exceptions.', 'try {} catch(Exception e) {}', 'try/catch'),
  createL(Language.JAVA, 17, 'Static', 'Master', 'Shared data.', 'public static int count;', 'static'),
  createL(Language.JAVA, 18, 'Abstract Classes', 'Master', 'Partial classes.', 'abstract class Shape {}', 'abstract'),
  createL(Language.JAVA, 19, 'Polymorphism', 'Master', 'Many forms.', 'Shape s = new Circle();', 'Override'),
  createL(Language.JAVA, 20, 'Lambda', 'Master', 'Short code.', 'items.forEach(n -> System.out.println(n));', '->'),
  createL(Language.JAVA, 21, 'Streams', 'Master', 'Data flow.', 'list.stream().filter(x -> x > 5).collect(Collectors.toList());', 'stream'),
  createL(Language.JAVA, 22, 'Threads', 'Master', 'Multitasking.', 'Thread t = new Thread(); t.start();', 'Thread'),
  createL(Language.JAVA, 23, 'File I/O', 'Master', 'Reading files.', 'File myObj = new File("filename.txt");', 'File'),
  createL(Language.JAVA, 24, 'Generics', 'Master', 'Flexible types.', 'class Box<T> {}', '<T>'),
];

const cppLessons = [
  createL(Language.CPP, 0, 'Hello World', 'Beginner', 'Standard output.', 'cout << "Hello";', 'cout'),
  createL(Language.CPP, 1, 'Variables', 'Beginner', 'Int, float, char.', 'int age = 10;', 'int'),
  createL(Language.CPP, 2, 'Input', 'Beginner', 'Get user data.', 'cin >> age;', 'cin'),
  createL(Language.CPP, 3, 'If Else', 'Beginner', 'Logic.', 'if (x > 0) {}', 'if'),
  createL(Language.CPP, 4, 'Loops', 'Intermediate', 'For loops.', 'for(int i=0; i<5; i++) {}', 'for'),
  createL(Language.CPP, 5, 'Functions', 'Intermediate', 'Modular code.', 'void sayHi() {}', 'void'),
  createL(Language.CPP, 6, 'Arrays', 'Intermediate', 'Lists.', 'int nums[5] = {1,2,3,4,5};', '[]'),
  createL(Language.CPP, 7, 'Strings', 'Intermediate', 'Text.', 'string name = "Bot";', 'string'),
  createL(Language.CPP, 8, 'References', 'Advanced', 'Alias variables.', 'int &ref = x;', '&'),
  createL(Language.CPP, 9, 'Pointers', 'Advanced', 'Memory addresses.', 'int *ptr = &x;', '*'),
  createL(Language.CPP, 10, 'Classes', 'Advanced', 'OOP.', 'class Robot { public: };', 'class'),
  createL(Language.CPP, 11, 'Constructors', 'Advanced', 'Init objects.', 'Robot() {}', 'Robot()'),
  createL(Language.CPP, 12, 'Public/Private', 'Advanced', 'Access control.', 'private: int id;', 'private'),
  createL(Language.CPP, 13, 'Inheritance', 'Advanced', 'Subclasses.', 'class Drone : public Robot {};', ':'),
  createL(Language.CPP, 14, 'Vectors', 'Master', 'Dynamic arrays.', 'vector<int> v;', 'vector'),
  createL(Language.CPP, 15, 'Vector Push', 'Master', 'Add items.', 'v.push_back(10);', 'push_back'),
  createL(Language.CPP, 16, 'Maps', 'Master', 'Key-Value.', 'map<string, int> m;', 'map'),
  createL(Language.CPP, 17, 'Iterators', 'Master', 'Loop collection.', 'for(auto i = v.begin(); i != v.end(); i++)', 'iterator'),
  createL(Language.CPP, 18, 'Structs', 'Master', 'Data structures.', 'struct Point { int x, y; };', 'struct'),
  createL(Language.CPP, 19, 'Enums', 'Master', 'Named constants.', 'enum Color { RED, BLUE };', 'enum'),
  createL(Language.CPP, 20, 'Switch', 'Master', 'Multi-choice.', 'switch(x) { case 1: break; }', 'switch'),
  createL(Language.CPP, 21, 'File I/O', 'Master', 'Read/Write.', 'ofstream file("test.txt");', 'fstream'),
  createL(Language.CPP, 22, 'Templates', 'Master', 'Generic code.', 'template <typename T> T add(T a, T b) {}', 'template'),
  createL(Language.CPP, 23, 'Exception Handling', 'Master', 'Errors.', 'try { throw 20; } catch (int e) {}', 'try/catch'),
  createL(Language.CPP, 24, 'Lambda', 'Master', 'Inline functions.', 'auto f = []() {};', '[]'),
];

const reactLessons = [
  createL(Language.REACT, 0, 'Components', 'Beginner', 'Building blocks.', 'function App() {\n  return <h1>Hi</h1>;\n}', 'function'),
  createL(Language.REACT, 1, 'JSX', 'Beginner', 'HTML in JS.', 'const el = <h1>Hello</h1>;', 'JSX'),
  createL(Language.REACT, 2, 'Props', 'Beginner', 'Pass data down.', 'function Welcome(props) {\n  return <h1>{props.name}</h1>;\n}', 'props'),
  createL(Language.REACT, 3, 'useState', 'Intermediate', 'Manage state.', 'const [count, setCount] = useState(0);', 'useState'),
  createL(Language.REACT, 4, 'Events', 'Intermediate', 'Click handling.', '<button onClick={handleClick}>', 'onClick'),
  createL(Language.REACT, 5, 'Conditional Render', 'Intermediate', 'If/Else in UI.', '{isLoggedIn ? <User/> : <Login/>}', 'ternary'),
  createL(Language.REACT, 6, 'Lists', 'Intermediate', 'Looping data.', 'items.map(i => <li key={i.id}>{i.name}</li>)', '.map'),
  createL(Language.REACT, 7, 'Forms', 'Intermediate', 'Inputs.', '<input value={name} onChange={e => setName(e.target.value)} />', 'onChange'),
  createL(Language.REACT, 8, 'useEffect', 'Advanced', 'Side effects.', 'useEffect(() => { loadData(); }, []);', 'useEffect'),
  createL(Language.REACT, 9, 'Dependencies', 'Advanced', 'When to re-run.', 'useEffect(() => {}, [count]);', 'deps'),
  createL(Language.REACT, 10, 'Context API', 'Advanced', 'Global state.', 'const Theme = createContext();', 'createContext'),
  createL(Language.REACT, 11, 'useContext', 'Advanced', 'Consume context.', 'const theme = useContext(Theme);', 'useContext'),
  createL(Language.REACT, 12, 'useRef', 'Advanced', 'DOM access.', 'const inputRef = useRef();', 'useRef'),
  createL(Language.REACT, 13, 'Custom Hooks', 'Master', 'Reuse logic.', 'function useWindowSize() {}', 'use...'),
  createL(Language.REACT, 14, 'React Router', 'Master', 'Navigation.', '<Route path="/" element={<Home/>} />', 'Route'),
  createL(Language.REACT, 15, 'Link', 'Master', 'Nav links.', '<Link to="/about">About</Link>', 'Link'),
  createL(Language.REACT, 16, 'Memo', 'Master', 'Optimize render.', 'const Memoized = React.memo(Component);', 'memo'),
  createL(Language.REACT, 17, 'useMemo', 'Master', 'Optimize value.', 'const val = useMemo(() => calc(a), [a]);', 'useMemo'),
  createL(Language.REACT, 18, 'useCallback', 'Master', 'Optimize function.', 'const fn = useCallback(() => {}, []);', 'useCallback'),
  createL(Language.REACT, 19, 'useReducer', 'Master', 'Complex state.', 'const [state, dispatch] = useReducer(reducer, init);', 'useReducer'),
  createL(Language.REACT, 20, 'Portals', 'Master', 'Render outside.', 'createPortal(child, document.body)', 'createPortal'),
  createL(Language.REACT, 21, 'Fragments', 'Master', 'Group without div.', '<> ... </>', 'Fragment'),
  createL(Language.REACT, 22, 'Strict Mode', 'Master', 'Checks.', '<React.StrictMode>', 'StrictMode'),
  createL(Language.REACT, 23, 'Suspense', 'Master', 'Loading state.', '<Suspense fallback={<Loading/>}>', 'Suspense'),
  createL(Language.REACT, 24, 'Lazy Loading', 'Master', 'Load later.', 'const LazyComp = React.lazy(() => import("./Comp"));', 'lazy'),
];

const generateFullCurriculum = () => {
  const TARGET_LEVELS = 100;
  
  const fillLessons = (baseLessons: Lesson[], lang: Language) => {
    const currentCount = baseLessons.length;
    const needed = TARGET_LEVELS - currentCount;
    if (needed <= 0) return baseLessons;

    const generated = generatePracticeLevels(lang, currentCount, needed);
    return [...baseLessons, ...generated];
  };

  return [
    ...fillLessons(htmlLessons, Language.HTML),
    ...fillLessons(cssLessons, Language.CSS),
    ...fillLessons(jsLessons, Language.JS),
    ...fillLessons(pythonLessons, Language.PYTHON),
    ...fillLessons(javaLessons, Language.JAVA),
    ...fillLessons(cppLessons, Language.CPP),
    ...fillLessons(reactLessons, Language.REACT),
  ];
};

export const MOCK_LESSONS: Lesson[] = generateFullCurriculum();
