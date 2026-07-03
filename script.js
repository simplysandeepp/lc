/**
 * My LeetCode Journey - Portfolio Javascript
 * Handles theme toggling, data fetching, counter animations, sorting, search, filtering, and lazy loading.
 */

// Configuration constants
const ITEMS_PER_PAGE = 24;

// State management
let allProblems = [];
let filteredProblems = [];
let currentOffset = 0;
let statsData = {};

// DOM Elements
const elements = {
  // Theme Toggle
  themeToggle: document.getElementById('theme-toggle'),
  body: document.body,
  
  // Hero Stats
  quickTotal: document.getElementById('quick-total'),
  quickJava: document.getElementById('quick-java'),
  quickSql: document.getElementById('quick-sql'),
  quickPython: document.getElementById('quick-python'),
  quickUpdated: document.getElementById('quick-updated'),
  
  // Dashboard Stat Cards
  statTotal: document.getElementById('stat-total'),
  statEasy: document.getElementById('stat-easy'),
  statMedium: document.getElementById('stat-medium'),
  statHard: document.getElementById('stat-hard'),
  statJava: document.getElementById('stat-java'),
  statSql: document.getElementById('stat-sql'),
  statPython: document.getElementById('stat-python'),
  statLeetcode: document.getElementById('stat-leetcode'),
  statGfg: document.getElementById('stat-gfg'),
  
  // Filters and Search
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  filterDifficulty: document.getElementById('filter-difficulty'),
  filterPlatform: document.getElementById('filter-platform'),
  filterLanguage: document.getElementById('filter-language'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),
  sortSelect: document.getElementById('sort-select'),
  filtersBar: document.getElementById('filters-bar'),
  filtersWrapper: document.querySelector('.filters-section-wrapper'),
  
  // Grid & Load States
  problemsGrid: document.getElementById('problems-grid'),
  loadingContainer: document.getElementById('loading-container'),
  noResults: document.getElementById('no-results'),
  resetNoResultsBtn: document.getElementById('reset-no-results-btn'),
  loadMoreContainer: document.getElementById('load-more-container'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  currentCount: document.getElementById('current-count'),
  totalCount: document.getElementById('total-count'),
  
  // Navigation
  scrollToTopBtn: document.getElementById('scroll-to-top')
};

// --------------------------------------------------------------------------
// 1. Theme Management (Dark / Light Mode)
// --------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    elements.body.classList.remove('dark-theme');
    elements.body.classList.add('light-theme');
    elements.themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    elements.body.classList.remove('light-theme');
    elements.body.classList.add('dark-theme');
    elements.themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

function toggleTheme() {
  const isDark = elements.body.classList.contains('dark-theme');
  if (isDark) {
    elements.body.classList.remove('dark-theme');
    elements.body.classList.add('light-theme');
    elements.themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('theme', 'light');
  } else {
    elements.body.classList.remove('light-theme');
    elements.body.classList.add('dark-theme');
    elements.themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
  }
}

// --------------------------------------------------------------------------
// 2. Animated Stats Counters
// --------------------------------------------------------------------------
function animateCounter(el, target, duration = 1000) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.floor(start + easeProgress * (target - start));
    
    el.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  
  requestAnimationFrame(update);
}

function updateStats(stats, lastUpdated) {
  // Format and update last updated date
  if (elements.quickUpdated) {
    elements.quickUpdated.textContent = formatDate(lastUpdated);
  }

  const javaCount = stats.languages['Java'] || 0;
  const sqlCount = stats.languages['SQL'] || 0;
  const pythonCount = stats.languages['Python'] || 0;

  // Run animations for hero summary stats
  animateCounter(elements.quickTotal, stats.total);
  animateCounter(elements.quickJava, javaCount);
  animateCounter(elements.quickSql, sqlCount);
  animateCounter(elements.quickPython, pythonCount);

  // Run animations for Dashboard cards
  animateCounter(elements.statTotal, stats.total);
  animateCounter(elements.statEasy, stats.difficulty.Easy || 0);
  animateCounter(elements.statMedium, stats.difficulty.Medium || 0);
  animateCounter(elements.statHard, stats.difficulty.Hard || 0);
  animateCounter(elements.statJava, javaCount);
  animateCounter(elements.statSql, sqlCount);
  animateCounter(elements.statPython, pythonCount);
  animateCounter(elements.statLeetcode, stats.platform.LeetCode || 0);
  animateCounter(elements.statGfg, stats.platform.GFG || 0);
}

