// Fade-out before navigating
function fadeAndRedirect(event, href) {
	event.preventDefault();
  document.body.classList.add('fadeOut');
  setTimeout(() => {
    window.location.href = href;
  }, 600);
}

// Fade-in on load
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('fadeOut');

  document.querySelectorAll('a[pageFade]').forEach(link => {
    link.addEventListener('click', event => {
      fadeAndRedirect(event, link.href);
    });
  });
});