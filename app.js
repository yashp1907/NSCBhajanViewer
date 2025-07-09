let bhajans = [];
let homeButton = document.getElementById('homeButton');

function processAndCleanData(data) {
  return data
    .filter(row => row["Name"] && row["English Lyrics"] && row["Gujarati Lyrics"])
    .map((row, index) => ({
      id: index + 1,
      title: row["Name"].trim(),
      gujarati: row["Gujarati Lyrics"].trim(),
      english: row["English Lyrics"].trim(),
      category: row["Category:"]?.trim(),
      link: row["Link"]?.trim()
    }));
}

function displayBhajans(bhajansToShow) {
  const bhajanList = document.getElementById('bhajanList');
  if (bhajanList) {
    bhajanList.innerHTML = '';
    bhajansToShow.forEach(bhajan => {
      const card = document.createElement('div');
      card.className = 'bhajan-card';
      const preview = bhajan.gujarati.replace(/\n/g, '<br>').slice(0, 50) + '...';
      card.innerHTML = `
        <h3>${bhajan.title}</h3>
        <p>${preview}</p>
      `;
      card.addEventListener('click', () => {
        window.location.href = `bhajan.html?id=${bhajan.id}`;
      });
      bhajanList.appendChild(card);
    });
  }
}

function displayCategories() {
  const categoryList = document.getElementById('categoryList');
  if (categoryList) {
    const categories = [...new Set(bhajans.map(b => b.category).filter(c => c))];
    categoryList.innerHTML = '';
    categories.forEach(category => {
      const section = document.createElement('div');
      section.className = 'category-section';
      section.innerHTML = `<h3>${category}</h3>`;
      const bhajanList = document.createElement('ul');
      bhajanList.className = 'bhajan-list';
      const filteredBhajans = bhajans.filter(b => b.category === category);
      filteredBhajans.forEach(bhajan => {
        const listItem = document.createElement('li');
        listItem.className = 'bhajan-item';
        listItem.innerHTML = `<a href="bhajan.html?id=${bhajan.id}" class="bhajan-link">${bhajan.title}</a>`;
        bhajanList.appendChild(listItem);
      });
      section.appendChild(bhajanList);
      categoryList.appendChild(section);
    });
  }
}

function loadBhajanDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const bhajanId = parseInt(urlParams.get('id'));
  const bhajan = bhajans.find(b => b.id === bhajanId);
  if (bhajan && document.getElementById('bhajanDetails')) {
    document.getElementById('bhajanTitle').textContent = bhajan.title;
    document.getElementById('gujaratiLyrics').innerHTML = bhajan.gujarati.replace(/\n/g, '<br>');
    document.getElementById('englishLyrics').innerHTML = bhajan.english.replace(/\n/g, '<br>');
    const videoIframe = document.getElementById('bhajanVideo');
    if (bhajan.link) {
      const videoId = bhajan.link.match(/(?:v=)([^&]+)/)?.[1] || bhajan.link.match(/(?:embed\/)([^?]+)/)?.[1];
      if (videoId) {
        videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
      } else {
        videoIframe.style.display = 'none';
      }
    } else {
      videoIframe.style.display = 'none';
    }
  }
}

function displaySearchSuggestions(searchTerm) {
  const suggestionsContainer = document.getElementById('searchSuggestions');
  if (!suggestionsContainer) return;

  suggestionsContainer.innerHTML = '';
  if (!searchTerm.trim()) {
    suggestionsContainer.classList.remove('active');
    return;
  }

  const searchTermLower = searchTerm.toLowerCase();
  const filteredBhajans = bhajans
    .map(bhajan => {
      const titleMatch = bhajan.title.toLowerCase().includes(searchTermLower) ? 2 : 0;
      const gujaratiMatch = bhajan.gujarati.toLowerCase().includes(searchTermLower) ? 1 : 0;
      const englishMatch = bhajan.english.toLowerCase().includes(searchTermLower) ? 1 : 0;
      return { bhajan, score: titleMatch + gujaratiMatch + englishMatch };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.bhajan.title.localeCompare(b.bhajan.title))
    .map(item => item.bhajan)
    .slice(0, 5); // Limit to 5 suggestions

  if (filteredBhajans.length === 0) {
    suggestionsContainer.classList.remove('active');
    return;
  }

  filteredBhajans.forEach(bhajan => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `
      ${bhajan.title}
      <span>${bhajan.category || 'No Category'}</span>
    `;
    suggestionItem.addEventListener('click', () => {
      window.location.href = `bhajan.html?id=${bhajan.id}`;
      suggestionsContainer.classList.remove('active');
      document.getElementById('searchBar').value = '';
    });
    suggestionsContainer.appendChild(suggestionItem);
  });

  suggestionsContainer.classList.add('active');
}

function loadBhajans() {
  fetch('kirtans.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load JSON file');
      return response.text();
    })
    .then(text => {
      const data = JSON.parse(text);
      bhajans = processAndCleanData(data);
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      if (category) {
        const filteredBhajans = bhajans.filter(b => b.category === decodeURIComponent(category));
        displayBhajans(filteredBhajans);
      } else {
        displayBhajans(bhajans);
      }
      loadBhajanDetails();
      displayCategories();
    })
    .catch(err => console.error('Error loading JSON:', err));
}

function setupNavigation() {
  const homeLink = document.getElementById('homeLink');
  const categoriesLink = document.getElementById('categoriesLink');
  
  if (homeLink) { 
    homeLink.addEventListener('click', () => {
      window.location.href = 'index.html';
    });   
  }

homeButton?.addEventListener('click', () => {
    window.location.href = 'index.html';
    console.log('Home button clicked');
});

  if (categoriesLink) {
    categoriesLink.addEventListener('click', () => {
      window.location.href = 'categories.html';
    });
  }
}

function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

function setupSearch() {
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      const searchTerm = e.target.value;
      displaySearchSuggestions(searchTerm);
    });

    searchBar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const searchTerm = e.target.value;
        const searchTermLower = searchTerm.toLowerCase();
        const filteredBhajans = bhajans
          .map(bhajan => {
            const titleMatch = bhajan.title.toLowerCase().includes(searchTermLower) ? 2 : 0;
            const gujaratiMatch = bhajan.gujarati.toLowerCase().includes(searchTermLower) ? 1 : 0;
            const englishMatch = bhajan.english.toLowerCase().includes(searchTermLower) ? 1 : 0;
            return { bhajan, score: titleMatch + gujaratiMatch + englishMatch };
          })
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score || a.bhajan.title.localeCompare(b.bhajan.title))
          .map(item => item.bhajan);
        displayBhajans(filteredBhajans);
        document.getElementById('searchSuggestions').classList.remove('active');
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      const suggestionsContainer = document.getElementById('searchSuggestions');
      if (!searchBar.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.classList.remove('active');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBhajans();
  setupNavigation();
  setupThemeToggle();
  setupSearch();
});