function formatDate(isoString) {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return '-';
  }
}

// --------------------------------------------------------------------------
// 3. Problem Rendering & Card Construction
// --------------------------------------------------------------------------
function createCardHtml(problem) {
  const numText = problem.number !== null 
    ? `#${String(problem.number).padStart(4, '0')}` 
    : '#---';
    
  const diffClass = problem.difficulty.toLowerCase();
  const platformClass = problem.platform.toLowerCase();
  
  // Construct language badges list
  const langBadges = problem.languages.map(lang => {
    const cleanLangClass = lang.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `<span class="badge ${cleanLangClass}">${lang}</span>`;
  }).join('');

  // Absolute path tree structure on GitHub Pages
  // Using relative path to standard tree/main/ of the repo
  const repoFolderUrl = `https://github.com/simplysandeepp/lc/tree/main/${encodeURIComponent(problem.path)}`;

  return `
    <div class="problem-card">
      <div class="card-header-meta">
        <span class="prob-num">${numText}</span>
        <div class="badges-container">
          <span class="badge ${diffClass}">${problem.difficulty}</span>
          <span class="badge ${platformClass}">${problem.platform}</span>
        </div>
      </div>
      <h4 class="prob-title" title="${problem.title}">${problem.title}</h4>
      <div class="card-footer">
        <div class="languages-list">
          ${langBadges}
        </div>
        <a href="${repoFolderUrl}" target="_blank" rel="noopener noreferrer" class="btn-github">
          <i class="fa-brands fa-github"></i> Solution
        </a>
      </div>
    </div>
  `;
}

function renderProblems(append = false) {
  if (!append) {
    elements.problemsGrid.innerHTML = '';
    currentOffset = 0;
  }

  const limit = Math.min(currentOffset + ITEMS_PER_PAGE, filteredProblems.length);
  
  if (filteredProblems.length === 0) {
    elements.problemsGrid.style.display = 'none';
    elements.noResults.style.display = 'flex';
    elements.loadMoreContainer.style.display = 'none';
    elements.currentCount.textContent = 0;
    elements.totalCount.textContent = 0;
    return;
  }

  elements.problemsGrid.style.display = 'grid';
  elements.noResults.style.display = 'none';

  let htmlBuffer = '';
  for (let i = currentOffset; i < limit; i++) {
    htmlBuffer += createCardHtml(filteredProblems[i]);
  }
  
  if (append) {
    elements.problemsGrid.insertAdjacentHTML('beforeend', htmlBuffer);
  } else {
    elements.problemsGrid.innerHTML = htmlBuffer;
  }

  currentOffset = limit;
  elements.currentCount.textContent = currentOffset;
  elements.totalCount.textContent = filteredProblems.length;

  // Show/Hide load more button
  if (currentOffset < filteredProblems.length) {
    elements.loadMoreContainer.style.display = 'flex';
  } else {
    elements.loadMoreContainer.style.display = 'none';
  }
}

// --------------------------------------------------------------------------
// 4. Searching, Filtering, and Sorting
// --------------------------------------------------------------------------
function filterAndSortProblems() {
  const query = elements.searchInput.value.toLowerCase().trim();
  const difficulty = elements.filterDifficulty.value;
  const platform = elements.filterPlatform.value;
  const language = elements.filterLanguage.value;
  const sortBy = elements.sortSelect.value;

  // Filter
  filteredProblems = allProblems.filter(problem => {
    // 1. Search Query (Number match or title match)
    // 1. Search Query (Number match or title match, supports '#' prefix and padding)
    let matchesSearch = true;
    if (query !== '') {
      const cleanQuery = query.replace('#', '');
      const paddedNumber = problem.number !== null ? String(problem.number).padStart(4, '0') : '';
      const rawNumber = problem.number !== null ? String(problem.number) : '';
      
      matchesSearch = problem.title.toLowerCase().includes(cleanQuery) || 
                      rawNumber.includes(cleanQuery) || 
                      paddedNumber.includes(cleanQuery);
    }

    // 2. Difficulty Filter
    const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;

    // 3. Platform Filter
    const matchesPlatform = platform === 'all' || problem.platform === platform;

    // 4. Language Filter
    const matchesLanguage = language === 'all' || problem.languages.includes(language);

    return matchesSearch && matchesDifficulty && matchesPlatform && matchesLanguage;
  });

  // Sort
  filteredProblems.sort((a, b) => {
    switch (sortBy) {
      case 'num-asc':
        if (a.number !== null && b.number !== null) return a.number - b.number;
        if (a.number !== null) return -1;
        if (b.number !== null) return 1;
        return a.title.localeCompare(b.title);
        
      case 'num-desc':
        if (a.number !== null && b.number !== null) return b.number - a.number;
        if (a.number !== null) return -1;
        if (b.number !== null) return 1;
        return b.title.localeCompare(a.title);
        
      case 'title-asc':
        return a.title.localeCompare(b.title);
        
      case 'title-desc':
        return b.title.localeCompare(a.title);
        
      default:
        return 0;
    }
  });

  // Render first page
  renderProblems(false);
}

