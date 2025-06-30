let searchIndex = [];

async function loadSearchIndex() {
  try {
    const res = await fetch('src/data/search-index.json');
    searchIndex = await res.json();
  } catch (err) {
    console.error('Failed to load search index:', err);
  }
}

function searchSite(query) {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return [];

  return searchIndex.filter(entry =>
    entry.title.toLowerCase().includes(lowerQuery) ||
    entry.content.toLowerCase().includes(lowerQuery)
  );
}

function showPopup(results) {
  const popup = document.getElementById('searchPopup');
  popup.innerHTML = '';

  if (results.length === 0) {
    popup.innerHTML = '<div class="resultItem">No results found</div>';
  } else {
    results.forEach(result => {
      const div = document.createElement('div');
      div.classList.add('resultItem');
      div.innerHTML = `<a href="${result.url}"><strong>${result.title}</strong></a><p>${result.content.substring(0, 100)}...</p>`;
      popup.appendChild(div);
    });
  }

  popup.classList.remove('hidden');
}

function hidePopup() {
  const popup = document.getElementById('searchPopup');
  popup.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadSearchIndex();

  const input = document.getElementById('searchInput');
  const popup = document.getElementById('searchPopup');

  input.addEventListener('input', () => {
    const query = input.value;
    const results = searchSite(query);
    if (query.trim() === '') {
      hidePopup();
    } else {
      showPopup(results);
    }
  });

  // Hide popup when clicking outside
  document.addEventListener('click', e => {
    if (!popup.contains(e.target) && e.target !== input) {
      hidePopup();
    }
  });

  // Hide on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hidePopup();
  });
});