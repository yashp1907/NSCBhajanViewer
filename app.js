const bhajans = [
  {
    id: 1,
    title: "Jai Adhyashakti",
    gujarati: "જય આદ્યશક્તિ, જય આદ્યશક્તિ, મા જય આદ્યશક્તિ...",
    english: "Jai Adhyashakti, Jai Adhyashakti, Maa Jai Adhyashakti...",
    translation: "Victory to the primordial energy, the divine mother..."
  },
  {
    id: 2,
    title: "Om Jai Jagdish",
    gujarati: "ઓમ જય જગદીશ હરે, સ્વામી જય જગદીશ હરે...",
    english: "Om Jai Jagdish Hare, Swami Jai Jagdish Hare...",
    translation: "Glory to the Lord of the Universe, who removes sorrows..."
  }
];

function displayBhajans(bhajansToShow) {
  const bhajanList = document.getElementById('bhajanList');
  if (bhajanList) {
    bhajanList.innerHTML = '';
    bhajansToShow.forEach(bhajan => {
      const card = document.createElement('div');
      card.className = 'bhajan-card';
      card.innerHTML = `
        <h3>${bhajan.title}</h3>
        <p>${bhajan.gujarati.slice(0, 50)}...</p>
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
    document.getElementById('gujaratiLyrics').textContent = bhajan.gujarati;
    document.getElementById('englishLyrics').textContent = bhajan.english;
  }
}

document.getElementById('searchBar')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredBhajans = bhajans.filter(bhajan =>
    bhajan.title.toLowerCase().includes(searchTerm) ||
    bhajan.gujarati.includes(searchTerm) ||
    bhajan.english.includes(searchTerm)
  );
  displayBhajans(filteredBhajans);
});

document.addEventListener('DOMContentLoaded', () => {
  displayBhajans(bhajans);
  loadBhajanDetails();
});