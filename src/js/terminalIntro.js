window.addEventListener('DOMContentLoaded', () => {
  const INTRO_INTERVAL_MINUTES = 60;
  const lastVisit = localStorage.getItem('lastIntroTime');
  const now = new Date().getTime();

  const intro = document.getElementById('terminalIntro');
  const container = document.getElementById('typewriter');

  if (!intro || !container) return;

  if (lastVisit && now - parseInt(lastVisit) < INTRO_INTERVAL_MINUTES * 60 * 1000) {
    intro.style.display = 'none';
    return;
  }

  localStorage.setItem('lastIntroTime', now.toString());

  const lines = [
    "[SYSTEM] Boot sequence initiated...",
    "[API] Establishing connection...",
    "[STATUS] Environment stable. Launching UI..."
  ];

  let lineIndex = 0;
  let charIndex = 0;

  function playTypingSound() {
    // Audio found at: https://freesound.org/people/gamer500/sounds/679319/ | Uploaded by: gamer500 | Last Accessed: 26/06/2025
    const sound = new Audio('media/typing.wav');
    sound.volume = 0.3;
    sound.play().catch(() => {});
  }

  function typeLine() {
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        intro.style.opacity = '0';
      }, 1000);
      setTimeout(() => {
        intro.style.display = 'none';
      }, 2000);
      return;
    }

    const lineElement = document.createElement('p');
    lineElement.innerHTML = '';
    container.appendChild(lineElement);

    function typeChar() {
      if (charIndex < lines[lineIndex].length) {
        lineElement.innerHTML =
          lines[lineIndex].slice(0, charIndex++) + '<span class="blinking">_</span>';
        
        playTypingSound(); // ← play for each character

        setTimeout(typeChar, 20);
      } else {
        lineElement.innerHTML = lines[lineIndex];
        charIndex = 0;
        lineIndex++;
        setTimeout(typeLine, 200);
      }
    }

    typeChar();
  }

  typeLine();
});