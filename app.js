let bhajans = [];

function processAndCleanData(data) {
  return data
    .filter(row => row["Name"] && row["English Lyrics"] && row["Gujarati Lyrics"])
    .map((row, index) => ({
      id: index + 1,
      title: row["Name"].trim(),
      gujarati: row["Gujarati Lyrics"].trim(),
      english: row["English Lyrics"].trim(),
      category: row["Category:"]?.trim()
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
  }
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
  
  if (categoriesLink) {
    categoriesLink.addEventListener('click', () => {
      window.location.href = 'categories.html';
    });
  }
}

document.getElementById('searchBar')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredBhajans = bhajans.filter(bhajan =>
    bhajan.title.toLowerCase().includes(searchTerm) ||
    bhajan.gujarati.toLowerCase().includes(searchTerm) ||
    bhajan.english.toLowerCase().includes(searchTerm)
  );
  displayBhajans(filteredBhajans);
});

document.addEventListener('DOMContentLoaded', () => {
  loadBhajans();
  setupNavigation();
});