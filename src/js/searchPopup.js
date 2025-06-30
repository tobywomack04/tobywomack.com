const searchInput = document.getElementById("searchInput");
const resultsDropdown = document.getElementById("searchResults");

async function fetchIndex() {
  const res = await fetch('/src/data/search-index.json');
  return await res.json();
}

function highlightMatch(content, term) {
  const regex = new RegExp(`(.{0,40})(${term})(.{0,40})`, 'i');
  const match = content.match(regex);
  return match ? `${match[1]}${match[2]}${match[3]}` : '';
}

function renderResults(results, term) {
  resultsDropdown.innerHTML = '';

  if (results.length === 0) {
    const noResult = document.createElement("div");
    noResult.className = "searchResultItem";
    noResult.textContent = "No results found.";
    resultsDropdown.appendChild(noResult);
    return;
  }

  results.forEach(result => {
    const item = document.createElement("div");
    item.className = "searchResultItem";

    const link = document.createElement("a");
    link.href = result.url;
    link.textContent = result.title;
    link.className = "searchResultTitle";

    const preview = document.createElement("div");
    preview.textContent = highlightMatch(result.content, term);
    preview.className = "searchResultSnippet";

    item.appendChild(link);
    item.appendChild(preview);
    resultsDropdown.appendChild(item);
  });

  resultsDropdown.style.display = "block";
}

fetchIndex().then(indexData => {
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    if (term.length < 2) {
      resultsDropdown.innerHTML = "";
      resultsDropdown.style.display = "none";
      return;
    }

    const filtered = indexData.filter(entry =>
      entry.content.toLowerCase().includes(term)
    );

    renderResults(filtered, term);
  });
});