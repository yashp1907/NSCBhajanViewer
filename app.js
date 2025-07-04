let bhajans = [];

function processAndCleanData(data) {
  return data
    .filter(row => row["Name"] && row["English Lyrics"] && row["Gujarati Lyrics"])
    .map((row, index) => ({
      id: index + 1,
      title: row["Name"].trim(),
      gujarati: row["Gujarati Lyrics"].trim(),
      english: row["English Lyrics"].trim()
    }));
}

function displayBhajans(bhajansToShow) {
  const bhajanList = document.getElementById('bhajanList');
  if (bhajanList) {
    bhajanList.innerHTML = '';
    bhajansToShow.forEach(bhajan => {
      const card = document.createElement('div');
      card.className = 'bhajan-card';
      // Replace \n with <br> for the preview snippet
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

function loadBhajanDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const bhajanId = parseInt(urlParams.get('id'));
  const bhajan = bhajans.find(b => b.id === bhajanId);
  if (bhajan && document.getElementById('bhajanDetails')) {
    document.getElementById('bhajanTitle').textContent = bhajan.title;
    // Replace \n with <br> for lyrics display
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
      displayBhajans(bhajans);
      loadBhajanDetails();
    })
    .catch(err => console.error('Error loading JSON:', err));
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
});