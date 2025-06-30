function toggleSearch(event) {
  event.preventDefault();
  const searchBar = document.querySelector('.searchBar');
  if (!searchBar) return;

  searchBar.classList.toggle('visible');

  if (searchBar.classList.contains('visible')) {
    document.getElementById('searchInput').focus();
  }
}

window.toggleSearch = toggleSearch;