function toggleSearch(event) {
  event.preventDefault();
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');

  if (searchBar.classList.contains('visible')) {
    searchBar.classList.remove('visible');
    hidePopup();
    searchInput.value = '';
  } else {
    searchBar.classList.add('visible');
    searchInput.focus();
  }
}

function hidePopup() {
  const popup = document.getElementById('searchPopup');
  popup.classList.add('hidden');
}