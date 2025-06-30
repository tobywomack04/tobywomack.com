let searchIndex = [];

async function loadSearchIndex() {
  try {
    const res = await fetch('/src/data/search-index.json');
    searchIndex = await res.json();
  } catch (err) {
    console.error('Failed to load search index:', err);
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatch(content, term) {
  const safeTerm = escapeRegex(term);
  const regex = new RegExp(`(.{0,40})(${safeTerm})(.{0,40})`, 'i');
  const match = content.match(regex);
  return match
    ? `${match[1]}<mark>${match[2]}</mark>${match[3]}`
    : '';
}

function searchSite(query) {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return [];

  return searchIndex.filter(entry =>
    entry.title.toLowerCase().includes(lowerQuery) ||
    entry.content.toLowerCase().includes(lowerQuery)
  );
}

function showPopup(results, term) {
  const popup = document.getElementById('searchPopup');
  popup.innerHTML = '';

  if (results.length === 0) {
    popup.innerHTML = '<div class="resultItem">No results found</div>';
  } else {
    results.forEach(result => {
      const div = document.createElement('div');
      div.classList.add('resultItem');

      const titleLink = `<a href="${result.url}"><strong>${result.title}</strong></a>`;
      const snippet = `<p>${highlightMatch(result.content, term)}...</p>`;

      div.innerHTML = titleLink + snippet;
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
    if (query.trim() === '') {
      hidePopup();
      return;
    }

    const results = searchSite(query);
    showPopup(results, query.trim());
  });

  document.addEventListener('click', e => {
    if (!popup.contains(e.target) && e.target !== input) {
      hidePopup();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      hidePopup();
      input.blur();
    }
  });
});