function handleSearchInput() {
  const val = elements.searchInput.value;
  if (val.length > 0) {
    elements.clearSearchBtn.style.display = 'block';
  } else {
    elements.clearSearchBtn.style.display = 'none';
  }
  filterAndSortProblems();
}

function clearSearch() {
  elements.searchInput.value = '';
  elements.clearSearchBtn.style.display = 'none';
  filterAndSortProblems();
  elements.searchInput.focus();
}

function resetFilters() {
  elements.searchInput.value = '';
  elements.clearSearchBtn.style.display = 'none';
  elements.filterDifficulty.value = 'all';
  elements.filterPlatform.value = 'all';
  elements.filterLanguage.value = 'all';
  elements.sortSelect.value = 'num-asc';
  filterAndSortProblems();
}

// --------------------------------------------------------------------------
// 5. Scroll and Layout interactions (Sticky Header & Scroll to Top)
// --------------------------------------------------------------------------
function handleScroll() {
  const scrollPosition = window.scrollY;

  // Sticky Filters Bar (Desktop only)
  if (elements.filtersWrapper && elements.filtersBar) {
    if (window.innerWidth > 768) {
      const rect = elements.filtersWrapper.getBoundingClientRect();
      const headerHeight = 75; // Matches header CSS height
      
      if (rect.top <= headerHeight) {
        elements.filtersWrapper.style.minHeight = `${elements.filtersBar.offsetHeight}px`;
        elements.filtersBar.classList.add('sticky');
      } else {
        elements.filtersWrapper.style.minHeight = '';
        elements.filtersBar.classList.remove('sticky');
      }
    } else {
      elements.filtersWrapper.style.minHeight = '';
      elements.filtersBar.classList.remove('sticky');
    }
  }

  // Scroll to Top Button
  if (scrollPosition > 300) {
    elements.scrollToTopBtn.classList.add('show');
  } else {
    elements.scrollToTopBtn.classList.remove('show');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// --------------------------------------------------------------------------
// 6. Data Fetching & Initializing App
// --------------------------------------------------------------------------
async function initApp() {
  initTheme();
  
  // Bind simple UI event listeners
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.scrollToTopBtn.addEventListener('click', scrollToTop);
  
  // Bind filtering, sorting, and search events
  elements.searchInput.addEventListener('input', handleSearchInput);
  elements.clearSearchBtn.addEventListener('click', clearSearch);
  elements.filterDifficulty.addEventListener('change', filterAndSortProblems);
  elements.filterPlatform.addEventListener('change', filterAndSortProblems);
  elements.filterLanguage.addEventListener('change', filterAndSortProblems);
  elements.sortSelect.addEventListener('change', filterAndSortProblems);
  
  elements.resetFiltersBtn.addEventListener('click', resetFilters);
  elements.resetNoResultsBtn.addEventListener('click', resetFilters);
  
  elements.loadMoreBtn.addEventListener('click', () => renderProblems(true));
  
  // Bind scroll window event
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);

  try {
    // Fetch data.json
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`Failed to load data.json: ${response.statusText}`);
    }
    
    const data = await response.json();
    allProblems = data.problems || [];
    statsData = data.stats || {};
    const lastUpdated = data.lastUpdated || new Date().toISOString();

    // Remove loading container, display content
    elements.loadingContainer.style.display = 'none';

    // Populate dashboard statistics and trigger animated counters
    updateStats(statsData, lastUpdated);

    // Initial filter and render
    filterAndSortProblems();
    
  } catch (error) {
    console.error('Error initializing My LeetCode Journey website:', error);
    elements.loadingContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-hard);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h4>Failed to load solution data</h4>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">${error.message}</p>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Make sure data.json exists and is valid JSON.</p>
      </div>
    `;
  }
}

// Launch application on DOM content load
document.addEventListener('DOMContentLoaded', initApp);
