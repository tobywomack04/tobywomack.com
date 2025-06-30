const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('ul.nav');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});