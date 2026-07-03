const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();

// Map of extensions to human-readable languages
const EXT_TO_LANG = {
  '.java': 'Java',
  '.py': 'Python',
  '.sql': 'SQL',
  '.cpp': 'C++',
  '.c': 'C',
  '.cs': 'C#',
  '.js': 'JavaScript',
  '.ts': 'TypeScript',
  '.go': 'Go',
  '.rs': 'Rust',
  '.kt': 'Kotlin',
  '.swift': 'Swift',
  '.rb': 'Ruby',
  '.php': 'PHP',
  '.scala': 'Scala'
};

function getProblemDirs(dir, list = []) {
  const files = fs.readdirSync(dir);
  let hasReadme = false;
  
  if (dir !== ROOT_DIR) {
    hasReadme = files.includes('README.md');
  }

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== '.git' && file !== '.github' && file !== 'node_modules' && file !== '.agents') {
        getProblemDirs(fullPath, list);
      }
    }
  }

  if (hasReadme) {
    list.push(dir);
  }
  return list;
}

function run() {
  console.log('Scanning workspace for problems...');
  const problemDirs = getProblemDirs(ROOT_DIR);
  console.log(`Found ${problemDirs.length} directories containing README.md`);

  const problems = [];
  const allLanguages = new Set();
  const allPlatforms = new Set();

  for (const dir of problemDirs) {
    const relativePath = path.relative(ROOT_DIR, dir);
    const readmePath = path.join(dir, 'README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    // 1. Extract title and URL
    // Format: <h2><a href="URL">Title</a></h2>
    const titleRegex = /<h2><a href="([^"]+)">([^<]+)<\/a><\/h2>/i;
    const titleMatch = readmeContent.match(titleRegex);

    let problemUrl = '';
    let fullTitle = '';
    let problemNumber = null;
    let problemTitle = '';

    if (titleMatch) {
      problemUrl = titleMatch[1];
      fullTitle = titleMatch[2].trim();
      
      const numMatch = fullTitle.match(/^(\d+)\.\s*(.*)$/);
      if (numMatch) {
        problemNumber = parseInt(numMatch[1], 10);
        problemTitle = numMatch[2].trim();
      } else {
        problemTitle = fullTitle;
      }
    } else {
      // Fallback to folder name
      const folderName = path.basename(dir);
      const folderNumMatch = folderName.match(/^(\d+)-(.*)$/);
      if (folderNumMatch) {
        problemNumber = parseInt(folderNumMatch[1], 10);
        problemTitle = folderNumMatch[2].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      } else {
        problemTitle = folderName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
    }

    // 2. Extract Difficulty
    const difficultyRegex = /<h3>(?:Difficulty Level\s*:\s*Difficulty:\s*)?(Easy|Medium|Hard)<\/h3>/i;
    const diffMatch = readmeContent.match(difficultyRegex);
    let difficulty = 'Medium';
    if (diffMatch) {
      difficulty = diffMatch[1].trim();
      difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    } else {
      const lowerPath = relativePath.toLowerCase();
      if (lowerPath.includes('easy')) {
        difficulty = 'Easy';
      } else if (lowerPath.includes('medium')) {
        difficulty = 'Medium';
      } else if (lowerPath.includes('hard')) {
        difficulty = 'Hard';
      }
    }

    // 3. Extract Platform
    let platform = 'LeetCode';
    if (problemUrl.includes('geeksforgeeks.org')) {
      platform = 'GFG';
    } else if (problemUrl.includes('leetcode.com')) {
      platform = 'LeetCode';
    } else {
      const lowerPath = relativePath.toLowerCase();
      if (lowerPath.includes('difficulty') || lowerPath.includes('gfg') || lowerPath.includes('geeksforgeeks')) {
        platform = 'GFG';
      }
    }

    // 4. Extract Language & Solution Files
    const files = fs.readdirSync(dir);
    const languages = new Set();
    const solutionFiles = [];

    for (const file of files) {
      if (file === 'README.md' || file.startsWith('.')) continue;
      const ext = path.extname(file).toLowerCase();
      if (EXT_TO_LANG[ext]) {
        languages.add(EXT_TO_LANG[ext]);
        solutionFiles.push(file);
      }
    }

    // Fallback: If no files map to languages but there are files, check them
    if (languages.size === 0) {
      for (const file of files) {
        if (file === 'README.md' || file.startsWith('.')) continue;
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isFile()) {
          // guess language or mark as Other
          languages.add('Java'); // default to Java based on typical files in repo if unsure
          solutionFiles.push(file);
        }
      }
    }

    languages.forEach(l => allLanguages.add(l));
    allPlatforms.add(platform);

    problems.push({
      number: problemNumber,
      title: problemTitle,
      difficulty,
      platform,
      languages: Array.from(languages),
      path: relativePath,
      solutionFiles,
      url: problemUrl
    });
  }

  // Sort: numeric problem numbers first (ascending), then null problem numbers (alphabetically by title)
  problems.sort((a, b) => {
    if (a.number !== null && b.number !== null) {
      return a.number - b.number;
    }
    if (a.number !== null) return -1;
    if (b.number !== null) return 1;
    return a.title.localeCompare(b.title);
  });

  const output = {
    lastUpdated: new Date().toISOString(),
    stats: {
      total: problems.length,
      difficulty: {
        Easy: problems.filter(p => p.difficulty === 'Easy').length,
        Medium: problems.filter(p => p.difficulty === 'Medium').length,
        Hard: problems.filter(p => p.difficulty === 'Hard').length
      },
      platform: {
        LeetCode: problems.filter(p => p.platform === 'LeetCode').length,
        GFG: problems.filter(p => p.platform === 'GFG').length
      },
      languages: {}
    },
    problems
  };

  // Calculate language stats
  problems.forEach(p => {
    p.languages.forEach(lang => {
      output.stats.languages[lang] = (output.stats.languages[lang] || 0) + 1;
    });
  });

  fs.writeFileSync(path.join(ROOT_DIR, 'data.json'), JSON.stringify(output, null, 2));
  console.log(`Successfully generated data.json with ${problems.length} problems!`);
  console.log('Stats:', JSON.stringify(output.stats, null, 2));
}

run();
